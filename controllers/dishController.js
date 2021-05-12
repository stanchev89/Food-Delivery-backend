const {dishModel} = require("../models");

function getAllDishes(req, res, next) {
    return dishModel.find().then((dishes) => res.json(dishes)).catch(next);
}

function getDailyMenu(req, res, next) {
    return dishModel.find({daily_menu: true}).then((dishes) => res.json(dishes)).catch(next);
}


function getDish(req, res, next) {
    const id = req.params.id;
    return dishModel.find({_id: id}).then(dish => res.json(dish)).catch(next);
}


function getDishesByCategory(req, res, next) {
    const {category} = req.params;
    return dishModel.find({category: {'$regex': `${category}`}}).then((dishes) => res.json(dishes)).catch(next);
}


function addNewDish(req, res, next) {
    const newDish = req.body;
    if(newDish.daily_menu === undefined) {
        newDish.daily_menu = false;
    }
    return dishModel.find({name: newDish.name})
        .then(dish => {
            if (dish.length > 0) {
                return Promise.reject({message: 'Dish already exist!'})
            }
            return dishModel.create(newDish)
                .then((response) => {
                    res.status(201).send({message: 'Successful added dish!'})
                }).catch(err => {
                if (err.name === "MongoError" && err.code === 11000) {
                    let field = err.message.split("index: ")[1];
                    field = field.split(" dup key")[0];
                    field = field.substring(0, field.lastIndexOf("_"));

                    res.status(409).send({message: `This ${field} is already registered!`});
                    return;
                }
                next(err);
            })

        }).catch(next)
}

function removeDish(req, res, next) {
    const id = req.params.id;
    return dishModel.findOneAndDelete({_id: id})
        .then(deletedDish => {
            res.status(200).json(deletedDish);
        })
        .catch(next);
}


function editDish(req, res, next) {
    const id = req.params.id;
    const dishProps = ['name', 'products', 'meatless', 'category', 'price', 'weight', 'img', 'options','selected_options', 'daily_menu']
    const update = {
        $addToSet: {},
        $push: {},
        $set: {},
        $pull: {}
    };
    for (const key in req.body) {
        if (dishProps.includes(key)) {
            update.$set[key] = req.body[key];
        }
    }

    return dishModel.findOneAndUpdate({_id: id}, update) // to return newDish add {new: true}
        .then(oldDish => {
            res.status(200).json(oldDish);
        })
        .catch(next)
}


module.exports = {
    getAllDishes,
    getDish,
    getDishesByCategory,
    addNewDish,
    removeDish,
    editDish,
    getDailyMenu
};