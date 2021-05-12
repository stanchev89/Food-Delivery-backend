const mongoose = require('mongoose');

const types = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: types.ObjectId,
            ref: "user",
            required: true
        },
        cart: [
            {
                name: types.String,
                price: types.Number,
                options: types.Mixed,
                selected_options: types.Mixed,
                quantity: {
                    type: types.Number
                }
            }
        ]
        ,
        payment: types.String,
        address: {
            region: types.String,
            location: types.String,
        },
        delivery: types.Number,
        description: types.String,
        totalPrice: types.Number,
    },
    {timestamps: {createdAt: "created_at"}}
);

module.exports = mongoose.model("order", orderSchema);