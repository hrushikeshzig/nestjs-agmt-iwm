export const ROUTING_KEYS = {
    // PRODUCT EVENTS
    PRODUCT_CREATED: 'product.created',
    PRODUCT_UPDATED: 'product.updated',
    PRODUCT_DELETED: 'product.deleted',
    
    // INVENTORY EVENTS
    STOCK_RESERVED: 'inventory.stock.reserved',
    STOCK_RELEASED: 'inventory.stock.released',
    STOCK_ADJUSTED: 'inventory.stock.adjusted',
    STOCK_LOW: 'inventory.stock.low',
    STOCK_OUT: 'inventory.stock.out',
    STOCK_TRANSFERRED: 'inventory.stock.transferred',
    
    // ORDER EVENTS
    ORDER_CREATED: 'order.created',
    ORDER_CONFIRMED: 'order.confirmed',
    ORDER_CANCELLED: 'order.cancelled',
    ORDER_SHIPPED: 'order.shipped',
   
    // WAREHOUSE EVENTS
    PICK_LIST_COMPELETED: 'warehouse.picklist.completed',
    PICK_LIST_GENERATED: 'warehouse.picklist.generated',

    // NOTIFICATION EVENTS
    SEND_EMAIL: 'notification.email.send',

    // AUDIT EVENTS
    AUDIT_LOG: 'audit.log.created'
}