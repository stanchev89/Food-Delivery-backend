const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALTROUNDS);
const fs = require("fs");

const validateEmail = function(email) {
	const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email);
};

const types = mongoose.Schema.Types;

const adminSchema = new mongoose.Schema(
	{
		username: {
			type: types.String,
			required: true,
			unique: true,
			minlength: [ 5, "Username should be at least 5 characters" ],
			validate: {
				validator: function(v) {
					return /[a-zA-Z0-9]+/g.test(v);
				},
				message: (props) => `${props.value} must contains only latin letters and digits!`
			}
		},
		password: {
			type: types.String,
			required: true,
			minlength: [ 5, "Password should be at least 5 characters" ]
		}
	},
	{ timestamps: { createdAt: "created_at" } }
);

adminSchema.methods = {
	matchPassword: function(password) {
		return bcrypt.compare(password, this.password);
	}
};

adminSchema.pre("save", function(next) {
	if (this.isModified("password")) {
		bcrypt.genSalt(saltRounds, (err, salt) => {
			if (err) {
				next(err);
			}
			bcrypt.hash(this.password, salt, (err, hash) => {
				if (err) {
					next(err);
				}
				this.password = hash;
				if (process.env.ADMIN_TOKEN === "empty") {
					fs.writeFile(".env", `ADMIN_TOKEN=${hash}`, function(err) {
						if (err) throw err;
					});
				}
				next();
			});
		});
		return;
	}
	next();
});

module.exports = mongoose.model("admin", adminSchema);
