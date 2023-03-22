# fyp-cart-apis

## Intro:

We are creating an e-commerce platform. We have narrowed everything down to 4 entities and there respective operations for now. 
openapi doc on the way!

There are 4 entities:

1. Product
2. Inventory
3. Cart
4. User
5. order


Product: 
We have products here that will be presented to the user in the frontend.
We can do product operations with /product endpoints.
Only an admin should have permission to use product endpoints.


User:
There are two types of users:

1. shopper
2. admin

admin can do shopper operations but shopper cannot do admin operations. 
Admin and user operations can be done with /admin and /user endpoints respectively


Cart:
Cart contains items. If cart is not connected to a user, it cannot be used. 
We can do cart operations with /cart endpoints.
User can use carts but admin can create and delete carts.


Inventory:
In order to add a product in cart. It should have inventory present in the database. We can use inventory endpoints for that.
We can do inventory operations with inventory endpoints.
Only admin can interact with inventory endpoints.


Order:
After the checkout is complete. We should have an order document. That contains only the necessary information for the cart, cartItems and user that would be kept for tracking purposes by the company.
