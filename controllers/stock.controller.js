const {
  getStockService,
  createStockService,
  // bulkUpdateProductService,
  updateStockByIdService,
  deleteStockByIdService,
  getStockByIdService,
  // bulkDeleteProductService,
} = require("../services/stock.services");

exports.getStocks = async (req, res, next) => {
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

    const products = await getStockService(filters, queries);
    res.status(200).json({
      status: "success",
      message: "Stock get success",
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      status: "Not Found",
      error: error.message,
      message: "Can't get the Stock ",
    });
  }
};

exports.createStock = async (req, res) => {
  try {
    // save or create
    // const product = new Product(req.body);
    // instance creation ==> Do something ==> Save()
    // if (product.quantity == 0) {
    //   product.status = "out-of-stock";
    // }
    // const result = await product.save();
    const result = await createStockService(req.body);
    result.logger();

    res.status(201).json({
      status: "success",
      message: "Stock inserted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Stock is not inserted correctly",
      error: error.message,
    });
  }
};

exports.getStockById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stock = await getStockByIdService(id);

    if (!stock) {
      return res.status(404).json({
        status: "Not Found",
        error: "can't get the stock with this id",
      });
    }
    res.status(201).json({
      status: "success",
      message: "Stock get successfully",
      data: stock,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Couldn't get  the Stock",
      error: error.message,
    });
  }
};
exports.updateStockById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await updateStockByIdService(id, req.body);
    res.status(201).json({
      status: "success",
      message: "Stock updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Couldn't update the Stock",
      error: error.message,
    });
  }
};

// exports.bulkUpdateProduct = async (req, res, next) => {
//   try {
//     const result = await bulkUpdateProductService(req.body);
//     res.status(201).json({
//       status: "success",
//       message: "Product updated successfully",
//       data: result,
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "failed",
//       message: "Couldn't update the product",
//       error: error.message,
//     });
//   }
// };

exports.deleteStockById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteStockByIdService(id);

    if (!result.deletedCount) {
      return res.status(400).json({
        status: "failed",
        error: "Couldn't delete the Stock",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Stock deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Couldn't deleted the Stock",
      error: error.message,
    });
  }
};

// exports.bulkDeleteProduct = async (req, res, next) => {
//   try {
//     const result = await bulkDeleteProductService(req.body);
//     res.status(200).json({
//       status: "success",
//       message: "Product deleted the  successfully",
//       data: result,
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "failed",
//       message: "Couldn't deleted the product",
//       error: error.message,
//     });
//   }
// };
