import { PoolsService } from './pools.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
export declare class PoolsController {
    private readonly poolsService;
    constructor(poolsService: PoolsService);
    create(createPoolDto: CreatePoolDto): string;
    findAll(): Promise<unknown>;
    findOne(id: string): Promise<unknown>;
    update(id: string, updatePoolDto: UpdatePoolDto): string;
    remove(id: string): string;
}
