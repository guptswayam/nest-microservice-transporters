"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolsModule = void 0;
const common_1 = require("@nestjs/common");
const pools_service_1 = require("./pools.service");
const pools_controller_1 = require("./pools.controller");
const microservices_1 = require("@nestjs/microservices");
let PoolsModule = class PoolsModule {
};
PoolsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'POOL_SERVICE',
                    transport: microservices_1.Transport.REDIS,
                    options: {
                        port: 6379,
                        host: 'localhost',
                    },
                },
            ]),
        ],
        controllers: [pools_controller_1.PoolsController],
        providers: [pools_service_1.PoolsService]
    })
], PoolsModule);
exports.PoolsModule = PoolsModule;
//# sourceMappingURL=pools.module.js.map