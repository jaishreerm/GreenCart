import {v2 as cloudinary} from "cloudinary"
import Product from "../models/product.js"


// Add Product : /api/product/add
// 1.Receives product details and images from the client. 2.Parses the product details. 3.Uploads images to Cloudinary.
// 4.Saves everything (details + image links) to the database. 5.Returns a success message.

export const addProduct = async (req, res) =>{
    try {
        let productData = JSON.parse(req.body.productData) 
        /* The frontend sends productData as a JSON string inside req.body. This line converts that JSON string into a JavaScript object.
        💡Example:
        If req.body.productData = '{"title":"T-shirt","price":499}',
        after parsing: productData = {title: "T-shirt", price: 499}
        */

        const images = req.files
        
        // Uploading images to Cloudinary
        /*  Each image is uploaded one by one to Cloudinary (an image hosting service).
            item.path is the file path on the server.
            After uploading, it gets the secure_url (direct link to the image).
            Promise.all() makes sure all images are uploaded before moving on.
            It returns an array of image URLs. */
            let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path, 
                {resource_type: 'image'});
                return result.secure_url
            })
        )
         
        //  Save Product to Database
        /*
        This creates a new product in the database using:
        The parsed 'productData'
        And the uploaded 'imagesUrl' array
        So your product now has both its text info (like title, price, etc.) and image links.
        */
        await Product.create({...productData, image: imagesUrl})

        res.json({success : true, message: "Product Added"})

    } catch (error) {
        console.log(error.message);
    }
}

// Get Product : /api/product/list
export const productList = async (req, res) =>{
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({success : false, message: error.message})
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res) =>{
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error.message);
        res.json({success : false, message: error.message})
    }
}

// change Product inStock : /api/product/stock
export const changeStock = async (req, res) =>{
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({ success: true, message: "Stock Updated" })
    } catch (error) {
        console.log(error.message);
        res.json({success : false, message: error.message})
    }
}