const {
  createBrandService,
  getBrandsService,
  getBrandByIdService,
  updateBrandService,
} = require("../services/brand.services");

exports.createBrand = async (req, res, next) => {
  try {
    const result = await createBrandService(req.body);

    res.status(201).json({
      status: "success",
      message: "Successfully Created  the Brand",
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error: "couldn't create the brand",
    });
  }
};
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await getBrandsService();

    res.status(201).json({
      status: "success",
      data: brands,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error: "couldn't get  the brand",
    });
  }
};

exports.getBrandById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await getBrandByIdService(id);

    if (!brand) {
      return res.status(404).json({
        status: "failed",
        error: "couldn't find brand with this id",
      });
    }

    res.status(201).json({
      status: "success",
      data: brand,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error: "couldn't get  the brand",
    });
  }
};
exports.updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await updateBrandService(id, req.body);

    console.log(result);
    if (!result.nModified) {
      return res.status(404).json({
        status: "failed",
        error: "couldn't update the  brand with this id",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Successfully updated the Brand",
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error: "couldn't updated  the brand",
    });
  }
};
