const {Schema, model} = require("mongoose");

const schema = new Schema({
	id: {
		type: Number,
		required: true
	},
	gender: {
		type: String,
		default: "Unknown"
	},
	masterCategory: {
		type: String,
		default: "Unknown"
	},
	subCategory: {
		type: String,
		default: "Unknown"
	},
	articleType: {
		type: String,
		default: "Unknown"
	},
	baseColour: {
		type: String,
		default: "Unknown"
	},
	season: {
		type: String,
		default: "Unknown"
	},
	year: {
		type: Number,
		default: 0
	},
	usage: {
		type: String,
		default: "Unknown"
	},
	productDisplayName: {
		type: String,
		default: "Unknown"
	},
	imgUrl: {
		type: String,
		default: "Unknown"
	}
});

module.exports = model('products', schema)