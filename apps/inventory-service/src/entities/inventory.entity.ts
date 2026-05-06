import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    Unique,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity('inventory')
@Unique(['productId', 'warehouseId'])
export class Inventory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    @Index()
    productId: string;

    @Column({type: 'uuid'})
    @Index()
    warehouseId: string;

    @Column({type: 'uuid', nullable: true})
    binLocateId: string;

    @Column({type: 'int', default: 0})
    quantity: number; // Total physical quantity to hand
    
    @Column({type: 'int', default: 0})
    reservedQuantity: number; // Quantity locked by orders  but not yet shipped
    
    @Column({type: 'int', nullable: true})
    lowStockThreshold: number; // provide trigger warning if available <= 100
    
    @Column({type: 'int', nullable: true})
    reorderPoint: number; // triggers  purchase order recommendation
    
    @Column({type: 'int', nullable: true})
    reorderQuantity: number; // quantity to reorder when hitting reorder point

    @Column({type: 'date', nullable: true})
    lastCountDate: Date; // last physical inventory count date

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
    
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    getAvailableQuantity(): number {
        return this.quantity - this.reservedQuantity;
    }
}