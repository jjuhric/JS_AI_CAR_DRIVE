/**
 * Represents a sensor attached to a car for detecting obstacles and road borders.
 */
/**
 * Represents a sensor attached to a car that casts multiple rays to detect
 * intersections with road borders. Used for simulating perception in autonomous
 * vehicles or similar applications.
 *
 * @class
 * @param {Car} car The car to which the sensor is attached.
 * @property {Car} car The car instance the sensor is attached to.
 * @property {number} rayCount The number of rays cast by the sensor.
 * @property {number} rayLength The length of each ray.
 * @property {number} raySpread The spread angle of the rays in radians.
 * @property {Array<Array<Object>>} rays Array storing the start and end points of each ray.
 * @property {Array<Object|null>} readings Array storing the intersection readings for each ray.
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
        this.raySpread = Math.PI / 2;

        /**
         * An array to store the start and end points of each ray.
         * @type {Array<Array<Object>>}
         */
        this.rays = [];
    }

    /**
     * Updates the sensor readings by casting rays and detecting intersections with road borders.
     * @param {Array<Array<Object>>} roadBorders An array representing the borders of the road to check for intersections.
     */
    update(roadBorders) {
        this.#castRays();
        this.readings = [];
        for(let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            )
        }
    }

    /**
     * Calculates the closest intersection point between a ray and the road borders.
     * Iterates through all road borders, finds intersections, and returns the one with the smallest offset (closest to the ray's origin).
     *
     * @private
     * @param {Array<Object>} ray An array containing the start and end points of the ray [{x, y}, {x, y}].
     * @param {Array<Array<Object>>} roadBorders An array of road borders, each defined by two points [[{x, y}, {x, y}], ...].
     * @returns {Object|null} The closest intersection object with an 'offset' property, or null if no intersection is found.
     */
    #getReading(ray, roadBorders) {
        let touches = [];
        
        for(let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1])
        
            if(touch){
                touches.push(touch)
            }
        }

        if(touches.length === 0) {
            return null;
        } else {
            const offsets = touches.map(e => e.offset)
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset === minOffset)
        }
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
            let end = this.rays[i][1]
            if(this.readings[i]) {
                end = this.readings[i]
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#9bb"
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red"
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}