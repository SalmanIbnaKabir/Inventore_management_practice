const Brand = require("../models/Brand");
const Product = require("../models/Product");

exports.getProductService = async (filters, queries) => {
  // console.log(queries.fields);
  // console.log(filters);
  const products = await Product.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy);

  const total = await Product.countDocuments(filters);

  const page = Math.ceil(total / queries.limit);

  return { total, page, products };
};

exports.createProductService = async (data) => {
  const product = await Product.create(data);

  // step 1: _id, brand
  const { _id: productId, brand } = product;

  // update Brand
  const result = await Brand.updateOne(
    { _id: brand.id },
    { $push: { products: productId } }
  );
  console.log(result);
  return product;
};

exports.updateProductByIdService = async (productId, data) => {
  // const product = await Product.updateOne(
  //   { _id: productId },
  //   { $set: data },
  //   { runValidators: true }
  // );
  const result = await Product.findById(productId);
  const product = await result.set(data).save();
  return product;
};

exports.bulkUpdateProductService = async (data) => {
  // const result = await Product.updateMany({ _id: data.ids }, data.data, {
  //   runValidators: true,
  // });
  const products = [];
  data.ids.forEach((product) => {
    products.push(Product.updateOne({ _id: product.id }, product.data));
  });
  const result = Promise.all(products);

  return result;
};

exports.deleteProductByIdService = async (id) => {
  const result = await Product.deleteOne({ _id: id });

  return result;
};

exports.bulkDeleteProductService = async (ids) => {
  // console.log(ids.ids);
  const result = await Product.deleteMany({ _id: ids.ids });

  return result;
};
