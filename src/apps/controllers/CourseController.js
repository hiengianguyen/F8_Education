const Course = require('../models/Course');
const { mongooseToObject } = require('../../until/mongoose');

class CourseController {

  show(req, res, next) {
    Course.findOne({ slug: req.params.slug })
      .then(course => {
        res.render('courses/show', {
          course: mongooseToObject(course),
        });
      })
      .catch(err => next(err));
  }
  create(req, res) {
    res.render('courses/create');
  }
  store(req, res, next) {
    const formData = req.body;
    formData.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    const course = new Course(formData);
    course.save()
      .then(() => res.redirect('/'))
      .catch(err => next(err));
    console.log(formData)
  }
}

module.exports = new CourseController();
