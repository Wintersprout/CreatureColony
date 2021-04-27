class Mover {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = m;
  }
  display() {
    strokeWeight(8);
    stroke(145, 0, 255);
    point(this.pos.x, this.pos.y);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  checkEdges() {
    if (this.pos.x > width) {
      this.pos.x = width;
    } 
    else if (this.pos.x < 0) {
      this.pos.x = 0;
    }

    if (this.pos.y > bottom) {
      this.pos.y = bottom;
    } 
    else if (this.pos.y < 0) {
      this.pos.y = 0;
    }
  }
  applyForce(force) {
    let f = createVector(force.x, force.y).div(this.mass);
    this.acc.add(f);
  }
  
}