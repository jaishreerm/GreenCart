import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';


const productRouter = express.Router();

productRouter.post('/add', upload.array('images'), authSeller, addProduct); // the middleware authSeller , if seller is authenticated then only seller can add the product
productRouter.get('/list', productList)  // this will display the list of products
productRouter.get('/id', productById)
productRouter.post('/stock', authSeller, changeStock) // when the seller is authenticated then only they can change the stock

export default productRouter;