const importService = require('./ImportService')

const updateProduct = async (updateProduct, shopName) => {
    await importService.saveProduct(updateProduct, shopName)
}

const removeProduct = async (id) => {
    await importService.deleteProduct(id)
}

const saveNewProduct = async (newProduct, shopName) => {
    await importService.saveProduct(newProduct, shopName)
}

const updateCollection = async (updateCollection, shopName) => {
    await importService.saveCollection(updateCollection, shopName)
}

const removeCollection = async (id) => {
    await importService.deleteCollection(id)
}

const saveNewCollection = async (newCollection, shopName) => {
    await importService.saveCollection(newCollection, shopName)
}


const saveNewOrder = async (newOrder, shopName) => {
    await importService.saveOrder(newOrder, shopName)
}

const updateOrder = async (updateOrder, shopName) => {
    await importService.saveOrder(updateOrder, shopName)
}

const removeOrder = async (id) => {
    await importService.deleteOrder(id)
}


module.exports = {
    updateProduct,
    saveNewProduct,
    removeProduct,
    updateCollection,
    saveNewCollection,
    removeCollection,
    saveNewOrder,
    updateOrder,
    removeOrder,
}