import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator"
import { Transform } from "class-transformer";


export class ReserveStockDto {
    @IsUUID('4', {message: 'Product ID must be a valid UUID'})
    @IsNotEmpty()
    productId: string;
    
    @IsUUID('4', {message: 'Warehouse ID must be a valid UUID'})
    @IsNotEmpty()
    warehouseId: string;
    
    @Transform(({value}) => parseInt(value, 10))
    @IsInt({message: 'Quantity must be an integer'})
    @Min(1, { message: 'Quantity must be at least 1'})
    quantity: number;
    
    
    @IsUUID('4', {message: 'Reference ID must be a valid UUID'})
    @IsNotEmpty()
    referenceId: string;
    
    @IsString()
    @IsOptional()
    referenceType?: string;
    
    @IsUUID('4', {message: 'Performed By must be a valid UUID'})
    @IsOptional()
    performedBy?: string;

}