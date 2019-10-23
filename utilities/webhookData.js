const webhook = {
    createProduct:{
        'webhook': {
            'topic': 'products/create',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/products/create",
            'format': 'json'
        }
    },
    updateProduct:{
        'webhook': {
            'topic': 'products/update',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/products/update",
            'format': 'json'
        }
    },
    deleteProduct:{
        'webhook': {
            'topic': 'products/delete',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/products/delete",
            'format': 'json'
        }
    },
    createCustomer: {
        'webhook': {
            'topic': 'customers/create',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/customers/create",
            'format': 'json'
        }
    },
    updateCustomer: {
        'webhook': {
            'topic': 'customers/update',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/customers/update",
            'format': 'json'
        }
    },
    createOrder: {
        'webhook': {
            'topic': 'orders/create',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/orders/create",
            'format': 'json'
        }
    },
    updateOrder: {
        'webhook': {
            'topic': 'orders/update',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/orders/update",
            'format': 'json'
        }
    },
    createCollection: {
        'webhook': {
            'topic': 'collections/create',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/collections/create",
            'format': 'json'
        }
    },
    updateCollection: {
        'webhook': {
            'topic': 'collections/update',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/collections/update",
            'format': 'json'
        }
    },
    deleteCollection: {
        'webhook': {
            'topic': 'collections/delete',
            'address': process.env.FORWARDING_ADDRESS + "/webhook/collections/delete",
            'format': 'json'
        }
    }
}

module.exports = webhook