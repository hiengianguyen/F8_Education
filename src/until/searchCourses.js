const CourseModel = require("../apps/models/CourseModel");

function searchCourses(role, keyword, userId) {
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
            .then((courses) => {
                return courses;
            })
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
                        course.name.toLowerCase().includes(newKeyword.toLowerCase()) ||
                        course.slug.includes(newKeyword.toLowerCase())
                );
            })
            .catch((err) => {
                console.log(err);
                return [];
            });
    }
}

module.exports = { searchCourses };