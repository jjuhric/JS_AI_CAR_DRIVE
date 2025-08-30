/**
 * Represents a car in the simulation.
 *
 * @class Car
 * @param {number} x - The initial x-coordinate of the car.
 * @param {number} y - The initial y-coordinate of the car.
 * @param {number} width - The width of the car.
 * @param {number} height - The height of the car.
 * @property {Sensor} sensor - The sensor attached to the car for detecting obstacles.
 * @property {Controls} controls - The controls object for the car.
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

    this.damaged = false;
  }

  /**
   * Updates the car's state, including movement and sensor readings.
   * @param {Array<Array<Object>>} roadBorders An array of road border segments.
   */
  update(roadBorders) {
    if(!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders)
    }
    
    this.sensor.update(roadBorders);
  }

  /**
   * Assesses damage to the car by checking for intersections with road borders.
   * @private
   * @param {Array<Array<Object>>} roadBorders - An array of road border segments.
   * @returns {boolean} True if the car is damaged (colliding with a border), false otherwise.
   */
  #assessDamage(roadBorders) {
    for(let i = 0; i < roadBorders.length; i++) {
      if(polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Creates the car's polygonal shape based on its position, dimensions, and angle.
   * This polygon is used for collision detection.
   * @private
   * @returns {Array<Object>} An array of points defining the car's polygon.
   */
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  /**
   * Updates the car's position and angle based on its speed and control inputs.
   * Applies acceleration, friction, and turning logic.
   * @private
   */
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
    if(this.damaged) {
      ctx.strokeStyle = "#FF0";
      ctx.fillStyle = "#F66"
    } else {
      ctx.strokeStyle = "#B0B7BC";
      ctx.fillStyle = "#0C264C";
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 0; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    this.sensor.draw(ctx);
  }
}

//   /**    OLD WAY TO DRAW
//    * Draws the car on the canvas.
//    * @param {CanvasRenderingContext2D} ctx The 2D rendering context of the canvas.
//    */
//   draw(ctx) {
//     // Save Canvas
//     ctx.save();
//     // Translate to the car's position
//     ctx.translate(this.x, this.y);
//     ctx.rotate(-this.angle);
//     ctx.beginPath();
//     ctx.rect(
//       -this.width / 2,
//       -this.height / 2,
//       this.width,
//       this.height
//     );
//     ctx.strokeStyle = "#B0B7BC";
//     ctx.fillStyle = "#0C264C";
//     ctx.fill();
//     ctx.stroke();
//     ctx.restore();

//     this.sensor.draw(ctx);
//   }
