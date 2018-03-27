var mongoose = require("mongoose");

var imageSchema = mongoose.Schema({
	id: String,
	userId: String,
	fileName: String,
	filePath: String
});

module.exports = mongoose.model("Image", imageSchema);