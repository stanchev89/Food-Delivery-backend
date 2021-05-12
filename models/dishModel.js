const mongoose = require('mongoose');

const types = mongoose.Schema.Types;

const dishSchema = new mongoose.Schema(
    {
        name: {
            type: types.String,
            required: true
        },
        products: [types.String],
        meatless: {
            type: types.Boolean,
            default: false
        },
        category: {
            type: types.String,
            required: true
        },
        price: {
            type: types.Number,
            required: true
        },
        weight: {
            type: types.Number
        },
        img: {
            type: types.String
        },
        options: types.Mixed,
        selected_options: types.Mixed,
        daily_menu: {
            type: types.Boolean,
            required: true
        }
    }
);

module.exports = mongoose.model("dish", dishSchema);