import _ from "mysql2";
import mysql, { Pool, PoolConnection, FieldPacket } from "mysql2/promise";
import fs from "fs";
import { exec } from "child_process";
import config from "./config";
import { log } from "./util/logger";
export interface MySQLTransaction {
    isTransaction: true;
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
    release: () => Promise<void>;
    query: (
        sql: string,
        args: any[],
        printLog?: boolean
    ) => Promise<any | null>;
    one: (sql: string, args: any[], printLog?: boolean) => Promise<any>;
    many: (sql: string, args: any[], printLog?: boolean) => Promise<any[]>;
    format: (...a) => string;
}
const connections = {};
const mysqlInstance = {
    read_db: null,
    write_db: null,
};
let cached_queries = {};

class MySQL {
    pool: Pool;
    host: string;
    id: string;
    database: string;

    constructor(
        host: string,
        id: string,
        pass: string,
        database: string,
        port: number
    ) {
        this.pool = mysql.createPool({
            host: host,
            port: port || 3306,
            user: id,
            password: pass,
            database: database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        this.host = host;
        this.id = id;
        this.database = database;

        if (!fs.existsSync("./db_backup/")) {
            fs.mkdirSync("./db_backup/");
        }

        (async () => {
            let sql = ``;
            let tables = await this.query(
                `SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = DATABASE()`
            );
            for (let tb of tables) {
                let create = await this.query(
                    `SHOW CREATE TABLE ${tb["TABLE_NAME"]}`
                );

                sql += `-- [TABLE CREATE SQL] ${tb["TABLE_NAME"]}\n${create[0]["Create Table"]};\n\n`;
            }

            fs.writeFileSync(`./db_backup/${host}_${id}_${database}.sql`, sql);
        })();
    }

    async query_cache(sql, args, cached_time = 500) {
        const sequel = _.format(sql, args);
        if (
            cached_queries[sequel] &&
            cached_queries[sequel].time < Date.now() - cached_time
        ) {
            return cached_queries[sequel].rows;
        }

        let rows = await this.query(sequel);
        cached_queries[sequel] = {
            time: Date.now(),
            rows: rows,
        };
        return rows;
    }

    async query(
        sql: string,
        args?: Array<any>,
        conn?: PoolConnection,
        print_log: boolean = false
    ): Promise<any | null> {
        let retry_cnt = 0;
        while (1) {
            let _conn = conn || (await this.pool.getConnection());
            try {
                print_log ? console.log(_.format(sql, args)) : null;

                const [rows, fields]: [any, FieldPacket[]] = await _conn.query(
                    sql,
                    args
                );
                conn ? null : _conn.release();

                return rows;
            } catch (err) {
                if (err.errno != 1644) {
                    log(
                        "error",
                        "===================================================="
                    );
                    log("error", _.format(sql, args));
                    log(
                        "error",
                        "err.message",
                        err.errno,
                        "retry_cnt",
                        retry_cnt
                    );
                    log(
                        "error",
                        "===================================================="
                    );
                }

                conn ? null : _conn.release();
                if (retry_cnt > 5) {
                    throw err;
                }
                if (err.errno == 1213) {
                    await new Promise((r) => setTimeout(r, 50));
                    retry_cnt++;
                } else if (err.errno == "ECONNRESET") {
                    await new Promise((r) => setTimeout(r, 1000));
                } else {
                    log("error", `err.errno > ${err.errno} ${err.sqlState}`);
                    if (err.errno === undefined && err.sqlState === undefined) {
                        log("error", `WHAT? err > ${err}`);
                        MySQL.Initialize();
                        exec("pm2 restart all");
                    }
                    throw err;
                }
            }
        }
    }

    async beginTransaction(): Promise<MySQLTransaction> {
        let conn = await this.pool.getConnection();
        conn.beginTransaction();

        return {
            isTransaction: true,
            commit: async () => {
                await conn.commit();
                await conn.release();
            },
            rollback: async () => {
                await conn.rollback();
                await conn.release();
            },
            release: async () => {
                await conn.release();
            },
            query: (sql: string, args: any[], printLog?: boolean) => {
                return this.query(sql, args, conn, printLog);
            },
            one: (sql: string, args: any[], printLog?: boolean) => {
                return this.one(sql, args, conn, printLog);
            },
            many: (sql: string, args: any[], printLog?: boolean) => {
                return this.many(sql, args, conn, printLog);
            },
            format: (...a) => this.format(a[0], a[1]),
        };
    }

    async commit() {
        log("system", "[commit] not transaction connect");
    }

    async rollback() {
        log("system", "[rollback] not transaction connect");
    }

    async release() {
        log("system", "[release] not transaction connect");
    }

    async one(
        sql: string,
        args?: Array<any>,
        conn?: PoolConnection,
        print_log: boolean = false
    ): Promise<any> {
        let rows = await this.query(sql, args, conn, print_log);
        return rows[0] as any;
    }

    async many(
        sql: string,
        args?: Array<any>,
        conn?: PoolConnection,
        print_log: boolean = false
    ): Promise<any[] | null> {
        let rows = await this.query(sql, args, conn, print_log);
        return rows;
    }

    static Initialize() {
        let _writeId = `${config.db_write_host},${config.db_write_user},${config.db_write_pass},${config.db_write_name}`;
        let _readId = `${config.db_read_host},${config.db_read_user},${config.db_read_pass},${config.db_read_name}`;

        mysqlInstance.write_db = connections[_writeId] = new MySQL(
            config.db_write_host,
            config.db_write_user,
            config.db_write_pass,
            config.db_write_name,
            config.db_write_port
        );
        mysqlInstance.read_db = connections[_readId] = new MySQL(
            config.db_read_host,
            config.db_read_user,
            config.db_read_pass,
            config.db_read_name,
            config.db_read_port
        );
    }

    static write(): MySQL {
        if (mysqlInstance.write_db == null) MySQL.Initialize();
        return mysqlInstance.write_db;
    }

    static read(): MySQL {
        if (mysqlInstance.read_db == null) MySQL.Initialize();
        return mysqlInstance.read_db || mysqlInstance.write_db;
    }

    readOnly(): MySQL {
        if (!mysqlInstance.read_db) {
            throw "Read Replica not exists!";
        }
        return mysqlInstance.read_db || mysqlInstance.write_db;
    }

    format(sql, args): string {
        return _.format(sql, args);
    }
}

export default MySQL;
