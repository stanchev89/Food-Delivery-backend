const env = process.env.NODE_ENV || "development";

const config = {
	development: {
		port: process.env.PORT || 3500,
		dbURL: process.env.DB_URL,
		origin: ["https://food-delivery-stanchev.herokuapp.com"]
	},
	production: {
		port: process.env.PORT,
		dbURL: process.env.DB_URL,
		origin: ["https://food-delivery-stanchev.herokuapp.com"]
	}
};

module.exports = config[env];