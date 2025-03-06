const CourseModel = require("../apps/models/CourseModel");

function searchCourses(userId, role, keyword) {
  let queryFindCourse;
  switch (role) {
    case "student":
      queryFindCourse = {
        isDeleted: false,
        
      };
      break;
    case "teacher":
      queryFindCourse = {
        createdBy: userId,
        isDeleted: false,
      };
      break;
    default:
      queryFindCourse = {
        isDeleted: false,
      };
  }

  if (keyword === undefined) {
    return CourseModel.find(queryFindCourse)
      .then((courses) => courses)
      .catch((err) => {
        console.log(err);
        return [];
      });
  } else {
    const newKeyword = keyword.toLowerCase().trim();
    return CourseModel.find(queryFindCourse)
      .then((courses) => {
        return courses.filter(
          (course) =>
            course.name.toLowerCase().includes(newKeyword) ||
            course.slug.includes(newKeyword)
        );
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }
}

module.exports = { searchCourses };
