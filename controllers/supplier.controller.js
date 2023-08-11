const {
  createSupplierService,
  getSuppliersService,
  getSupplierByIdService,
  updateSupplierService,
} = require("../services/supplier.services");

exports.createSupplier = async (req, res, next) => {
  try {
    const result = await createSupplierService(req.body);
    // console.log(result);
    res.status(201).json({
      status: "success",
      message: "Successfully Created  the Supplier",
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "couldn't create the Supplier",
      error: error.message,
    });
  }
};
exports.getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await getSuppliersService();

    res.status(201).json({
      status: "success",
      data: suppliers,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error: "couldn't get  the Suppliers",
    });
  }
};

exports.getSupplierById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supplier = await getSupplierByIdService(id);

    if (!supplier) {
      return res.status(404).json({
        status: "failed",
        error: "couldn't find Supplier with this id",
      });
    }

    res.status(201).json({
      status: "success",
      data: supplier,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error: "couldn't get  the Supplier",
    });
  }
};
exports.updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await updateSupplierService(id, req.body);

    console.log(result);
    if (!result.nModified) {
      return res.status(404).json({
        status: "failed",
        error: "couldn't update the  Supplier with this id",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Successfully updated the Supplier",
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error: "couldn't updated  the Supplier",
    });
  }
};
