import userModel from './../models/userModel.js';

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from authenticated user
        let userData = await userModel.findById(userId);
        let cartData = userData.cartData;

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error' });
    }
}

// remove items to user cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let userData = await userModel.findById(userId);
        let cartData = userData.cartData;

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Removed from cart' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error' });
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let userData = await userModel.findById(userId);
        let cartData = userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error' });
    }
}

export { addToCart, removeFromCart, getCart }
