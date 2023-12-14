import { createClient, RedisClientType } from "redis";
import { log } from "./logger";
import config from "../config";

const instance: { memStorage: MemStorage; redisStorage: RedisStorage } = {
    memStorage: null,
    redisStorage: null,
};

export class MemStorage {
    Mem: {};
    constructor() {
        if (instance.memStorage !== null) return instance.memStorage;

        this.connect();
        instance.memStorage = this;
    }
    async connect() {
        console.log("MemStorage connect!");
    }
    async hset(key, mem, value) {
        this.Mem[key] = this.Mem[key] || {};
        this.Mem[key][mem] = value;
    }

    async hmset(key, obj) {
        let rows = Object.entries(obj);
        for (let row of rows) {
            await this.hset(key, row[0], row[1]);
        }
    }
    async hget(key, mem) {
        if (this.Mem[key]) {
            return this.Mem[key][mem];
        }
        return null;
    }
    async hdel(key, mem) {
        if (this.Mem[key]) {
            delete this.Mem[key][mem];
        }
    }
    async del(key) {
        if (this.Mem[key]) {
            delete this.Mem[key];
            return 1;
        }

        return 0;
    }
    async exists(key) {
        return !!this.Mem[key];
    }
    async hincrby(key, mem, incr) {
        if (this.Mem[key]) {
            this.Mem[key][mem] += incr;
            return this.Mem[key][mem];
        }
        return null;
    }
    async hgetall(key) {
        if (this.Mem[key]) {
            return { ...this.Mem[key] };
        }
        return null;
    }
}

const serverKey = config.env == "prod" ? "" : config.env;
export class RedisStorage {
    client: RedisClientType;
    constructor(url?: string) {
        if (instance.redisStorage) return instance.redisStorage;

        log("system", "RedisStorage connect!");
        this.client = createClient({
            url: url ? url : "redis://localhost:6379",
            legacyMode: false,
        });
        instance.redisStorage = this;
    }

    async connect() {
        try {
            await this.client.connect();
        } catch (err) {
            log("system", "RedisStorage Connect Error : ", err);
        }
    }

    async set(key, mem) {
        return await this.client.set(serverKey + key, mem);
    }

    async get(key) {
        return await this.client.get(serverKey + key);
    }

    async hset(key, mem, value) {
        return await this.client.hSet(serverKey + key, mem, value);
    }

    async hmset(key, obj) {
        return await Promise.all(Object.keys(obj).map(raw => this.client.hSet(key, raw, obj[raw])));
    }
    async hget(key, mem) {
        return await this.client.hGet(serverKey + key, mem);
    }
    async hdel(key, mem) {
        return await this.client.hDel(serverKey + key, mem);
    }

    async del(key) {
        return await this.client.del(serverKey + key);
    }

    async exists(key) {
        let response = await this.client.exists(serverKey + key);
        return response == 1;
    }

    async hincrby(key, mem, incr) {
        return await this.client.hIncrBy(serverKey + key, mem, incr);
    }

    async hgetall(key) {
        return await this.client.hGetAll(serverKey + key);
    }

    async lpush(key, list) {
        return await this.client.lPush(serverKey + key, list);
    }

    async rpush(key, val) {
        return await this.client.rPush(serverKey + key, val);
    }

    async rpop(key) {
        return await this.client.rPop(serverKey + key);
    }

    async llen(key) {
        return await this.client.lLen(serverKey + key);
    }

    async lrange(key, start, end) {
        return await this.client.lRange(serverKey + key, start, end);
    }

    async lrangeAll(key) {
        return await this.client.lRange(serverKey + key, 0, -1);
    }

    async lrangeR(key) {
        let len = await this.llen(key);
        return await this.lrange(key, len - 1, len);
    }
}