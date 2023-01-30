import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';

@Injectable()
export class PoolsService {

  constructor(@Inject("POOL_SERVICE") private client: ClientProxy) {}

  create(createPoolDto: CreatePoolDto) {
    return 'This action adds a new pool';
  }

  findAll() {
    return new Promise((resolve, reject) => {
      let data: any
      this.client.send("pools_findall", {dean: "ambrose"}).subscribe({
        next: (res) => {
          console.log(res)
          console.log("FINDALL")
          data = res
        },
        complete: () => {
          resolve(data)
        }
      })
    })
  }

  findOne(id: number) {
    return new Promise((resolve, reject) => {
      let data: Array<any> = []
      this.client.send("pools_findone", {dean: "ambrose"}).subscribe({
        next: (res) => {
          console.log("FINDONE")
          data.push(res)
        },
        complete: () => {
          resolve(data)
        }
      })
    })
  }

  update(id: number, updatePoolDto: UpdatePoolDto) {
    return `This action updates a #${id} pool`;
  }

  remove(id: number) {
    return `This action removes a #${id} pool`;
  }
}
