//Water of the environment.
class Water {
  constructor(y, h, c) {
    this.y = y;
    this.h = h;
    this.c = c;
    this.turbulence = 0;
  }
  display() {
    noStroke();
    fill(49, 222, 187,150);
    //rect(0, this.y, width, this.h);
    let yoff = this.turbulence;
    
    //Simulating water movement with noise
    beginShape();
    vertex(0, height);
    for (var i = -8; i <= width+8; i+=8) {
        curveVertex(i, map(noise(yoff), 0, 1,
                    this.y-10, this.y+10));
        yoff += 0.01;
    }
    vertex(width, height);
    endShape(CLOSE);
    
    this.turbulence += 0.01;
  }
  contains(obj) {
    let l = obj.pos;
    return l.y > this.y && l.y < this.y + this.h;
  } //Returns true if Water contains obj.
  calculateDrag(obj) {
    let speed = obj.vel.mag();
    let dragMagnitude = this.c * speed * speed * this.c;
    
    let dragForce = obj.vel.copy();
    dragForce.mult(-1);
    
    dragForce.normalize();
    dragForce.mult(dragMagnitude);

    return dragForce;
  }
}

