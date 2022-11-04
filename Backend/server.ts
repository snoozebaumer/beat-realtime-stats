import { Request, Response, Application } from "express";
// @ts-ignore
import express from "express";
import { Run } from "./run";

const PORT = 3000;

const APP: Application = express();

let run: Run;

APP.get("/start", (req: Request, res: Response): void => {
  if (run && run.isRunning) {
    res.status(409).json({
      message: "Run has already been started"
    });
    return;
  }

  run = new Run();
  run.save().then((success) =>
  {
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

APP.listen(PORT, (): void => {
  console.log(`Server Running here -> http://localhost:${PORT}`);
});
