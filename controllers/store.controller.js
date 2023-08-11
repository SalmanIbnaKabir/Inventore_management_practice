const {
  getStoresService,
  createStoreService,
  getStoreByIdService,
} = require("../services/store.servides");

exports.getStores = async (req, res) => {
  try {
    const stores = await getStoresService();

    res.status(200).json({
      status: "success",
      data: stores,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Can't get stores",
      error: error.message,
    });
  }
};

exports.createStore = async (req, res) => {
  try {
    const result = await createStoreService(req.body);

    res.status(200).json({
      status: "success",
      message: "Store created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Couldn't create store",
      error: error.message,
    });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await getStoreByIdService(id);
    // console.log(store);

    if (!store) {
      return res.status(400).json({
        status: "Not Found",
        message: "Store not found this Id",
      });
    }

    res.status(200).json({
      status: "success",
      data: store,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Can't get the  store",
      error: error.message,
    });
  }
};
