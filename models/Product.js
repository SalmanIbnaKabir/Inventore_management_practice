const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const valid = require("validator");

// schema design

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please a provide a name for this product"],
      trim: true, //   chal
      unique: [true, "Name must be unique"],
      lowercase: true,
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [100, "Name is to larger than 100 characters"],
    },
    description: {
      type: String,
      required: true,
    },

    unit: {
      type: String,
      required: true,
      enum: {
        values: ["kg", "liter", "pcs", "bag"],
        message: "unit value can't be {VALUE}, must be kg/liter/pcs/bag",
      },
    },
    // imageURLs: [
    //   {
    //     type: String,
    //     required: true,
    //     validate: {
    //       validator: (value) => {
    //         if (!Array.isArray(value)) {
    //           return false;
    //         }
    //         let isValid = true;
    //         value.forEach((url) => {
    //           if (validator.isURL(url)) {
    //             isValid = false;
    //           }
    //         });
    //         return isValid;
    //       },
    //       message: "Please provide a valid image URL",
    //     },
    //   },
    // ],
    imageURLs: [
      {
        type: String,
        required: true,
        validate: [valid.isURL, "wrong url"],
      },
    ],
    category: {
      type: String,
      required: true,
    },
    brand: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: ObjectId,
        ref: "Brand",
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// mongoose middleware for saving data: pre / post

productSchema.pre("save", function (next) {
  console.log("before saving data");
  // this for this document
  if (this.quantity == 0) {
    this.status = "out-of-stock";
  }

  next();
});

// productSchema.post("save", function (doc, next) {
//   console.log("after saving data");

//   next();
// });

productSchema.methods.logger = function () {
  console.log(`Data Saved for ${this.name}`);
};

// SCHEMA -> Model -> Query

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
