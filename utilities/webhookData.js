const webhook = {
    createProduct:{
        'webhook': {
            'topic': 'products/create',
            'address': process.env.DOMAIN + "/webhook/products/create",
            'format': 'json'
        }
    },
    updateProduct:{
        'webhook': {
            'topic': 'products/update',
            'address': process.env.DOMAIN + "/webhook/products/update",
            'format': 'json'
        }
    },
    deleteProduct:{
        'webhook': {
            'topic': 'products/delete',
            'address': process.env.DOMAIN + "/webhook/products/delete",
            'format': 'json'
        }
    },
    createOrder: {
        'webhook': {
            'topic': 'orders/create',
            'address': process.env.DOMAIN + "/webhook/orders/create",
            'format': 'json'
        }
    },
    updateOrder: {
        'webhook': {
            'topic': 'orders/update',
            'address': process.env.DOMAIN + "/webhook/orders/update",
            'format': 'json'
        }
    },
    deleteOrder: {
        'webhook': {
            'topic': 'orders/delete',
            'address': process.env.DOMAIN + "/webhook/orders/delete",
            'format': 'json'
        }
    },
    createCollection: {
        'webhook': {
            'topic': 'collections/create',
            'address': process.env.DOMAIN + "/webhook/collections/create",
            'format': 'json'
        }
    },
    updateCollection: {
        'webhook': {
            'topic': 'collections/update',
            'address': process.env.DOMAIN + "/webhook/collections/update",
            'format': 'json'
        }
    },
    deleteCollection: {
        'webhook': {
            'topic': 'collections/delete',
            'address': process.env.DOMAIN + "/webhook/collections/delete",
            'format': 'json'
        }
    }
}

module.exports = webhook