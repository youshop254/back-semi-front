const ProdRoute = require("express").Router();
const Products = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const { query } = require("express");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query
    const excludedFields = ["page", "sort", "limit"];

    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

ProdRoute.get(
  "/api/products",
  asyncHandler(async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;

      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  })
);

ProdRoute.post(
  "/api/product_create",
  asyncHandler(async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images)
        return res.json({
          msg: "cannot create a product without an image.",
        });

      const product = await Products.findOne({ product_id });

      if (product) return res.json({ msg: "this product already exists" });

      await Products.create({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      res.json({ msg: "New product created" });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  })
);

ProdRoute.delete(
  "/api/product_delete/:id",
  asyncHandler(async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);

      res.json({ msg: "you deleted a product.." });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  })
);

ProdRoute.put(
  "/api/product_update/:id",
  asyncHandler(async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;

      if (!images)
        return res.json({
          msg: "image should be available in order to update",
        });

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );

      res.json({ msg: "you have just updated a product." });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  })
);

module.exports = ProdRoute;
