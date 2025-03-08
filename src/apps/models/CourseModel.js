const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const Course = new Schema(
  {
    name: { type: String },
    description: { type: String },
    image: { type: String },
    slug: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdBy: { type: Object }
  },
  {
    timestamps: true
  }
);

// Custom query helpers
Course.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc"
    });
  }
  return this;
};

// Add plugin
Course.plugin(mongooseDelete, {
  overrideMethods: true
});

module.exports = mongoose.model("Course", Course);
