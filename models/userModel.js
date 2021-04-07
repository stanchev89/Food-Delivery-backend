const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALTROUNDS) || 9;

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const types = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
    {
        username: {
            type: types.String,
            required: true,
            unique: true,
            minlength: [3, "Username should be at least 3 characters"],
            validate: {
                validator: function (v) {
                    return /[a-zA-Z0-9]+/g.test(v);
                },
                message: (props) => `${props.value} must contains only latin letters and digits!`
            }
        },
        password: {
            type: types.String,
            required: true,
            minlength: [5, "Password should be at least 5 characters"]
        },
        address: [
            {
                location: types.String,
                region: types.String,
                delivery: types.Number
            }
        ],
        orders: [
            {
                cart: [
                    {
                        name: types.String,
                        price: types.Number,
                        options: [
                            {
                                key: types.String,
                                values: [types.String]
                            }
                        ],
                        selected_options: [types.String],
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
                date: types.String
            }
        ],
        phone: {
            type: types.String,
            required: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: "Email address is required",
            validate: [validateEmail, "Please fill a valid email address"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
        },
        cart: {
            products: [
                {
                    name: types.String,
                    price: types.Number,
                    options: [
                        {
                            key: types.String,
                            values: [types.String]
                        }
                    ],
                    selected_options: [types.String],
                    quantity: {
                        type: types.Number
                    }
                }
            ],
            totalPrice: {
                type: types.Number
            }
        }
    },
    {timestamps: {createdAt: "created_at"}}
);

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
};

userSchema.pre("save", function (next) {
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
                next();
            });
        });
        return;
    }
    next();
});

module.exports = mongoose.model("user", userSchema);