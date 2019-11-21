const storeController = require('../controllers/StoreController2')
const shopDataController = require('../controllers/shopDataController')


const updateProduct = async (updateProduct, shopName) => {
    await shopDataController.saveProduct(updateProduct, shopName)
}

const removeProduct = async (id, shopName) => {
    
}

const saveNewProduct = async (newProduct, shopName) => {
    await shopDataController.saveProduct(newProduct, shopName)
}

const updateCollection = async (updateCollection, shopName) => {
    await shopDataController.saveCollection(updateCollection, shopName)
}

const removeCollection = async (id, shopName) => {
    
}

const saveNewCollection = async (newCollection, shopName) => {
    await shopDataController.saveCollection(newCollection, shopName)
}

const saveNewCustomer = async (newCustomer, shopName) => {
    
}

const updateCustomer = async (updateCustomer, shopName) => {
   
}

const saveNewOrder = async (newOrder, shopName) => {
    await shopDataController.saveOrder(newOrder, shopName)
}

const updateOrder = async (updateOrder, shopName) => {
    await shopDataController.saveOrder(updateOrder, shopName)
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
    saveNewCustomer,
    updateCustomer
}