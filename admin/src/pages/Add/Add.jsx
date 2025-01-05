import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importing toast styles

// Initialize toast notifications
// toast.configure();

const Add = ({ url }) => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Salad',
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', Number(data.price));
        formData.append('category', data.category);
        formData.append('image', image);

        try {
            console.log('unable to upload')
            const response = await axios.post(`${url}/api/food/add`, formData);

            if (response.data.success) {
                setData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'Salad',
                });
                setImage(false);
                toast.success(response.data.message, { autoClose: 3000 }); // Show success toast
            } else {
                toast.error(response.data.message, { autoClose: 3000 }); // Show error toast
            }
        } catch (error) {
            toast.error('An error occurred while uploading the product!', { autoClose: 3000 });
        }
    };

    return (
        <div className="add">
            <form className="flex-col add-form" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p className="label-text">Upload Image</p>
                    <label htmlFor="image" className="image-label">
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="Upload"
                            className="upload-preview"
                        />
                    </label>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                        required
                    />
                </div>
                <div className="add-product-name flex-col">
                    <p className="label-text">Product Name</p>
                    <input
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        className="input-field"
                    />
                </div>
                <div className="add-product-description flex-col">
                    <p className="label-text">Product Description</p>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="6"
                        placeholder="Describe the product"
                        required
                        className="textarea-field"
                    ></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p className="label-text">Product Category</p>
                        <select
                            onChange={onChangeHandler}
                            name="category"
                            className="select-field"
                            value={data.category}
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Momo">Momo</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Noodles">Noodles</option>
                            <option value="Biryani">Biryani</option>
                            <option value="Drinks">Drinks</option>
                            <option value="Fried Rice">Fried Rice</option>
                            <option value="Tacos">Tacos</option>
                            <option value="Pasta">Pasta</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p className="label-text">Product Price</p>
                        <input
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            name="price"
                            placeholder="Enter price (NPR)"
                            className="input-field"
                        />
                    </div>
                </div>
                <button type="submit" className="add-btn">
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default Add;
