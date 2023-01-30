import { ClientProxy } from '@nestjs/microservices';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
export declare class PoolsService {
    private client;
    constructor(client: ClientProxy);
    create(createPoolDto: CreatePoolDto): string;
    findAll(): Promise<unknown>;
    findOne(id: number): Promise<unknown>;
    update(id: number, updatePoolDto: UpdatePoolDto): string;
    remove(id: number): string;
}
