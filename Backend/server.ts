import {Request, Response, Application} from "express";
// @ts-ignore
import express from "express";
import {Run} from "./run";
import * as path from "path";

const PORT = 3000;

const APP: Application = express();

let run: Run;

APP.use(express.static(path.resolve('../frontend')));

APP.get('/', (req: Request, res: Response): void => {
    res.sendFile(path.resolve('../frontend/index.html'))
});

APP.get("/start", (req: Request, res: Response): void => {
    if (run && run.isRunning) {
        res.status(409).json({
            message: "Run has already been started"
        });
        return;
    }

    try {
        run = new Run();
    } catch (err: any) {
        res.status(500).json({
            message: err.message
        });
    }

    run.save().then((success) => {
        if (success) {
            res.status(200).json({
                message: "Run " + run.id + " started"
            });
        } else {
            res.status(500).json({
                message: "Something went wrong"
            });
        }
    })
});

APP.get("/stop", (req: Request, res: Response): void => {
    if (!run || !run.isRunning) {
        res.status(409).json({
            message: "Run hasn't been started"
        });
        return;
    }

    run.isRunning = false;
    run.endDateTime = new Date();

    run.save().then((success) => {
        if (success) {
            res.status(200).json({
                message: "Run " + run.id + " stopped"
            });
        } else {
            res.status(500).json({
                message: "Something went wrong"
            });
        }
    });
});

APP.listen(PORT, (): void => {
    console.log(`Server Running here -> http://localhost:${PORT}`);
});
