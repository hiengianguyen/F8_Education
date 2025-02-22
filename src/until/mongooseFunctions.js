function mongooseToObject(mongoose) {
  return mongoose ? mongoose.toObject() : mongoose;
}

function multipleMongooseToObject(mongooses) {
  return mongooses.map((mongoose) => mongoose.toObject());
}

module.exports = { mongooseToObject, multipleMongooseToObject };
