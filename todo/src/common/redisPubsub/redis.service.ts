import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import Redis from "ioredis";


export class RedisService implements OnApplicationShutdown {

    private static redisPubClient: Redis
    private static redisSubClient: Redis

    static getClient(type?: string) {
        if(type === "pub") {
            if(this.redisPubClient)
                return this.redisPubClient
            else {
                this.redisPubClient = new Redis()
                return this.redisPubClient
            }
        } else {
            if(this.redisSubClient)
                return this.redisSubClient
            else {
                this.redisSubClient = new Redis()
                return this.redisSubClient
            }
        }
    }

    onApplicationShutdown() {
        RedisService.redisPubClient.disconnect()
        RedisService.redisSubClient.disconnect()
    }
}
