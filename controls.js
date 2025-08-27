/**
 * Manages user input for controlling the car.
 */
class Controls {
    /**
     * Creates an instance of Controls.
     * Initializes control states and sets up keyboard listeners.
     */
    constructor() {
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        this.#addKeyboardListeners();
    }

    /**
     * Adds event listeners for keyboard input to control the car.
     * @private
     */
    #addKeyboardListeners() {
        document.onkeydown=(event) => {
            switch(event.key) {
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
            }
        }
        document.onkeyup=(event) => {
            switch(event.key) {
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
            }
        }
    }
}