//Underwater creatures
class Fish extends Mover {
  constructor(x, y, m) {
    super(x, y, m);
    this.vel = createVector(0, random(-1, 1));
    this.lifeSpan = 2048;
    this.direction = 1;
  }
  display() {
    strokeWeight(8);
    if (this.lifeSpan > 1024) {
        stroke(145, 0, 255);
    } else if (this.lifeSpan > 512) {
        stroke(177, 76, 255);
    } else {
        stroke(206, 143, 255);
    }
    point(this.pos.x, this.pos.y);
    
    fill(255);
    noStroke();
    textSize(8);
    text(this.lifeSpan,this.pos.x, this.pos.y - 10);
  }
  update() {
    //Pushes forward once it loses moment.
    if (this.direction === 1) {
        if (this.vel.x <= 0.5) {
            this.acc.x = 2 * this.direction;
        }
    } else {
        if (this.vel.x >= -0.5) {
            this.acc.x = 2 * this.direction;
        }
    }
    //Update movement
    this.vel.add(this.acc);
    this.vel.limit(3);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //Update lifespan
    this.lifeSpan--;
  }
  checkEdges() {
    //horizontal edges
    if (this.pos.x > width) {
      this.direction *= -1;
      this.pos.x = width - 5;
    } 
    else if (this.pos.x < 0) {
      this.direction *= -1;
      this.pos.x = 5;
    }
    //vertical edges
    if (this.pos.y > bottom) {
      this.pos.y = bottom;
    } 
    else if (this.pos.y < waterLevel) {
      this.pos.y = waterLevel;
    }
  }
  isDead() {
    if (this.lifeSpan < 0) {
      return true;
    } else {
      return false;
    }
  }
}
//Creature generator
class fishSpawn {
  constructor(origin) {
    this.origin = origin;
    this.fish = [];
    this.spawnRate = floor(random(400, 600));
    this.maxFish = 5;
    //image dimensions
    this.height = 50;
    this.width = 100;
  }
  spawnFish() {
    if (this.fish.length < this.maxFish) {
      this.fish.push(new Fish(this.origin.x, this.origin.y,random(1,5)));
    }
  }
  update(water) {
    if ((frameCount % this.spawnRate) === 0) {
      this.spawnFish();
    }
        
    for (let i = this.fish.length - 1; i >= 0; i--) {
      let f = this.fish[i];
      if (water !== null) {
        let drag = water.calculateDrag(f);
        f.applyForce(drag);
      }
      f.update();
      f.checkEdges();
      f.display();
      if (f.isDead()) {
        this.fish.splice(i, 1);
      }
    }
  }
  display() {
    let x = this.origin.x - this.width / 2;
    let y = this.origin.y - this.height / 2;
    image(reef, x + 60, y - 40, 80, 80);
    image(boulder, x, y, this.width, this.height); 
  }
}