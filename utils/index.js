const jwt = require('./jwt');
const auth = require('./auth');
const adminAuth = require('./adminAuth')

const errorHandler = require('./errHandler');


module.exports = {
    jwt,
    adminAuth,
    auth,
    errorHandler
}