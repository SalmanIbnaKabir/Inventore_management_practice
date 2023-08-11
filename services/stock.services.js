const Stock = require("../models/Stock");

exports.getStockService = async (filters, queries) => {
  // console.log(queries.fields);
  // console.log(filters);
  const stocks = await Stock.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy);

  const total = await Stock.countDocuments(filters);

  const page = Math.ceil(total / queries.limit);

  return { total, page, stocks };
};

exports.createStockService = async (data) => {
  const stock = await Stock.create(data);

  // step 1: _id, brand
  // const { _id: productId, brand } = product;

  // // update Brand
  // const result = await Brand.updateOne(
  //   { _id: brand.id },
  //   { $push: { products: productId } }
  // );
  // console.log(result);
  return stock;
};

exports.getStockByIdService = async (stockId) => {
  const stock = await Stock.findOne({ _id: stockId })
    .populate("store.id")
    .populate("suppliedBy.id")
    .populate("brand.id");

  return stock;
};
exports.updateStockByIdService = async (productId, data) => {
  // const product = await Product.updateOne(
  //   { _id: productId },
  //   { $set: data },
  //   { runValidators: true }
  // );
  const result = await Stock.findById(productId);
  const product = await result.set(data).save();
  return product;
};

// exports.bulkUpdateProductService = async (data) => {
//   // const result = await Product.updateMany({ _id: data.ids }, data.data, {
//   //   runValidators: true,
//   // });
//   const products = [];
//   data.ids.forEach((product) => {
//     products.push(Stock.updateOne({ _id: product.id }, product.data));
//   });
//   const result = Promise.all(products);

//   return result;
// };

exports.deleteStockByIdService = async (id) => {
  const result = await Stock.deleteOne({ _id: id });

  return result;
};

// exports.bulkDeleteProductService = async (ids) => {
//   // console.log(ids.ids);
//   const result = await Stock.deleteMany({ _id: ids.ids });

//   return result;
// };
