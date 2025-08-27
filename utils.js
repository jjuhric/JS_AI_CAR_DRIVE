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
