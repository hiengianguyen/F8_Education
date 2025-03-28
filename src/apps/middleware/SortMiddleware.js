module.exports = function sortMiddleware(req, res, next) {
  res.locals._sort = {
    enabled: false,
    type: "default"
  };

  if (req.query.hasOwnProperty("_sort")) {
    // res.json({message: 'success'})
    Object.assign(res.locals._sort, {
      enabled: true,
      type: req.query.type,
      column: req.query.column
    });
  }

  next();
};
