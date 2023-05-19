import * as mysql from "mysql";
import {Connection, OkPacket} from "mysql";

export enum GarbageType {
    BOTTLECAP = 0,
    CIGARETTE = 1,
    PLASTICCAP = 2,
    KEY = 3,
    COIN = 4,
    RING = 5,
}

export class Run {
    id: number = 0;
    startDateTime: Date;
    endDateTime: Date | null = null;
    isRunning: boolean;
    private bottleCapAmount: number = 0;
    private cigaretteAmount: number = 0;
    private plasticCapAmount: number = 0;
    private keyAmount: number = 0;
    private coinAmount: number = 0;
    private ringAmount: number = 0;
    private wattage: number = 0;
    private currentWattage: number = 0;
    private connection: Connection;

    constructor() {
        this.isRunning = true;
        this.startDateTime = new Date();
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        this.connection.connect(function (error: Error) {
            if (error) {
                throw error;
            }
        });
    }

    async save(): Promise<boolean> {
        let success = false;

        let sql: string = this.getSqlString();

        await this.executeInDb(sql, [
            this.startDateTime,
            this.endDateTime,
            this.isRunning,
            this.bottleCapAmount,
            this.cigaretteAmount,
            this.plasticCapAmount,
            this.keyAmount,
            this.coinAmount,
            this.ringAmount,
        ])
            .then((data: OkPacket) => {
                this.id = this.id > 0 ? this.id : data.insertId;
                success = true;
            })
            .catch((error) => {
                console.log(error);
            });

        return success;
    }

    private async executeInDb(
        sql: string,
        values: Array<any>
    ): Promise<OkPacket> {
        return new Promise<OkPacket>((resolve, reject) => {
            this.connection.query(sql, values, function (err: any, data: OkPacket) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private getSqlString(): string {
        if (this.id > 0) {
            return (
                `UPDATE runs
                 SET StartDateTime=?,
                     EndDateTime=?,
                     Is_Running=?,
                     Bottlecap_Amount=?,
                     Cigarette_Amount=?,
                     Plasticcap_Amount=?,
                     Key_Amount=?,
                     Coin_Amount=?,
                     Ring_Amount=?
                 WHERE Id =` +
                this.id +
                `;`
            );
        } else {
            return `INSERT INTO runs
                    (StartDateTime, EndDateTime, Is_Running, Bottlecap_Amount, Cigarette_Amount,
                     Plasticcap_Amount, Key_Amount, Coin_Amount, Ring_Amount)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        }
    }

    addGarbage(garbage: GarbageType): void {
        switch (garbage) {
            case GarbageType.BOTTLECAP:
                this.bottleCapAmount++;
                break;
            case GarbageType.CIGARETTE:
                this.cigaretteAmount++;
                break;
            case GarbageType.PLASTICCAP:
                this.plasticCapAmount++;
                break;
            case GarbageType.KEY:
                this.keyAmount++;
                break;
            case GarbageType.COIN:
                this.coinAmount++;
                break;
            case GarbageType.RING:
                this.ringAmount++;
                break;
        }
    }

    addWattage(wattage: number) {
        this.wattage += wattage;
    }

    setCurrentWattage(wattage: number) {
        this.currentWattage += wattage;
    }

    getClientData() {
        const {
            id,
            startDateTime,
            endDateTime,
            isRunning,
            bottleCapAmount,
            cigaretteAmount,
            plasticCapAmount,
            keyAmount,
            coinAmount,
            ringAmount,
            wattage,
            currentWattage
        } = this;
        return {
            id,
            startDateTime,
            endDateTime,
            isRunning,
            bottleCapAmount,
            cigaretteAmount,
            plasticCapAmount,
            keyAmount,
            coinAmount,
            ringAmount,
            wattage,
            currentWattage
        };
    }
}
