const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.height = innerHeight * devicePixelRatio;
canvas.width = innerWidth * devicePixelRatio;

const ship = new Shape({
    scale: 10,
    x: canvas.width/2,
    y: 50,
    points: [{x:-2, y:-3}, {x:2, y:-3}, {x:0, y:3}]
});

const bullets = [];

animate();

function animate() {
    ctx.reset();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(1,-1);
    ctx.translate(-canvas.width/2, -canvas.height/2);
    
    ship.move();
    connectDots(ship);

    requestAnimationFrame(animate);
}


// USER INPUT

const inputs = {
    a: {press: false, run: val => {ship.vx -= val}},
    d: {press: false, run: val => {ship.vx += val}}
}

addEventListener('keydown', ({key}) => {
    if (!inputs[key] || inputs[key].press) return;
    inputs[key].press = true;
    inputs[key].run(1);
});

addEventListener('keyup', ({key}) => {
    if (!inputs[key]) return;
    inputs[key].press = false;
    inputs[key].run(-1);
});


// CONSTRUCTORS

function Shape({scale, x, y, vx = 0, vy = 0, points}) {
    [this.scale, this.x, this.y, this.vx, this.vy] = [scale, x, y, vx, vy];

    Object.defineProperty(this, 'points', {
        get() {return getCoordinates({...this, points});},
    });

    this.move = function() {this.x += 4*this.vx; this.y += 4*this.vy;};
}

function Bullet({x, y, vx = 0, vy = 10}) {
    [this.x, this.y] = [x, y];
    this.collided = false;
    this.collideTarget = {};
    this.draw = function() {ctx.fillRect(x,y,2,2);}
    this.move = function() {this.y += this.vy;}
    this.collisionDetect = function() {if (this.y > canvas.height) this.collided = true};
}


// OTHER

function getCoordinates({scale, x, y, points}) {
    const coordinates = points.map(obj => {return {x: obj.x*scale + x, y: obj.y*scale + y};});
    return coordinates;
}


// CANVAS DRAWING

function connectDots({points}) {
    const path = new Path2D();
    points.forEach(({x, y}) => {path.lineTo(x, y)});
    path.closePath();
    ctx.stroke(path);
}