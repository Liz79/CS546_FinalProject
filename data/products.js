const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const products = mongoCollections.products;
const users = mongoCollections.users;
const comments = mongoCollections.comments;


module.exports = {
  async addProduct(name, category, price, description) {
    if(!name || !category || !price || !description)
      throw 'Insufficient inputs';
    if(typeof(name) != "string" || typeof(category) != "string" || typeof(price) != "number" || typeof(description) != "string")
      throw 'Wrong input type';

    const productCollection = await products();

    let newProduct = {
      name: name,
      category: category,
      price: price,
      description: description
    };

    const insertInfo = await productCollection.insertOne(newProduct);
    if(insertInfo.insertedCount === 0)
      throw 'Could not add product';
    const newId = insertInfo.insertedId;
    
    const prod = await this.getProduct(newId);
    return prod;
  },

  async getAllProducts() {
    const productCollection = await products();
    const product = await productCollection.find({}).toArray();
    
    return product;
  },

  async getProduct(id) {
    if(!id) 
      throw 'No id provided for search';
    
    if(typeof(id) != "string")
      throw 'Wrong input';
    
    const productCollection = await products();
    let objId;

    if(typeof(id) == "string")
      objId = ObjectId(id);
    else
      objId = id;

    const product = await productCollection.findOne({_id: objId});
    if(product === null) throw 'No product with that id';

    return product;
  },

  async updateProduct(productId, updatedProduct) {
    const productCollection = await products();
    const updatedProductData = {};

    if(typeof(productId) != "string" && typeof(productId) != "object")
      throw 'Wrong input';
    
    let objId;
    if(typeof(productId) == "string")
      objId = ObjectId(productId);
    else
      objId = productId;

    const productInfo = await productCollection.findOne({_id:objId});
    if(productInfo === null) throw 'No product with that id';

    if(!updatedProduct.name && !updatedProduct.category && !updatedProduct.price && !updatedProduct.description)
      throw 'Insufficient inputs'

    if(updatedProduct.name) {
      if(typeof(updatedProduct.name) != "string")
        throw 'wrong input type';
      updatedProductData.name = updatedProduct.name;
    }

    if(updatedProduct.category) {
      if(typeof(updatedProduct.category) != "string")
        throw 'wrong input type';
      updatedProductData.category = updatedProduct.category;
    }

    if(updatedProduct.price) {
      if(typeof(updatedProduct.price) != "number")
        throw 'wrong input type';
      updatedProductData.price = updatedProduct.price;
    }

    if(updatedProduct.description) {
      if(typeof(updatedProduct.description) != "string")
        throw 'wrong input type';
      updatedProductData.description = updatedProduct.description;
    }

    const updatedInfo = await productCollection.updateOne({_id: objId});
    if(updatedInfo.modifiedCount === 0) {
      throw 'could not update band successfully';
    }

    return await this.getProduct(objId);
  },

  async removeProduct(id) {
    if (!id) throw 'You must provide an id to search for';

    if(typeof(id) != "string" && typeof(id) != "object")
      throw 'Wrong input';

    const productCollection = await products();
    
    let objId;

    if(typeof(id) == "string")
      objId = ObjectId(id);
    else
      objId = id;

    const product = await this.getProduct(id);

    const deletionInfo = await productCollection.removeOne({_id: objId});

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete album with id of ${id}`;
    }

    return product;
  }
};


// untilities
// function checkStringInput(value, inputName, functionName) {
//     if (typeof value == 'undefined') {
//       throw `Warning[${functionName}]: '${inputName}' is missing.`
//     }
//     else if (typeof value != 'string') {
//       throw `Warning[${functionName}]: String is expected for '${inputName}'. Get ${typeof value} instead.`
//     }
  
//     return value
//   }
//   function checkNumberInput(value, inputName, functionName) {
//     if (typeof value == 'undefined') {
//       throw `Warning[${functionName}]: '${inputName}' is missing.`
//     }
//     else if (typeof value != 'number') {
//       throw `Warning[${functionName}]: Number is expected for '${inputName}'. Get ${typeof value} instead.`
//     }
//     else if (isNaN(value)) {
//       throw `Warning[${functionName}]: Number is expected for '${inputName}'. Get NaN instead.`
//     } else if (value <= 0) {
//       throw `Warning[${functionName}]: '${inputName}' can not be 0 or negative number.`
//     }
//     return value
//   }

