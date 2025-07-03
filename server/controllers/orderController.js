import Order from "../models/Order.js";
import Product from "../models/product.js";



// place Order COD : /api/order/cod, cash on Delivery
// we will create one controller fn to place an order using  cash on delivery method
export const placeOrderCOD = async (req, res) =>{ 
    try {
        const { userId, items, address } = req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        } 
        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item)=>{ // acc =  initial count of the amount
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0) // set initial acc value 0

        // Add Tax Charge (2%)
        amount +=Math.floor(amount * 0.02);

        // we will create the order that will be saved in the database

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD" ,
        });

        return res.json({success: true, message: "Order Placed Successfully"});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
    }
    
    // to get order details of individual users
    // Get orders by User ID : /api/order/user
    export const getUserOrders = async (req, res) =>{
        try {
            const { userId } = req.body;
            const orders = await Order.find({
                userId,
                $or : [{paymentType: "COD"}, {isPaid: true}]
            }).populate("items.product address").sort({createdAt: -1});
            res.json({ success: true, orders });
        } catch (error) {
            return res.json({success: false, message: error.message});
        }
    }

    //create a fn that will get all the order details for seller or admin
    // Get All Orders (for Seller / admin) : /api/order/seller;
    export const getAllOrders = async (req, res) =>{
        try {
            const orders = await Order.find({
                $or : [{paymentType: "COD"}, {isPaid: true}]
            }).populate("items.product address").sort({createdAt: -1});;
            res.json({ success: true, orders });
        } catch (error) { 
            return res.json({success: false, message: error.message});
        }
    }

