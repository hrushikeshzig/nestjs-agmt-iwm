export const QUEUES = {
    // services queues
    PRODUCT_SERVICE: 'product.service.queue',
    INVENTORY_SERVICE: 'inventory.service.queue',
    ORDER_SERVICE: 'order.service.queue',
    WAREHOUSE_SERVICE: 'warehouse.service.queue',
    NOTIFICATION_SERVICE: 'notification.service.queue',
    REPORT_SERVICE: 'report.service.queue',
    AUDIT_SERVICE: 'audit.service.queue',
    INVENTORY_DLQ: 'inventory.service.dlq',
    ORDER_DLQ: 'order.service.dlq',
    NOTIFICATION_DLQ: 'notification.service.dlq',

    // worker queues
    EMAIL_WORKER: 'notification.email.worker',
    REPORT_GENERATOR: 'report.generator.worker',
}