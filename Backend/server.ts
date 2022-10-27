import { Request, Response, Application } from "express";
import express from "express";
import { Attempt } from "./attempt";

const PORT = 3000;

const APP: Application = express();

APP.get("/", (req: Request, res: Response): void => {
  let attempt: Attempt = new Attempt();
  let time = attempt.getTime();
  res.send(
    "Hello world! Time elapsed: " +
      time.minutes +
      " Minutes " +
      time.seconds +
      " seconds"
  );
});

APP.listen(PORT, (): void => {
  console.log(`Server Running here -> http://localhost:${PORT}`);
});
