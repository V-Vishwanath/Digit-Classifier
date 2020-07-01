let canvas = document.querySelector('#canvas');
canvas.width = canvas.height = 280;

let pen = canvas.getContext('2d');

(async () => {
    const model = await tf.loadLayersModel('./DigitClassifier/model.json')
    window.model = model;
    erase_board();
    alert('ready!');
})();

let rect = canvas.getBoundingClientRect();
let dx = rect.left;
let dy = rect.top;

let active = false;

let image;

function draw(event) {
    if(!active) return;

    let x = event.clientX - dx;
    let y = event.clientY - dy;

    pen.lineCap = 'round';
    pen.lineWidth = 20;
    pen.lineTo(x, y);

    pen.strokeStyle = 'black';
    pen.stroke();

    pen.moveTo(x, y);
    
}

function activate(event) {
    active = true;
    pen.beginPath();
}

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', activate);
canvas.addEventListener('mouseup', () => {active = false;})
canvas.addEventListener('mouseout', () => {active = false;})

canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchstart', activate);
canvas.addEventListener('touchend', () => {active = false;})
canvas.addEventListener('touchcancel', () => {active = false;})


function erase_board() {
    pen.fillStyle = 'white';
    pen.rect(0, 0, 280, 280);
    pen.fill();
}

function predict() {
    image = tf.browser.fromPixels(canvas, 1);
    image = tf.image.resizeBilinear(image, [28, 28]);
    image = image.expandDims(0);

    let preds = model.predict(image);
    let prediction = tf.argMax(preds, 1).dataSync();

    alert('I think that is a ' + prediction);

    erase_board();
}

document.querySelector('#reset').addEventListener('click', erase_board);
document.querySelector('#predict').addEventListener('click', predict);