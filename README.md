# realtime-web

## Description
Live-updating stats website as part of PREN lecture at HSLU, where a robot picks up various elements of recyclables.

## Installation
In Backend, do
```
npm install
```
Also, make sure to run the sql script at Backend/create_scripts/runs.sql in your mySQL DB and change your
credentials in run.ts:
```
this.connection = mysql.createConnection({
    host: "localhost", // IP address of mySQL DB
    user: "root", // your DB user name
    password: "password", // DB password
    database: "beat" // DB schema name, changing this is not recommended
});
```
before usage.

## Usage
Start web server in /Backend with

```
npm start
```

for dev (restarts on changes):

```
npm run dev
```
then open browser at specified location.

## Authors and acknowledgment
- Samuel Nussbaumer
- David Decker
- Austin George