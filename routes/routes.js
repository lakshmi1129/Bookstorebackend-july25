// import express
const express = require("express")

// import user controller
const userController = require('../controllers/userController')
const bookController = require("../controllers/bookController")

// import middleware
 const jwtMiddleware = require("../middleware/jwtMiddleware")
const multerConfig = require("../middleware/multerMiddleware")
 const jwtAdminMiddleware = require("../middleware/jwtAdminMiddleware")


// instance
const route = new express.Router()

// path to register
route.post("/register",userController.registerController)

// path to login
route.post("/login",userController.loginController)

// path google-login
route.post("/google-login",userController.googleLoginController)


// path to get home books
route.get("/home-books",bookController.getHomeBooksController)





// .................user...................................

// path add-book
route.post("/add-book",jwtMiddleware,multerConfig.array("uploadedImages",3) ,bookController.addBookController)

// path to get all books
route.get("/all-books",jwtMiddleware,bookController.getAllBooksController)

// path to view a book
route.get("/view-books/:id",bookController.getABookController)

// path to update user profile
route.put("/user-profile-update",jwtMiddleware,multerConfig.single('profile'),userController.editUserProfileController)


// path to get all user added books
route.get("/user-add-books",jwtMiddleware,bookController.getAllUserBooksController)


// path to get all user brought books
route.get("/user-brought-books",jwtMiddleware,bookController.getAllUserBroughtBooksController)


// path to delete a user book
route.delete("/delete-user-book/:id",bookController.deleteABookController)


// path to make payment
route.put("/make-payment",jwtMiddleware,bookController.makePaymentController)





// ......Admin...........

// path to get all  books to admin
route.get("/admin-all-books",jwtAdminMiddleware,bookController.getAllBooksAdminController)


// path to Approve  books by admin
route.put("/approve-books",jwtAdminMiddleware,bookController.approveBookController)

// path to get all  users to admin
route.get("/all-users",jwtAdminMiddleware,userController.getAlluserController)


// path to update admin profile
route.put("/admin-profile-update",jwtAdminMiddleware,multerConfig.single('profile'),userController.editAdminProfileController)








module.exports = route

