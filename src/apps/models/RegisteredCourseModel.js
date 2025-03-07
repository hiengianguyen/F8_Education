const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const RegisteredCourse = new Schema(
  {
    courseId: { type: Object },
    userId: { type: Object },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date }
  },
  {
    timestamps: true,
  }
);

// Add plugin
RegisteredCourse.plugin(mongooseDelete, {
  overrideMethods: true,
});

module.exports = mongoose.model("RegisteredCourse", RegisteredCourse, "registeredCourses");
