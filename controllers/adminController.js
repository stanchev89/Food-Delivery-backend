const { adminModel,userModel, tokenBlacklistModel } = require("../models");

const utils = require("../utils");
const { authCookieName } = require("../app-config");

const bsonToJson = (data) => {
	return JSON.parse(JSON.stringify(data));
};
const removePassword = (data) => {
	const { password, __v, ...userData } = data;
	return userData;
};

function register(req, res, next) {
	const { username, password } = req.body;
    if(process.env.ADMIN_TOKEN === 'empty' ||  process.env.ADMIN_TOKEN === req.body.adminToken) {
        return adminModel
		.create({ username, password })
		.then(() => {
			res.status(200).send( { message:'Successful admin registration' } );
		})
		.catch((err) => {
			if (err.name === "MongoError" && err.code === 11000) {
				let field = err.message.split("index: ")[1];
				field = field.split(" dup key")[0];
				field = field.substring(0, field.lastIndexOf("_"));

				res.status(409).send({ message: `This ${field} is already registered!` });
				return;
			}
			next(err);
		});
    }
	return res.status(401).send( { message: 'Invalid token!'} )
	
}

function login(req, res, next) {
	const { username, password } = req.body;

	adminModel
		.findOne({ username })
		.then((user) => {
			return Promise.all([ user, user ? user.matchPassword(password) : false ]);
		})
		.then(([ user, match ]) => {
			if (!match) {
				res.status(401).send({ message: "Wrong username or password" });
				return;
			}
			user = bsonToJson(user);
			user = removePassword(user);

			const token = utils.jwt.createToken({ id: user._id });

			if (process.env.NODE_ENV === "production") {
				res.cookie(authCookieName, token, { httpOnly: true, sameSite: "none", secure: true });
			} else {
				res.cookie(authCookieName, token, { httpOnly: true });
			}
			res.status(200).send(user);
		})
		.catch(next);
}

function logout(req, res) {
	const token = req.cookies[authCookieName];

	tokenBlacklistModel
		.create({ token })
		.then(() => {
			res.clearCookie(authCookieName).status(200).send({ message: "Logged out!" });
		})
		.catch((err) => res.send(err));
}



function getProfileInfo(req, res, next) {
	if(!req.user) {
		res.status(200).send('Guest user');
		return;
	}
	const { _id: userId } = req.user;

	adminModel
		.findOne({ _id: userId }, { password: 0, __v: 0 }) //finding by Id and returning without password and __v
		.then((user) => {
			res.status(200).json(user);
		})
		.catch(next);
}

function changeUserPassword(req,res,next) {
	const {_id: userId} = req.user;
	const {oldPassword, newPassword} = req.body;
	userModel.findOne({_id: userId}).then(user => {
		user.matchPassword(oldPassword).then(equal => {
			if (!equal) {
				const err = {errorMessage: 'Invalid password!'};
				res.status(401).send(err);
				return;
			}
			user.password = newPassword;
			user.save()
			res.clearCookie(authCookieName).status(200).send(user);
		});

	}).catch(next);
}

function getAllUsers(req,res,next) {
	userModel.find({},{password: 0, __v: 0})
		.then((users) => {
		res.status(200).send(users);
	}).
		catch(next)
}

function editProfileInfo(req, res, next) {
	const {_id: userId} = req.user;
	const {username, addAddress, deleteAddress, phone, email, order,} = req.body;
	const update = {
		$addToSet: {},
		$push:{},
		$set: {},
		$pull: {}
	};
	
	if (username) {
		update.$set.username = username;
	}

	if (phone) {
		update.$set.phone = phone;
	}
	if (email) {
		update.$set.email = email;
	}

	if (addAddress) {
		update.$addToSet.address = addAddress;
	}
	if (deleteAddress) {
		update.$pull.address = { $in: deleteAddress};
	}

	if(order) {
		update.$push.orders
	}
	userModel.findOneAndUpdate({_id: userId}, update, {new: true})
		.then(user => {
			res.status(200).json(user);
		})
		.catch(next)

}


module.exports = {
	login,
	register,
	logout,
	getProfileInfo,
	editProfileInfo,
	changeUserPassword,
	getAllUsers
};