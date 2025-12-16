const books = require("../models/bookModel")
const stripe = require('stripe')(process.env.stripeKey);


// add book
exports.addBookController = async(req,res)=>{
    console.log("inside AddBook Controller");
    const {title, author, noofpages, imageurl, price, dPrice, abstract, publisher, language, isbn, category } = req.body
    console.log(title, author, noofpages, imageurl, price, dPrice, abstract, publisher, language, isbn, category );

    uploadImg =[]

    req.files.map((item)=>uploadImg.push(item.filename))
    
    console.log(uploadImg);

    const email =req.payload
    console.log(email);

    try{
        const existingBook = await books.findOne({title,userMail:email})
        if(existingBook){
                res.status(401).json("You already added this book!!!")
        }else{
            const newBook = new books({
                title, author, noofpages, imageurl, price, dPrice, abstract, publisher, language, isbn, category,uploadedImg: uploadImg, userMail:email
            })
            await newBook.save()
             res.status(200).json(newBook)
        }

    }catch(err){
         res.status(500).json(err)
    }
    
    
    
    
}

// To get home books
exports.getHomeBooksController = async (req,res)=>{
    try{    
        const allHomebooks = await books.find().sort({_id:-1}).limit(4)
        res.status(200).json(allHomebooks)

    }catch(err){
        res.status(500).json(err)
    }
}



// To get all books
exports.getAllBooksController = async (req,res)=>{
    const searchKey = req.query.search
    console.log(searchKey);
    const email = req.payload
    
    try{    
        const query = {
            title:{
                $regex:searchKey, $options:"i"
            },
            userMail:{$ne:email}
        }
        const allbooks = await books.find(query)
        res.status(200).json(allbooks)

    }catch(err){
        res.status(500).json(err)
    }
}

// To get a particular books
exports.getABookController = async (req,res)=>{
    const {id} = req.params
    console.log(id);
    try{    
        const book = await books.findOne({_id:id})
        res.status(200).json(book)

    }catch(err){
        
        res.status(500).json(err)
    }
}

// to get all books added by user
exports.getAllUserBooksController = async (req,res)=>{
    console.log("Inside getAllUserBooksController");
    const email = req.payload
    console.log(email);
    try{    
      
        const allUserBooks = await books.find({userMail:email})
        res.status(200).json(allUserBooks)

    }catch(err){
        res.status(500).json(err)
    }
}

// to get all books brought by user
exports.getAllUserBroughtBooksController = async (req,res)=>{
    console.log("Inside getAllUserBroughtBooksController");
    const email = req.payload
    console.log(email);
    try{    
      
        const allUserBroughtBooks = await books.find({brought:email})
        res.status(200).json(allUserBroughtBooks)

    }catch(err){
        res.status(500).json(err)
    }
}

// to delete a user book
exports.deleteABookController = async (req,res)=>{
    console.log("Inside deleteABookController");
    const {id} = req.params
    console.log(id);
    try{    
      
         await books.findByIdAndDelete({_id:id})
        res.status(200).json("delete Successfully")

    }catch(err){
        res.status(500).json(err)
        console.log(err);
        
    }
}

// to delete a user book
exports.makePaymentController = async (req,res)=>{
    const {bookDetails} = req.body
    const email = req.payload
    try{    
            const existingBook = await books.findByIdAndUpdate({_id:bookDetails._id},     { title:bookDetails.title,
            author:bookDetails.author,
            noofpages:bookDetails.noofpages,
            imageurl:bookDetails.imageurl,
            price:bookDetails.price,
            dPrice:bookDetails.dPrice,
            abstract:bookDetails.abstract,
            publisher:bookDetails.publisher,
            language:bookDetails.language,
            isbn:bookDetails.isbn,
            category:bookDetails.category,
            uploadedImg:bookDetails.uploadImg,
            status:'sold',
            userMail:bookDetails.userMail,
            brought:email
         },{new:true})

        //  variable of lineitem
        const line_item =[{
            price_data:{
                currency:"usd",
                product_data:{
                    name:bookDetails.title,
                    description:`${bookDetails.author} | ${bookDetails.publisher}`,
                    images:[bookDetails.imageurl],
                    metadata:{
                            title:bookDetails.title,
                            author:bookDetails.author,
                            noofpages:`${bookDetails.noofpages}`,
                            imageurl:bookDetails.imageurl,
                            price:`${bookDetails.price}`,
                            dPrice:`${bookDetails.dPrice}`,
                            abstract:bookDetails.abstract,
                            publisher:bookDetails.publisher,
                            language:bookDetails.language,
                            isbn:bookDetails.isbn,
                            category:bookDetails.category,
                            // uploadedImg:bookDetails.uploadImg,
                            status:'sold',
                            userMail:bookDetails.userMail,
                            brought:email
                    }

                },
                unit_amount: Math.round(bookDetails.dPrice*100) // cents
            },
            quantity:1
        }]
        //  create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            // purchased using cards
                payment_method_types: ['card'], 
            // details of products thet purchased
                line_items: line_item,
            // make payment
                mode: 'payment',
            // if payment is success - the url of page to shown
                success_url:"https://bookstore-july25.vercel.app/payment-success",
            // if payment is failed - the url of page to shown            
                cancel_url:"https://bookstore-july25.vercel.app/payment-error"
        });
        console.log(session);
        res.status(200).json({url:session.url})

    }catch(err){
        res.status(500).json(err)
        console.log(err);
        
    }
}


// ................ ADMIN.......................
exports.getAllBooksAdminController = async (req,res)=>{
    
    try{    
      
        const allbooks = await books.find()
        res.status(200).json(allbooks)

    }catch(err){
        res.status(500).json(err)
    }
}


exports.approveBookController = async (req,res)=>{
     const {_id,title, author, noofpages, imageurl, price, dPrice, abstract, publisher, language, isbn, category ,uploadedImg,status,userMail,brought} = req.body

     console.log(_id,title, author, noofpages, imageurl, price, dPrice, abstract, publisher, language, isbn, category ,uploadedImg,status,userMail,brought);
    
    try{    
      
        const existingBook = await books.findByIdAndUpdate({_id},{_id,title, author, noofpages, imageurl, price, dPrice, abstract, publisher, language, isbn, category ,uploadedImg,status:"approved",userMail,brought},{new:true})
        res.status(200).json(existingBook)

    }catch(err){
        res.status(500).json(err)
    }
}

