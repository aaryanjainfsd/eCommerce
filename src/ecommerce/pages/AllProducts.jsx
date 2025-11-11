import axios from "axios";
import { useState, useEffect } from "react";
import instance from "../routes/axiosConfig";

function First() {
    const [products, setProducts] = useState([]);

    useEffect(() => {getData();}, []);

    async function getData() {
        const response = await instance.get("/product/get");
        setProducts(response.data);
    }

    return (
        <>
            <div className="container">
                <h2 className="heading">🛍️ Product List</h2>

                {products.length > 0 ? (
                    <div className="product-grid">
                        {products.map((item) => (
                            <div className="product-card" key={item._id}>
                                {/* 👇 Wrap in <a> tag to redirect to product detail */}
                                <a
                                    href={`/product-details/${item._id}`}
                                    className="product-link"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="product-image"
                                    />

                                    <div className="product-details">
                                        <h3 className="product-title">
                                            {item.code}
                                        </h3>
                                        <p className="product-category">
                                            Category: {item.name}
                                        </p>
                                        <p className="product-desc">
                                            {item.description}
                                        </p>

                                        <div className="product-footer">
                                            <p className="product-price">
                                                ${item.price}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="loading-text">Loading products...</p>
                )}
            </div>
        </>
    );
}

export default First;
