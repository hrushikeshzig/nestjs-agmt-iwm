import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
