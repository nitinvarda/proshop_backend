import asyncHandler from "../middleware/asyncMiddleware.js";
import Order from "../models/orderModel.js";


//@desc Create new order
//@route POST /api/orders
//@access Private

const addOrderItems = asyncHandler( async function(req, res, next) {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if(orderItems && orderItems.length === 0){
            res.status(400);
            throw new Error("No order items ")
        }
        else{
            const order = new Order({
                orderItems:orderItems.map((x)=>({
                    ...x,
                    product:x._id,
                    _id:undefined
                })),
                user:req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            })
            const createOrder = await order.save();
            res.satus(201).json(createOrder);
        }
    } catch (error) {
        
    }
   
})


//@desc Get logged in user orders
//@route GET /api/orders/myorders
//@access Private

const getMyOrders = asyncHandler( async function(req, res, next) {
   try {
    const orders = await Order.find({user:req.user._id});
    res.status(200).json(orders);
   } catch (error) {
    
   }
    
 })

//@desc Get order by id
//@route GET /api/orders/:id
//@access Private

const getOrderById = asyncHandler( async function(req, res, next) {
   try {
    const order = await Order.findById(req.params.id).populate('user','name email');

    if(order){
        res.status(200).json(order);
    }
    else{
        res.status(404);
        throw new Error("Order not found");
    }
   } catch (error) {
    
   }
   
})


//@desc Update order to paid
//@route GET /api/orders/:id/pay
//@access Private

const updateOrderToPaid = asyncHandler( async function(req, res, next) {
    res.send('update order to paid')
    
 })

 //@desc Update to delivered
//@route GET /api/orders/:id/deliver
//@access Private

const updateOrderToDelivered = asyncHandler( async function(req, res, next) {
    res.send('update order to delivered')
    
 })

 //@desc Get all orders
//@route GET /api/orders
//@access Private/Admin

const getOrders = asyncHandler( async function(req, res, next) {
    res.send('get all orders')
    
 })

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrders
}