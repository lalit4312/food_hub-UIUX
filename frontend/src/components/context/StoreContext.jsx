import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    // Try to load cartItems from localStorage, fallback to empty object
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : {}; // Default to empty object if no cart in localStorage
    });

    const url = "http://localhost:4000";
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // Load token from localStorage if available
    const [food_list, setFoodList] = useState([]);

    // Add item to cart
    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        // Save to localStorage immediately after state change
        localStorage.setItem("cart", JSON.stringify({ ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 }));

        if (token) {
            try {
                await axios.post(
                    `${url}/api/cart/add`,
                    { itemId },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: prev[itemId] - 1 };
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart to localStorage
            return updatedCart;
        });

        if (token) {
            try {
                await axios.post(
                    `${url}/api/cart/remove`,
                    { itemId },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
        }
    };

    // Get total amount of the cart items which have been added
    const getTotalCartAmount = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo && typeof itemInfo.price === 'number') {
                    total += cartItems[item] * itemInfo.price;
                } else {
                    console.error(`Invalid item info for id ${item}:`, itemInfo);
                }
            }
        }
        return total;
    };

    // const fetchFoodList = async () => {
    //     const response = await axios.get(url + "/api/food/list");
    //     setFoodList(response.data.data);
    //     console.log('Food list fetched');
    // };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
            console.log('Food list fetched');
        } catch (error) {
            console.error('Error fetching food list:', error);
            setFoodList([]); // Set a default value on error
        }
    };

    // Load cart data from backend if user is logged in
    const loadCartData = async (token) => {
        try {
            const response = await axios.post(
                `${url}/api/cart/get`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();

            // If token exists in localStorage, load cart from backend
            if (token) {
                await loadCartData(token);
            }
        }

        loadData();
    }, [token]); // Only fetch food and load cart when token is available or changes

    // Handle setting token after login
    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken); // Save token in localStorage
        setToken(newToken); // Set token in state

        // After login, load the cart data immediately
        loadCartData(newToken);
    };

    const contextValue = {
        food_list,
        url,
        token,
        setToken,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        handleLogin, // Pass this down for login handling
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
