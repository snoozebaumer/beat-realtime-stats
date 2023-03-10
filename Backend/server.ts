// @ts-ignore
import express, { Application, json, Request, Response } from "express";
import * as http from "http";
import * as path from "path";
import * as WebSocket from "ws";
import { GarbageType, Run } from "./run";

const PORT = 3000;

const APP: Application = express();

const server = http.createServer(APP);

const wss = new WebSocket.Server({ server });

let run: Run;

function updateClients() {
  wss.clients.forEach((client) =>
    client.send(JSON.stringify(run.getClientData()))
  );
}

wss.on("connection", (ws: WebSocket) => {
  if (run && run.isRunning) {
    ws.send(JSON.stringify(run.getClientData()));
  }
});

APP.use(express.static(path.resolve("../frontend")));

APP.get("/", (req: Request, res: Response): void => {
  res.sendFile(path.resolve("../frontend/index.html"));
});

APP.get("/start", (req: Request, res: Response): void => {
  if (run && run.isRunning) {
    res.status(409).json({
      message: "Run has already been started",
    });
    return;
  }

  try {
    run = new Run();
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }

  run.save().then((success) => {
    if (success) {
      updateClients();
      res.status(200).json({
        message: "Run " + run.id + " started",
      });
    } else {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  });
});

APP.get("/stop", (req: Request, res: Response): void => {
  if (!run || !run.isRunning) {
    res.status(409).json({
      message: "Run hasn't been started",
    });
    return;
  }

  run.isRunning = false;
  run.endDateTime = new Date();

  run.save().then((success) => {
    if (success) {
      updateClients();
      res.status(200).json({
        message: "Run " + run.id + " stopped",
      });
    } else {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  });
});

APP.get("/foundObject/:id", (req: Request, res: Response): void => {
  if (!run || !run.isRunning) {
    res.status(409).json({
      message: "Run hasn't been started",
    });
    return;
  }

  let garbage: GarbageType = parseInt(req.params.id);
  run.addGarbage(garbage);

  run.save().then((success) => {
    if (success) {
      updateClients();
      res.status(200).json({
        message: "Garbage added",
      });
    } else {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  });
});

server.listen(PORT, (): void => {
  console.log(`Server Running here -> http://localhost:${PORT}`);
});
