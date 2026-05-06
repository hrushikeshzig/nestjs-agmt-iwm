import {
    Entity,
    Column,
    Index,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';
import { MovementType } from '../enums/movement-type.enum';

@Entity('stock_movements')
@Index(['productId', 'createdAt'])
export class StockMovement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid', nullable: true})
    inventoryId: string;

    @Column({type: 'uuid', })
    @Index()
    productId: string;

    @Column({type: 'uuid'})
    warehouseId: string;
    
    @Column({type: 'uuid', nullable: true})
    fromBinLocationId: string; // use for transfer type
    
    @Column({type: 'uuid', nullable: true})
    toBinLocationId: string; // use for transfer type
    
    @Column({type: 'int'})
    quantity: number;
    
    @Column({type: 'enum', enum: MovementType})
    type: MovementType;

    @Column({type: 'text', nullable: true})
    reason: string; // required for adjustment type e.g damaged goods, cycle count mismatch

    @Column({type: 'uuid', nullable: true})
    referenceId: string; // the orde id that caused this movement
    
    @Column({type: 'varchar', length: 50,nullable: true})
    referenceType: string; // like 'ORDER', 'MANUAl'
    
    @Column({type: 'uuid', nullable: true})
    performedBy: string; // userID  who did the action
    
    @Column({type: 'json', nullable: true})
    metadata: Record<string, any>; 
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}