import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../components/context/StoreContext';
import Rating from 'react-rating-stars-component';
import { createReviewApi, getProductReviewsApi } from '../../apis/Api';
import './FoodDetail.css';

const FoodDetail = () => {
    const { id } = useParams();
    const { food_list, addToCart, url, token } = useContext(StoreContext);
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Existing useEffect and function logic remains the same...
    useEffect(() => {
        const selectedFood = food_list.find(item => item._id === id);
        if (selectedFood) {
            setFood(selectedFood);
            setLoading(false);
        }
    }, [id, food_list]);

    const fetchReviews = async () => {
        try {
            const response = await getProductReviewsApi(id);
            if (response.data.success) {
                setReviews(response.data.reviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('Failed to load reviews');
        }
    };

    useEffect(() => {
        if (food) {
            fetchReviews();
        }
    }, [food]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        // Existing handleReviewSubmit logic remains the same...
        setError('');
        setSubmitting(true);

        try {
            const currentToken = localStorage.getItem('token');
            if (!currentToken) {
                setError('Please login to submit a review');
                return;
            }

            if (rating === 0) {
                setError('Please select a rating');
                return;
            }

            if (!comment.trim()) {
                setError('Please write a comment');
                return;
            }

            const response = await createReviewApi({
                productId: id,
                rating,
                comment: comment.trim()
            });

            if (response.data.success) {
                setRating(0);
                setComment('');
                await fetchReviews();
                alert('Review submitted successfully!');
            } else {
                setError(response.data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Review submission error:', error);
            setError(error.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!food) return <div className="error">Food not found</div>;

    return (
        <div className="food-detail-container">
            <div className="food-detail-content">
                <div className="food-image-section">
                    <img src={`${url}/images/${food.image}`} alt={food.name} />
                </div>
                
                <div className="food-info-section">
                    <div className="food-info-header">
                        <p className="info-label">Name: {food.name}</p>
                        <p className="info-label">Price: Rs {food.price}</p>
                        <p className="info-label">Description: {food.description}</p>
                        <p className="info-label">Category: {food.category}</p>
                    </div>

                    <div className="food-actions">
                        <button onClick={() => addToCart(food._id)} className="add-cart-buttons">
                            Add to Cart
                        </button>
                        <button className="buy-buttons">Buy</button>
                    </div>

                    <div className="reviews-section">
                        <h3>Reviews</h3>
                        <div className="reviews-list">
                            {reviews.length === 0 ? (
                                <p className="no-reviews">No reviews yet</p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id} className="review-item">
                                        <div className="reviewer-info">
                                            <h4>{review.userId.name}</h4>
                                            <Rating
                                                count={5}
                                                value={review.rating}
                                                size={20}
                                                edit={false}
                                                activeColor="#ffd700"
                                            />
                                        </div>
                                        <p className="review-text">{review.comment}</p>
                                        <p className="review-date">
                                            {new Date(review.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="review-form">
                            <h4>Rating</h4>
                            <Rating
                                count={5}
                                value={rating}
                                onChange={setRating}
                                size={24}
                                activeColor="#ffd700"
                                isHalf={false}
                            />
                            <h4>Write Comment</h4>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your comment..."
                                className="comment-input"
                                disabled={submitting}
                            />
                            {error && <p className="error-message">{error}</p>}
                            <button
                                onClick={handleReviewSubmit}
                                className="submit-review-button"
                                disabled={submitting}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetail;