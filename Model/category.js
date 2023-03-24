import mongoose from "mongoose";

const Category = mongoose.Schema(
  {
    nameCategory: String,
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("categorys", Category);
export default categoryModel;
