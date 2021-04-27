let gravity;      //Gravity acceleration
let bottom;       //Ground y coordinate
let waterLevel;   //Water surface coordinate 
let waterHeight;  //Water depth

let pond;         //Water object
let food = [2];   //Fruit objects
let fly = [4];    //Fly objects
let cave;         //Fish generator


function preload() {
  boulder = loadImage("img/boulder.png");
  reef    = loadImage("img/reef.png");
  dirt    = loadImage("img/ground.png");
  leaves  = loadImage("img/leaves.png");
  bg      = loadImage("img/bg.png");
}

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("sketch-holder");
  angleMode = "radians";

  gravity = createVector(0, 0.05);
  bottom = height - 20;
  waterLevel = 280;
  waterHeight = 120;
  
  pond = new Water(waterLevel, waterHeight, 0.2);
  
  for (let i = 0; i < 4; i++) {
    if (i < 2) {
    food[i] = new Fruit(90 + 210*i, 60 + 60 * i, 1 + 0.1*i, 10);
    }
    fly[i] = new Fly(random(10, width), random(10, waterHeight), random(0.01, 0.02));
  }
  
  cave = new fishSpawn(createVector(50, height - 30));
}

function draw() {
  //Background
  //background(9, 56, 33);
  image(bg, 0, 0);
  //Fruits
  for (let i = 0; i < food.length; i++) {
        for (let j = 0; j < food[i].particles.length; j++) {
          if (pond.contains(food[i].particles[j])) {
            let drag = pond.calculateDrag(food[i].particles[j]);
            food[i].particles[j].applyForce(drag);
          }
        }
        food[i].update(cave);
        food[i].display();
  }
  //Top leaves
  image(leaves, 0, 0);
  //Bottom
  for (let i = 0; i < width; i += 80) {
        image(dirt, i-15, 380, 100, 25);    
  }
  //Flies
  for (let i = 0; i < 4; i++) {
        fly[i].display();
        for (let j = 0; j < food.length; j++) {
            let attraction = food[j].calculateAttraction(fly[i]);
            attraction.add(food[j].calculateAttraction(fly[i]));
            fly[i].applyForce(attraction);
        }
        fly[i].update();
        fly[i].checkEdges();
  }
  //Fish spawn
  cave.update(pond);
  cave.display();
  //Water
  pond.display();
}