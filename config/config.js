const env = process.env.NODE_ENV || "development";

const config = {
	development: {
		port: process.env.PORT || 3500,
		dbURL: process.env.DB_URL_CREDENTIALS || "mongodb+srv://stanchev89:stanchev89@cluster0.qyezc.gcp.mongodb.net/delivery?retryWrites=true&w=majority",
		origin: [ "http://localhost:3000", "http://localhost:4200", "http://localhost:3001" ]
	},
	production: {
		port: process.env.PORT,
		dbURL: process.env.DB_URL_CREDENTIALS,
		origin: [ "http://localhost:3000", "http://localhost:4200", "http://localhost:3001" ]
	}
};

module.exports = config[env];