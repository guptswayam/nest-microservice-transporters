import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { RpcArgumentsHost } from "@nestjs/common/interfaces";
import { RpcException } from "@nestjs/microservices";

@Catch(HttpException, RpcException)
export class RPCExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToRpc()
        return this.handleError(ctx, exception)
    }

    handleError(client: RpcArgumentsHost, exception: any) {
        return {
            ...exception.response,
            error: true
        }
    }
}

