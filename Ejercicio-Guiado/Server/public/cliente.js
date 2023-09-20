const socket = io()

let size = 20;
let r = 0;
let g = 0;
let b = 0;
let identificador = 0;

let elementos = [];
let cursores = [];

function setup(){
    createCanvas(400,400);
    r = int(Math.random()*255);
    g = int(Math.random()*255);
    b = int(Math.random()*255);
    identificador = int(Math.random()*1000);
    console.log("identificador:",identificador)
}

function draw(){
    background(220);

    elementos.forEach((elemento)=>{
        fill(elemento.r, elemento.g, elemento.b);
        ellipse(elemento.x, elemento.y, elemento.size, elemento.size);
    });

    cursores.forEach((elemento)=>{
        fill(0,0,0);
        ellipse(elemento.x, elemento.y, elemento.size, elemento.size);
    });

}

function mousePressed(){
    const elemento = {
        x: mouseX,
        y: mouseY,
        r: r,
        g: g,
        b: b,
        size
    };

    socket.emit('enviar-elemento', elemento);
}

function mouseDragged(){
    const elemento = {
        x: mouseX,
        y: mouseY,
        r: r,
        g: g,
        b: b,
        size,
        id: identificador
    };

    socket.emit('enviar-cursor', elemento);
}

socket.on('elemento-recibido', (elemento)=>{
    console.log("recibiendo-elemento:", elemento)
    elementos.push(elemento)
});

socket.on('cursor-recibido', (elemento)=>{
    console.log("recibiendo-cursor:", elemento)

    let cursorIndex = cursores.findIndex((item)=> elemento.id == item.id)

    if(cursorIndex!=-1){
        cursores[cursorIndex] = elemento;
    }else{
        cursores.push(elemento)
    }
})

function changeColor(newColor) {
    const color = hexToRgb(newColor);
    r = color.r;
    g = color.g;
    b = color.b;
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

function changeSize(newSize) {
    size = parseInt(newSize);
}