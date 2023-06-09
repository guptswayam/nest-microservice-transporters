import {IsNotEmpty, MinLength} from "class-validator"

export class CreateTodoDto {
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    @MinLength(5)
    body: string
}
