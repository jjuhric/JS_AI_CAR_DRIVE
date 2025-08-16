class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = this.x - this.width / 2;
        this.right = this.x + this.width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for(let i=0; i <= this.laneCount; i++) {
            const x = linearInterpolation(this.left, this.right, i / this.laneCount);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }
}
