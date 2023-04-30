const app = require('./app')


const port = 4000
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


        //delete user
        router.get('/user/:userId',async (req,res) => {

            res.status(200).send({message: "hey there! Welcome to IOT-BASED-SHOPPING-CART"})

            })