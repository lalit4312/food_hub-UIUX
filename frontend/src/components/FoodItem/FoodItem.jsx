// import React, { useContext } from "react";
// import "./FoodItem.css";
// import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
// import { StoreContext } from "../context/StoreContext";
// import { useNavigate } from "react-router-dom";

// const FoodItem = ({ id, name, price, image }) => {
//     const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
//     const navigate = useNavigate();

//     const truncateWords = (text, wordCount = 3) => {
//         const words = text.split(" ");
//         if (words.length <= wordCount) return text;
//         return words.slice(0, wordCount).join(" ") + "...";
//     };

//     const handleMoreClick = () => {
//         navigate(`/food/${id}`);
//     };

//     const handleBuyClick = () => {
//         addToCart(id);
//         navigate('/cart');  // Navigate to the cart page
//     };

//     return (
//         <div className="food-card">
//             <div className="food-card-img-container">
//                 <img className="food-card-image" src={url + "/images/" + image} alt={name} />
//                 {!cartItems[id] ? (
//                     <FaPlusCircle
//                         className="add-icon"
//                         onClick={() => addToCart(id)}
//                         title="Add to cart"
//                     />
//                 ) : (
//                     <div className="food-card-counter">
//                         <FaMinusCircle
//                             className="counter-icon"
//                             onClick={() => removeFromCart(id)}
//                             title="Remove"
//                         />
//                         <p>{cartItems[id]}</p>
//                         <FaPlusCircle
//                             className="counter-icon"
//                             onClick={() => addToCart(id)}
//                             title="Add"
//                         />
//                     </div>
//                 )}
//             </div>
//             <div className="food-card-info">
//                 <h3>{name}</h3>
//                 <p className="food-card-price">Rs {price}</p>
//                 <div className="food-card-buttons">
//                     <button className="buy-btn" onClick={handleBuyClick}>
//                         Buy
//                     </button>
//                     <button className="more-btn" onClick={handleMoreClick}>
//                         Details
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FoodItem;

// import React, { useContext, useEffect, useState } from "react";
// import "./FoodItem.css";
// import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
// import { StoreContext } from "../context/StoreContext";
// import { useNavigate } from "react-router-dom";
// import Rating from "react-rating-stars-component";
// import { getProductReviewsApi } from "../../apis/Api";

// const FoodItem = ({ id, name, price, image }) => {
//     const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
//     const navigate = useNavigate();
//     const [averageRating, setAverageRating] = useState(0);

//     useEffect(() => {
//         fetchRating();
//     }, [id]);

//     const fetchRating = async () => {
//         try {
//             const response = await getProductReviewsApi(id);
//             if (response.data.success && response.data.reviews.length > 0) {
//                 const totalRating = response.data.reviews.reduce(
//                     (sum, review) => sum + review.rating,
//                     0
//                 );
//                 setAverageRating(totalRating / response.data.reviews.length);
//             }
//         } catch (error) {
//             console.error('Error fetching ratings:', error);
//         }
//     };

//     const handleMoreClick = () => {
//         navigate(`/food/${id}`);
//     };

//     const handleBuyClick = () => {
//         addToCart(id);
//         navigate('/cart');
//     };

//     return (
//         <div className="food-card">
//             <div className="food-card-img-container">
//                 <img className="food-card-image" src={url + "/images/" + image} alt={name} />
//                 {!cartItems[id] ? (
//                     <FaPlusCircle
//                         className="add-icon"
//                         onClick={() => addToCart(id)}
//                         title="Add to cart"
//                     />
//                 ) : (
//                     <div className="food-card-counter">
//                         <FaMinusCircle
//                             className="counter-icon"
//                             onClick={() => removeFromCart(id)}
//                             title="Remove"
//                         />
//                         <p>{cartItems[id]}</p>
//                         <FaPlusCircle
//                             className="counter-icon"
//                             onClick={() => addToCart(id)}
//                             title="Add"
//                         />
//                     </div>
//                 )}
//             </div>
//             <div className="food-card-info">
//                 <div className="food-card-header">
//                     <h3>{name}</h3>
//                     <Rating
//                         count={5}
//                         value={averageRating}
//                         size={16}
//                         edit={false}
//                         activeColor="#ffd700"
//                         isHalf={true}
//                     />
//                 </div>
//                 <p className="food-card-price">Rs {price}</p>
//                 <div className="food-card-buttons">
//                     <button className="buy-btn" onClick={handleBuyClick}>
//                         Buy
//                     </button>
//                     <button className="more-btn" onClick={handleMoreClick}>
//                         Details
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FoodItem;


import React, { useContext, useEffect, useState } from "react";
import "./FoodItem.css";
import { FaPlusCircle, FaMinusCircle, FaStar } from "react-icons/fa"; // Import FaStar
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import Rating from "react-rating-stars-component";
import { getProductReviewsApi } from "../../apis/Api";

const FoodItem = ({ id, name, price, image }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        fetchRating();
    }, [id]);

    const fetchRating = async () => {
        try {
            const response = await getProductReviewsApi(id);
            if (response.data.success && response.data.reviews.length > 0) {
                const totalRating = response.data.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                );
                const calculated = totalRating / response.data.reviews.length;
                console.log('Rating calculated:', calculated); // Debug log
                setAverageRating(calculated);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const handleMoreClick = () => {
        navigate(`/food/${id}`);
    };

    const handleBuyClick = () => {
        addToCart(id);
        navigate('/cart');
    };

    // Render stars manually
    const renderStars = () => {
        const stars = [];
        const roundedRating = Math.round(averageRating);
        
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar 
                    key={i}
                    className={i < roundedRating ? "star-filled" : "star-empty"}
                />
            );
        }
        return stars;
    };

    return (
        <div className="food-card">
            <div className="food-card-img-container">
                <img className="food-card-image" src={url + "/images/" + image} alt={name} />
                {!cartItems[id] ? (
                    <FaPlusCircle
                        className="add-icon"
                        onClick={() => addToCart(id)}
                        title="Add to cart"
                    />
                ) : (
                    <div className="food-card-counter">
                        <FaMinusCircle
                            className="counter-icon"
                            onClick={() => removeFromCart(id)}
                            title="Remove"
                        />
                        <p>{cartItems[id]}</p>
                        <FaPlusCircle
                            className="counter-icon"
                            onClick={() => addToCart(id)}
                            title="Add"
                        />
                    </div>
                )}
            </div>
            <div className="food-card-info">
                <div className="food-card-header">
                    <h3>{name}</h3>
                    <div className="stars-container">
                        {renderStars()}
                    </div>
                </div>
                <p className="food-card-price">Rs {price}</p>
                <div className="food-card-buttons">
                    <button className="buy-btn" onClick={handleBuyClick}>
                        Buy
                    </button>
                    <button className="more-btn" onClick={handleMoreClick}>
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodItem;