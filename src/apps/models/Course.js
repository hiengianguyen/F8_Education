const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

const Course = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    videoId: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
  }
);

//model plugin
mongoose.plugin(slug);
Course.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

module.exports = mongoose.model("Course", Course);
