const env = process.env.NODE_ENV || "development";

const config = {
	apiURL: "https://food-delivery-stanchev.herokuapp.com",
	development: {
		port: process.env.PORT || 3500,
		dbURL: process.env.DB_URL,
		origin: [ "http://localhost:3000", "http://localhost:4200", "http://localhost:3001","https://food-delivery-stanchev.herokuapp.com" ]
	},
	production: {
		port: process.env.PORT,
		dbURL: process.env.DB_URL,
		origin: [ "https://food-delivery-stanchev.herokuapp.com" ]
	}
};

module.exports = config[env];