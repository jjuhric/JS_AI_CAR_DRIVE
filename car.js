/**
 * Represents a car in the simulation.
 */
class Car {
  /**
   * Creates an instance of Car.
   * @param {number} x The initial x-coordinate of the car.
   * @param {number} y The initial y-coordinate of the car.
   * @param {number} width The width of the car.
   * @param {number} height The height of the car.
   */
  constructor(x, y, width, height) {
    /**
     * The x-coordinate of the car's center.
     */
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.acceleration = 0.1;

    /**
     * The maximum forward speed of the car.
     */
    this.maxSpeed = 3;
    /**
     * The friction applied to the car's speed.
     */
    this.friction = 0.05;

    /**
     * The current angle of the car in radians.
     * @type {number}
     */
    this.angle = 0;

    /**
     * The sensor attached to the car for detecting obstacles.
     * @type {Sensor}
     */
    this.sensor = new Sensor(this);
    
    /**
     * The controls object for the car.
     * @type {Controls}
     */
    this.controls = new Controls();
  }

  /**
   * Updates the car's state, including movement and sensor readings.
   * @param {Array<Array<Object>>} roadBorders An array of road border segments.
   */
  update(roadBorders) {
    this.#move();
    this.sensor.update(roadBorders);
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    } 
    if (this.speed > 0) {
      this.speed -= this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  
  /**
   * Draws the car on the canvas.
   * @param {CanvasRenderingContext2D} ctx The 2D rendering context of the canvas.
   */
  draw(ctx) {
    // Save Canvas
    ctx.save();
    // Translate to the car's position
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.strokeStyle = "#B0B7BC";
    ctx.fillStyle = "#0C264C";
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    this.sensor.draw(ctx);
  }
}
