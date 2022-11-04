import * as mysql from "mysql";
import {Connection, OkPacket} from "mysql";

export class Run {
    id: number = 0;
    startDateTime: Date;
    endDateTime: Date | null = null;
    isRunning: boolean;
    bottleCapAmount: number = 0;
    cigaretteAmount: number = 0;
    plasticCapAmount: number = 0;
    keyAmount: number = 0;
    coinAmount: number = 0;
    ringAmount: number = 0;
    connection: Connection;


    constructor() {
        this.isRunning = true
        this.startDateTime = new Date();
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password",
            database: "beat"
        });
    }

    async save(): Promise<boolean> {
        let success = false;

        this.connection.connect(function (error: Error) {
            if (error) {
                throw error;
            }
        });

        let sql: string = `INSERT INTO runs
                           (StartDateTime, EndDateTime, Is_Running, Bottlecap_Amount, Cigarette_Amount,
                            Plasticcap_Amount, Key_Amount, Coin_Amount, Ring_Amount)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        await this.executeInDb(sql, [this.startDateTime, this.endDateTime, this.isRunning, this.bottleCapAmount, this.cigaretteAmount,
            this.plasticCapAmount, this.keyAmount, this.coinAmount, this.ringAmount]).then((data: OkPacket) => {
            this.id = data.insertId;
            success = true;
        });

        this.connection.end();
        return success;
    }

    async executeInDb(sql: string, values: Array<any>): Promise<OkPacket> {
        return new Promise<OkPacket>((resolve, reject) => {
            this.connection.query(sql, values, function (err: any, data: OkPacket) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }
}