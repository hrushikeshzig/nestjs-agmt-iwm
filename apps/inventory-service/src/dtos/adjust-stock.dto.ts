import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator"

export class AdjustStockDto {
    @IsUUID('4', { message: 'Product ID  must be valid UUID'})
    @IsNotEmpty()
    productId: string;

    @IsUUID('4', { message: 'Warehouse ID  must be valid UUID'})
    @IsNotEmpty()
    warehouseId: string;

    @IsUUID('4', { message: 'Product ID  must be valid UUID'})
    @IsOptional()
    binLocationId?: string;

    @Transform(({value}) => parseInt(value, 10))
    @IsInt({message: 'Quantity must be an integer'})
    quantity: number;

    @IsString()
    @MaxLength(500, {message: 'Reason can\'t exceed 500 characters'})
    @IsNotEmpty({message: "A reason is required for stock adjustment"})
    reason: string;

    @IsUUID('4', { message: 'Performed BY must be valid UUID'})
    @IsOptional()
    performedBy?: string;
}