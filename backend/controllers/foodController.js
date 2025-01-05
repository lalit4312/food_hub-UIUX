import fs from 'fs';
import foodModel from '../models/foodModel.js';

// Add food item
const addFood = async (req, res) => {
    try {
        console.log('Request received for adding food:', req.body);

        // Check if an image is uploaded
        if (!req.file) {
            console.error('Image upload is missing');
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const image_filename = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
        });

        await food.save();
        console.log('Food item saved successfully:', food);
        res.json({ success: true, message: 'Food Added' });
    } catch (error) {
        console.error('Error in addFood:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        console.log('Fetching all food items');
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error('Error in listFood:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Remove a food item
const removeFood = async (req, res) => {
    try {
        console.log('Request received for removing food:', req.body);

        const food = await foodModel.findById(req.body.id);
        if (!food) {
            console.error('Food item not found');
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }

        const filePath = `uploads/${food.image}`;
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
            } else {
                console.log('Image file deleted:', filePath);
            }
        });

        await foodModel.findByIdAndDelete(req.body.id);
        console.log('Food item removed successfully');
        res.json({ success: true, message: 'Food Removed' });
    } catch (error) {
        console.error('Error in removeFood:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// search the products
// const searchProducts = async (req, res) => {
//     const { search, page, limit, sort } = req.query;
//     const pageNumber = parseInt(page) || 1;
//     const pageSize = parseInt(limit) || 2;
//     const sortBy = sort || "createdAt";

//     try {
//         let query = {};

//         if (search) {
//             const regex = new RegExp(`^${search}`, "i");
//             query.$or = [
//                 { name: { $regex: regex } },
//                 { name: { $regex: search, $options: "i" } },
//             ];
//         }

//         const sortOptions = {};
//         if (sortBy) {
//             const [field, order] = sortBy.split(",");
//             sortOptions[field] = order || "asc";
//         }

//         const products = await foodModel
//             .find(query)
//             .sort(sortOptions)
//             .skip((pageNumber - 1) * pageSize)
//             .limit(pageSize);

//         const totalProducts = await foodModel.countDocuments(query);

//         res.status(200).json({
//             success: true,
//             message: "Products searched successfully",
//             products,
//             totalPages: Math.ceil(totalProducts / pageSize),
//         });
//     } catch (error) {
//         console.error("Error searching products:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error,
//         });
//     }
// };


const searchProducts = async (req, res) => {
    const { search, page, limit, sort } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const sortBy = sort || "createdAt";

    try {
        let query = {};

        if (search) {
            const regex = new RegExp(`^${search}`, "i");
            query.$or = [
                { name: { $regex: regex } },
                { name: { $regex: search, $options: "i" } },
            ];
        }

        const sortOptions = {};
        if (sortBy) {
            const [field, order] = sortBy.split(",");
            sortOptions[field] = order || "asc";
        }

        const totalProducts = await foodModel.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / pageSize);

        const products = await foodModel
            .find(query)
            .sort(sortOptions)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({
            success: true,
            message: "Products searched successfully",
            products,
            totalPages,
        });
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
};
export { addFood, listFood, removeFood, searchProducts };
