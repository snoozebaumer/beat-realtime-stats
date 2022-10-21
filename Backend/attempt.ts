export class Attempt {
    private timeInSeconds: number = 0;
    running: boolean = false;

    getTime() {
        return {"minutes": Math.floor(this.timeInSeconds/60), "seconds": this.timeInSeconds % 60}
    }

    startCounting() {
        // TODO: timer to count up
    }

    stopCounting() {
        // TODO: timer to stop counting
    }

    Attempt() {
        this.running = true
    }
}