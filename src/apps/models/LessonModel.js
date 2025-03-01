const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const Lesson = new Schema(
  {
    name: { type: String },
    videoUrl: { type: String },
    videoId: { type: String },
    order: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    courseId: { type: Object },
  },
  {
    timestamps: true,
  }
);

// Add plugin
Lesson.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

module.exports = mongoose.model("Lesson", Lesson);
