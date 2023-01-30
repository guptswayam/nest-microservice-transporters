"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolsService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let PoolsService = class PoolsService {
    constructor(client) {
        this.client = client;
    }
    create(createPoolDto) {
        return 'This action adds a new pool';
    }
    findAll() {
        return new Promise((resolve, reject) => {
            let data;
            this.client.send("pools_findall", { dean: "ambrose" }).subscribe({
                next: (res) => {
                    console.log(res);
                    console.log("FINDALL");
                    data = res;
                },
                complete: () => {
                    resolve(data);
                }
            });
        });
    }
    findOne(id) {
        return new Promise((resolve, reject) => {
            let data = [];
            this.client.send("pools_findone", { dean: "ambrose" }).subscribe({
                next: (res) => {
                    console.log("FINDONE");
                    data.push(res);
                },
                complete: () => {
                    resolve(data);
                }
            });
        });
    }
    update(id, updatePoolDto) {
        return `This action updates a #${id} pool`;
    }
    remove(id) {
        return `This action removes a #${id} pool`;
    }
};
PoolsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("POOL_SERVICE")),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], PoolsService);
exports.PoolsService = PoolsService;
//# sourceMappingURL=pools.service.js.map