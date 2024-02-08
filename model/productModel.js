const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  });

     const Product = mongoose.model('Product', productSchema);

      module.exports = Product;