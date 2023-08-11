const Product = require("../models/Product");
const {
  getProductService,
  createProductService,
  bulkUpdateProductService,
  updateProductByIdService,
  deleteProductByIdService,
  bulkDeleteProductService,
} = require("../services/product.services");

exports.getProducts = async (req, res, next) => {
  try {
    // const products = await Product
    //     .where("name").equals(/\w/)
    //     .where("quantity").gt(100).lt(600)
    //     .limit(2).sort({quantity: -1})
    // const { status, sort, page, limit } = req.query;
    // console.log(status, sort, page, limit);

    let filters = { ...req.query };

    // sort , page, limit exclude
    const excludeFields = ["sort", "page", "limit", "fields"];
    excludeFields.forEach((field) => delete filters[field]);

    // console.log("original Object", req.query);
    // console.log("queryObject", filters);

    // gt, lt, gte, lte
    let filtersString = JSON.stringify(filters);
    filtersString = filtersString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    filters = JSON.parse(filtersString);

    const queries = {};
    if (req.query.sort) {
      // price,quantity -> "price quantity"
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
      console.log(sortBy);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
      console.log(fields);
    }

    if (req.query.page) {
      const { limit = 10, page = 1 } = req.query;
      // 50 product
      // each page 10 products
      // page 1 => 1-10
      // page 2 => 11-20
      // page 3 => 21-30  => page 3 => skit 1-20 => 3-1 => 2 * 10
      // page 4 => 31-40
      // page 5 => 41-50
      const skip = (page - 1) * parseInt(limit);
      queries.skip = skip;
      queries.limit = parseInt(limit);
    }

    const products = await getProductService(filters, queries);
    res.status(200).json({
      status: "success",
      message: "Product get success",
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      status: "Not Found",
      error: error.message,
      message: "Can't get the Data ",
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // save or create
    // const product = new Product(req.body);
    // instance creation ==> Do something ==> Save()
    // if (product.quantity == 0) {
    //   product.status = "out-of-stock";
    // }
    // const result = await product.save();
    const result = await createProductService(req.body);
    result.logger();

    res.status(201).json({
      status: "success",
      message: "Product inserted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Data is not inserted correctly",
      error: error.message,
    });
  }
};

exports.updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await updateProductByIdService(id, req.body);
    res.status(201).json({
      status: "success",
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Couldn't update the product",
      error: error.message,
    });
  }
};

exports.bulkUpdateProduct = async (req, res, next) => {
  try {
    const result = await bulkUpdateProductService(req.body);
    res.status(201).json({
      status: "success",
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Couldn't update the product",
      error: error.message,
    });
  }
};

exports.deleteProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteProductByIdService(id);

    if (!result.deletedCount) {
      return res.status(400).json({
        status: "failed",
        error: "Couldn't delete the product",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Couldn't deleted the product",
      error: error.message,
    });
  }
};

exports.bulkDeleteProduct = async (req, res, next) => {
  try {
    const result = await bulkDeleteProductService(req.body);
    res.status(200).json({
      status: "success",
      message: "Product deleted the  successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Couldn't deleted the product",
      error: error.message,
    });
  }
};

// file upload controller

exports.fileUpload = async (req, res) => {
  try {
    res.status(201).json(req.files);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "file upload error",
      error: error.message,
    });
  }
};
