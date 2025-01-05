import React, { useState, useEffect } from "react";
import { searchApi } from "../../apis/Api.js";
import "./../search/Search.css";
import "../../assets/assets";
import FoodItem from "../../components/FoodItem/FoodItem.jsx";
import { FaSearch } from "react-icons/fa";

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [dishes, setDishes] = useState([]);
    const [displayedDishes, setDisplayedDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 4; // Number of items per page

    const handleSearch = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                params: {
                    search: searchTerm,
                    page: page,
                    limit: limit,
                    sort: "createdAt,desc",
                },
            };

            const response = await searchApi(params);

            if (response.data.success) {
                setDishes(response.data.products);
                setTotalPages(response.data.totalPages);
                setCurrentPage(page);
                setDisplayedDishes(response.data.products.slice(0, limit));
            } else {
                setError("Failed to fetch dishes");
            }
        } catch (err) {
            setError(err.message || "An error occurred while searching");
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        handleSearch(1);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            handleSearch(page); // Fetch new products for the selected page
        }
    };
    const renderPaginationButtons = () => {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                buttons.push(
                    <button
                        key={i}
                        className={currentPage === i ? "active" : ""}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                buttons.push(
                    <button key={i} disabled>
                        ...
                    </button>
                );
            }
        }
        return buttons;
    };

    useEffect(() => {
        handleSearch(currentPage);
    }, [searchTerm, currentPage]);

    return (
        <div className="foodhub">
            <div className="foodhub-title">
                <h1>FoodHub</h1>
                <p>Discover the best food and drinks</p>
            </div>


            <div className="search-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search Desired Food"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="search-button"
                        onClick={handleSearchClick}
                        disabled={loading}
                    >
                        <FaSearch role="img" aria-label="search" />
                    </button>
                </div>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}

            <section className="related-foods">
                <h2>Related Foods</h2>
                <div className="foods-grid">
                    {displayedDishes.map((dish) => (
                        <FoodItem
                            key={dish._id}
                            id={dish._id}
                            name={dish.name}
                            description={dish.description}
                            price={dish.price}
                            image={dish.image}
                        />
                    ))}
                </div>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt; Previous
                    </button>
                    {renderPaginationButtons()}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next &gt;
                    </button>
                </div>
            </section>
        </div>
    );
};

export default SearchPage;