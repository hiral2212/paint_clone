const activeToolEl = document.getElementById("active-tool");
const brushColorBtn = document.getElementById("brush-color");
const brushIcon = document.getElementById("brush");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColorBtn = document.getElementById("bucket-color");
const eraser = document.getElementById("eraser");
const clearCanvasBtn = document.getElementById("clear-canvas");
const saveStorageBtn = document.getElementById("save-storage");
const loadStorageBtn = document.getElementById("load-storage");
const clearStorageBtn = document.getElementById("clear-storage");
const downloadBtn = document.getElementById("download");
const { body } = document;
/*global variable*/
const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context =
    canvas.getContext(
        "2d"
    ); /*get contecxt is method of the canvas which is use for 2d*/
let currentSize = 10;
let bucketColor = "#FFFFFF";
let currentColor = "#A51DAB";
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Formatting Brush Size
function displayBrushSize() {
    if (brushSlider.value < 10) {
        brushSize.textContent = `0${brushSlider.value}`;
    } else {
        brushSize.textContent = brushSlider.value;
    }
}

//Setting Brush Size
brushSlider.addEventListener("change", () => {
    currentSize = brushSlider.value;
    displayBrushSize();
});

// Setting Brush Color
brushColorBtn.addEventListener("change", () => {
    isEraser = false;
    currentColor = `#${brushColorBtn.value}`;
});
// Setting Background Color
bucketColorBtn.addEventListener("change", () => {
    bucketColor = `#${bucketColorBtn.value}`;
    createCanvas();
    restoreCanvas();
});
// Eraser
eraser.addEventListener("click", () => {
    isEraser = true;
    brushIcon.style.color = "white";
    eraser.style.color = "black";
    activeToolEl.textContent = "Eraser"; //when we will click on the eraser then it will change textcontent in eraser
    currentColor = bucketColor;
    currentSize = 50;
});

// Switch back to Brush
function switchToBrush() {
    isEraser = false;
    activeToolEl.textContent = "Brush";
    brushIcon.style.color = "black";
    eraser.style.color = "white";
    currentColor = `#${brushColorBtn.value}`;
    currentSize = 10;
    brushSlider.value = 10;
    displayBrushSize();
}
// Create Canvas
function createCanvas() {
    canvas.width = window.innerWidth; /*it's give current window width*/
    canvas.height = window.innerHeight - 50; /*it's give current window height*/
    /* -50 because i want to avoid top 50px*/
    context.fillStyle = bucketColor; /*background color variable*/
    context.fillRect(0, 0, canvas.width, canvas.height);
    body.appendChild(canvas);
    switchToBrush();
}
createCanvas();
//get mouse  position
function getMousePosition(event) {
    const boundaries = canvas.getBoundingClientRect();
    return {
        x: event.clientX - boundaries.left,
        y: event.clientY - boundaries.top,
    };
}
// Clear Canvas
clearCanvasBtn.addEventListener("click", () => {
    createCanvas(); //call the create canvas function
    drawnArray = []; //reset the array
    // Active Tool
    activeToolEl.textContent = "Canvas Cleared";
    setTimeout(switchToBrush, 1500);
});

//mouse down
canvas.addEventListener("mousedown", (event) => {
    isMouseDown = true;
    const currentPosition = getMousePosition(event);
    context.moveTo(currentPosition.x, currentPosition.y);
    //console.log('mouse  clicked',currentPosition);
    context.beginPath();
    context.lineWidth = currentSize;
    context.lineCap = "round";
    context.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener("mousemove", (event) => {
    if (isMouseDown) {
        const currentPosition = getMousePosition(event);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.stroke();
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentSize, //brush size
            currentColor, //brush color
            isEraser
        );
    } else {
        storeDrawn(undefined); // this means we are going to store whenever our mouse is moving between drawing or earsing somthing
    }
});
// Draw what is stored in DrawnArray
/* is going to do loop through drawn array and then it's going to use beginpath*/
function restoreCanvas() {
    for (let i = 1; i < drawnArray.length; i++) {
        context.beginPath();
        context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y); //[i-1].x and [i-1].y it going to looking for previous line
        context.lineWidth = drawnArray[i].size;
        context.lineCap = "round";
        if (drawnArray[i].eraser) {
            context.strokeStyle = bucketColor;
        } else {
            context.strokeStyle = drawnArray[i].color;
        }
        context.lineTo(drawnArray[i].x, drawnArray[i].y);
        context.stroke();
    }
}

function storeDrawn(x, y, size, color, erase) {
    const line = {
        x,
        y,
        size,
        color,
        erase,
    };
    console.log(line);
    drawnArray.push(line);
}

//mouse up
canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});

//save to local storage
// Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
    localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
    // Active Tool
    activeToolEl.textContent = 'Canvas Saved';
    setTimeout(switchToBrush, 1500);
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
    if (localStorage.getItem('savedCanvas')) {
        drawnArray = JSON.parse(localStorage.savedCanvas);
        restoreCanvas();
        // Active Tool
        activeToolEl.textContent = 'Canvas Loaded';
        setTimeout(switchToBrush, 1500);
    } else {
        activeToolEl.textContent = 'No Canvas Found';
        setTimeout(switchToBrush, 1500);
    }
});
//clear the local storage
clearStorageBtn.addEventListener('click', () => {
    localStorage.removeItem('savedCanvas');

    //active  tool
    activeToolEl.textContent = 'local storage is cleared';
    setTimeout(switchToBrush, 1500);
});

//download in our system
downloadBtn.addEventListener('click', () => {
    downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
    downloadBtn.download = 'paint-example.jpeg';

    //active tool
    activeToolEl.textContent = 'image downloaded';
    setTimeout(switchToBrush, 1500);
});