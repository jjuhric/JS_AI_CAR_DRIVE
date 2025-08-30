/**
 * Performs linear interpolation between two values.
 * @param {number} A The start value.
 * @param {number} B The end value.
 * @param {number} t The interpolation factor (usually between 0 and 1).
 * @returns {number} The interpolated value.
 */
const linearInterpolation = (A, B, t) => {
    return A + (B - A) * t;
}


/**
 * Calculates the intersection point of two line segments.
 * @param {Object} A - The start point of the first line segment {x, y}.
 * @param {Object} B - The end point of the first line segment {x, y}.
 * @param {Object} C - The start point of the second line segment {x, y}.
 * @param {Object} D - The end point of the second line segment {x, y}.
 * @returns {Object|null} An object containing the x, y coordinates of the intersection
 *                        and the 'offset' (t value) along the first segment,
 *                        or null if no intersection occurs within the segments.
 */
const getIntersection = (A, B, C, D) => {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if(bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if(t >= 0 && t <= 1 && u >=0 && u <= 1) {
            return {
                x: linearInterpolation(A.x, B.x, t),
                y: linearInterpolation(A.x, B.x, t),
                offset: t
            }
        }
    }

    return null;
}
