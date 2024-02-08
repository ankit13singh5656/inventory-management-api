const Product = require('../model/productModel');


const createProduct = async (req, res) => {
  try {
    // Log the user's role
    const userRole = req.user.role;
    console.log(`User role: ${userRole}`);

    // Rest of your createProduct logic...
    
    const { name, quantity, price, status } = req.body;
    const newProduct = new Product({ name, quantity, price, status });
    // ...

    const savedProduct = await newProduct.save();
    res.status(201).json({message:"new peroduct created"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// oCntroller to get a list of all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get details of a specific product
const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to update details of a specific product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, quantity, price, status } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, quantity, price, status },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({message: "product updated successfuly"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to delete a specific product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({message:"product deleted successfuilly"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports={createProduct,getAllProducts,getProductById,updateProduct,deleteProduct};

