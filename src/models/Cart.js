const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({

    cartNumber:{
        type:Number,
        required:true,
        unique: true
    },
    username: {
        type: String
    },
    products:[Object],
    userConnection:Boolean,
    totalBill:{
        type: Number
    },
    checkoutComplete:{
        type: Boolean
    },
    specialCode:{
        type:String,
        required:true,
        unique:true
    }

},
{
    timestamps:true
}
)

const Cart = mongoose.model('Cart',cartSchema)

module.exports = Cart