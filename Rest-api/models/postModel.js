const mongoose = require("mongoose");
const types = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
	{
		title: {
			type: types.String,
			required: true
		},
		description: {
			type: types.String,
			required: true
		},
		likes: [ { type: types.ObjectId, ref: "user" } ],
		dislikes: [ { type: types.ObjectId, ref: "user" } ],
		author: {
			type: types.ObjectId,
			ref: "user",
			required: true
		}
	},
	{ timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("post", postSchema);
