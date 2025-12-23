import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    // transformar el tipo de dato, porque cuando se envia por url el parametro se envia como string
    @Type( () => Number )
    limit?: number;

    @IsOptional()
    @Min( 0 )
    // transformar el tipo de dato, porque cuando se envia por url el parametro se envia como string
    @Type( () => Number )
    offset?: number;
}