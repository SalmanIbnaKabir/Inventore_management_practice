const Supplier = require("../models/Supplier");

exports.createSupplierService = async (data) => {
  // console.log(data);
  // const supplier = new Supplier(data);
  const result = await Supplier.create(data);
  // console.log(result);

  return result;
};

exports.getSuppliersService = async () => {
  const suppliers = await Supplier.find({});
  // .populate("products");
  // .select("-products -suppliers");

  return suppliers;
};

exports.getSupplierByIdService = async (id) => {
  const supplier = await Supplier.findOne({ _id: id });

  return supplier;
};

exports.updateSupplierService = async (id, data) => {
  const result = await Supplier.updateOne({ _id: id }, data, {
    runValidators: true,
  });

  return result;
};
