//Implements fruit particles.
class Particle extends Mover {
  constructor(x, y, m) {
    super(x, y, m);
    this.vel = createVector(random(-1, 1), 0);
    this.lifeSpan = 360.0;
  }
  display() {
    strokeWeight(4);
    stroke(203, 255, 31);
    point(this.pos.x, this.pos.y);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifeSpan--;
  }
  run() {
    this.update();
    super.checkEdges();
    this.display();
  }
  isDead() {
    if (this.lifeSpan < 0) {
      return true;
    } else {
      return false;
    }
  }
  isNear(obj) {
    let it = obj.pos.copy();
    it.sub(this.pos);
    return it.mag() < 100;
  }
  wasEaten(obj) {
    let it = obj.pos.copy();
    it.sub(this.pos);
    return it.mag() < 5;
  }
}

//Particle generator.
class Fruit {
  constructor(x, y, m, g) {
    this.o = createVector(x, 0);
    this.pos = createVector(x, y);
    this.mass = m;
    this.size = this.mass * 20;
    this.G = g;
    //Angular movement attributes
    this.ang = PI/48;
    this.arm = y;
    this.aVel = 0;
    this.aAcc = 0;
    //Particle system attribute
    this.particles = [];
    this.releaseRate = floor(random(200, 500));
  }

  update(fishArray) {
    //Angular movement (see: http://www.myphysicslab.com/pendulum1.html)
    this.aAcc = (-1 * gravity.mag() / this.arm) * sin(this.ang);
    this.aVel += this.aAcc;
    // Arbitrary damping
    //this.aVel *= this.damping;
    this.ang += this.aVel;
    
    //Release Particles
    if ((frameCount % this.releaseRate) === 0) {
      this.releaseParticle();
    }
    //Handle Particles
    for (let i = this.particles.length-1; i >= 0; i--) {
      let p = this.particles[i];
      p.applyForce(gravity);
      
      if (fishArray !== null) {
        for (let j = 0; j < fishArray.fish.length; j++) {
          //Attract surrounding fish
          if (p.isNear(fishArray.fish[j])){
            let eat = p.pos.copy();
            eat.sub(fishArray.fish[j].pos);
            eat.normalize();
            eat.mult(0.5);
            fishArray.fish[j].applyForce(eat);
          }

          //Check if the particle was eaten
          if (p.wasEaten(fishArray.fish[j])) {
            fishArray.fish[j].lifeSpan += 512;
            p.lifeSpan = 0;
          }
        }
      }
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
  releaseParticle() {
    this.particles.push(new Particle(
      this.pos.x, this.pos.y, 1));
  }
  //calculateAttraction() returns an attraction force for a given obj
  calculateAttraction(fly) {
    // Calculate direction of force
    let force = p5.Vector.sub(this.pos, fly.pos);
    // Distance between objects       
    let distance = force.mag();
    // Limiting the distance to eliminate "extreme" results
    // for very close or very far objects                       
    distance = constrain(distance, 2, 6);
    // Normalize vector                    
    force.normalize();
    // Calculate gravitional force magnitude  
    let strength = (this.G * this.mass * fly.mass) / (distance * distance);
    // Get force vector --> magnitude * direction
    force.mult(strength);
    return force;
  }
  display() {
    // Polar to cartesian conversion
    this.pos = createVector(
      this.arm* sin(this.ang),
      this.arm * cos(this.ang));
    this.pos.add(this.o);
    
    stroke(9, 51, 0);
    strokeWeight(6);
    line(this.o.x, this.o.y, this.pos.x, this.pos.y);
    noStroke();
    fill(203, 255, 31);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  } 
}