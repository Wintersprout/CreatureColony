class Wings {
  constructor(pos, speed) {
    this.pos = pos;
    this.flapSpeed = speed;
    this.angle = PI / 4;
    this.size = 6;
  }
  // Flaps the wings between PI/4 (45deg) and 3PI/4 (135deg)
  flap() {
        if ((this.angle < PI/4) && (this.flapSpeed < 0)) {
            this.flapSpeed *= -1; //Invert movement direction
        } else if ((this.angle > 3*PI/4) && (this.flapSpeed > 0)) {
            this.flapSpeed *= -1; //Invert movement direction
        }
        this.angle += this.flapSpeed;
  }
  display() {
        strokeWeight(3);
        let x = this.size * sin(this.angle);
        let y = this.size * cos(this.angle);
          
        line(this.pos.x, this.pos.y, 
            this.pos.x - x, this.pos.y -y);//Left wing
        line(this.pos.x, this.pos.y, 
            this.pos.x + x, this.pos.y -y);//Right wing
  }
}

class Fly extends Mover {
  constructor(x, y, m) {
    super(x, y, m);
    this.wing = new Wings(this.pos, 0.3);
    //Perlin Noise offsets
    this.tx = random(0, 100);
    this.ty = random(0, 100);
  }
  update() {
    //Accelerates randomly if not attracted to anything
    let stepX = map(noise(this.tx), 0, 1, -1, 1);
    let stepY = map(noise(this.ty), 0, 1, -1, 1);
    let step = createVector(stepX,stepY);
    step.normalize();
    step.mult(0.1);
    this.acc.add(step);
    this.tx += 0.01;
    this.ty += 0.01;
    
    //Update velocity and position
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    this.wing.flap();
  }
  display() {
    strokeWeight(6);
    stroke(145, 0, 255);
    point(this.pos.x, this.pos.y);
    this.wing.display();
  }
}