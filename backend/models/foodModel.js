import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    averageRating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    }
})

// const foodModel = mongoose.model.food || mongoose.model("food",foodSchema);
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);


export default foodModel;