const app = require('./app')


const port = 3000
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


//delete user
app.get('/',async (req,res) => {

    res.status(200).send({message: "hey there! Welcome to IOT-BASED-SHOPPING-CART"})

})