/**
 * Represents a sensor attached to a car for detecting obstacles and road borders.
 */
class Sensor {
    /**
     * Creates an instance of Sensor.
     * @param {Car} car The car to which the sensor is attached.
     */
    constructor(car) {
        this.car = car;
        /**
         * The number of rays cast by the sensor.
         * @type {number}
         */
        this.rayCount = 5;
        /**
         * The length of each ray.
         * @type {number}
         */
        this.rayLength = 150;
        /**
         * The spread angle of the rays in radians (e.g., Math.PI / 2 for 90 degrees).
         * @type {number}
         */
        this.raySpread = Math.PI / 2; //90 degrees

        /**
         * An array to store the start and end points of each ray.
         * @type {Array<Array<Object>>}
         */
        this.rays = [];
    }

    update(roadBorders) {
        this.#castRays();
    }

    /**
     * Casts rays from the car based on its position, angle, and sensor properties.
     * The rays are stored in the `this.rays` array.
     * @private
     */
    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = linearInterpolation(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    /**
     * Draws the sensor rays on the canvas.
     * @param {CanvasRenderingContext2D} ctx The 2D rendering context of the canvas.
     */
    draw(ctx) {
        for(let i = 0; i < this.rayCount; i++) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.stroke();
        }
    }
}