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
            res.status(201).json(createOrder);
        }
    } catch (error) {
        console.log({error})
        throw new Error(error);
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
    throw new Error(error);
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
    throw new Error(error);
   }
   
})


//@desc Update order to paid
//@route PUT /api/orders/:id/pay
//@access Private

const updateOrderToPaid = asyncHandler( async function(req, res, next) {
    const order = await Order.findById(req.params.id);
    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult ={
            id:req.body.id,
            status:req.body.status,
            update_time:req.body.update_time,
            email_address:req.body.payer.email_address
        }

        const updateOrder = await order.save();
        res.status(200).json(updateOrder);
    }
    else{
        res.satus(404);
        throw new Error("Order not found");
    }
    
 })

 //@desc Update to delivered
//@route PUT /api/orders/:id/deliver
//@access Private

const updateOrderToDelivered = asyncHandler( async function(req, res, next) {
    const order = await Order.findById(req.params.id);
    if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updateOrder = await order.save();
        res.status(200).json(updateOrder);
    }
    else{
        res.status(404);
        throw new Error("Order not found");
    }

    
 })

 //@desc Get all orders
//@route GET /api/orders
//@access Private/Admin

const getOrders = asyncHandler( async function(req, res, next) {
  const orders = await Order.find({}).populate('user','id name');
  res.status(200).json(orders);
    
 })

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrders
}