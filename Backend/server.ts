// @ts-ignore
require('dotenv').config();
// @ts-ignore
import express, { Application, json, Request, Response } from "express";
import * as http from "http";
import * as path from "path";
import * as WebSocket from "ws";
import { GarbageType, Run } from "./run";
import * as bodyParser from "body-parser";

const PORT = 80;

const APP: Application = express();
APP.use(bodyParser.urlencoded({extended: true}))

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

APP.post("/start", (req: Request, res: Response): void => {
  if(!verifyAuthorization(req)) {
    res.status(403).json({
      message: "Missing authorization for this action."
    });
    return;
  }

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

APP.get("/.well-known/acme-challenge/BAUYwVSQYaaKUCHMVDXjwxsrdjyx5pgyC0tSq4WdqIU", (req: Request, res: Response): void => {
  res.sendFile(path.resolve("certificate.txt"));
});

APP.post("/stop", (req: Request, res: Response): void => {
  if(!verifyAuthorization(req)) {
    res.status(403).json({
      message: "Missing authorization for this action."
    });
    return;
  }

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

APP.post("/amperage", (req: Request, res: Response): void => {
  if(!verifyAuthorization(req)) {
    res.status(403).json({
      message: "Missing authorization for this action."
    });
    return;
  }

  if (!run || !run.isRunning) {
    res.status(409).json({
      message: "Run hasn't been started",
    });
    return;
  }

  const voltage = 12;
  let amperage: number = JSON.parse(req.body.amperage);
  let wattage = amperage * voltage;
  run.addWattage(wattage);
  run.setCurrentWattage(wattage);
  updateClients();
  res.status(200).json({
    message: "wattage " + wattage + " added"
  });
});

APP.post("/foundObject", (req: Request, res: Response): void => {
  if(!verifyAuthorization(req)) {
    res.status(403).json({
      message: "Missing authorization for this action."
    });
    return;
  }

  if (!run || !run.isRunning) {
    res.status(409).json({
      message: "Run hasn't been started",
    });
    return;
  }

  let garbage: GarbageType = JSON.parse(req.body.id);
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

function verifyAuthorization(req: Request) {
  return (req.headers.authorization === process.env.AUTHORIZATION_TOKEN)
}

server.listen(PORT, (): void => {
  console.log(`Server Running here -> http://localhost:${PORT}`);
});
