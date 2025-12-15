import axios from "axios";
import { useState, useEffect } from "react";
import instance from "../../shared/config/axiosConfig";
import styles from "../../assets/css/allproducts.module.css";
import { useCurrency } from "../contexts/CurrencyProvider";

function First() {
    const [products, setProducts] = useState([]);
    const { convert, currency } = useCurrency();

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const response = await instance.get("/products/get");

        console.log("Fetched products:", response.data.products); // Debugging line
        setProducts(response.data.products);
    }

    function limitWords(text, wordLimit) {
        if (!text) return "";
        const words = text.split(" ");
        return words.length <= wordLimit
            ? text
            : words.slice(0, wordLimit).join(" ") + "...";
    }

    // console.log("Rendering products:", products); // Debugging line
    return (
        <div className={styles.productContainer}>
            <h2 className={styles.productHeading}>🛍️ Explore Our Products</h2>

            {products.length > 0 ? (
                <div className={styles.productGrid}>
                    {products.map((item) => (
                        <div className={styles.productCard} key={item._id}>
                            <a href={`/product-details/${item._id}`} className={styles.productLink} >
                                <div className={styles.imageWrapper}>
                                    <img src={ item.images?.cloud || item.images?.local } alt={item.name} className={styles.productImage} loading="lazy" />
                                </div>

                                <div className={styles.productInfo}>
                                    {/* PRODUCT NAME */}
                                    <h3 className={styles.productTitle}>
                                        {limitWords(item.name, 4)}
                                    </h3>

                                    {/* CATEGORY */}
                                    <p className={styles.productCategory}>
                                        {item.category}
                                    </p>

                                    {/* DESCRIPTION */}
                                    <p className={styles.productDesc}>
                                        {limitWords(item.description, 8)}
                                    </p>

                                    <div className={styles.productFooter}>
                                        {/* PRICE */}
                                        <span className={styles.productPrice}> {currency}{" "} {convert( Number(item.discountedPrice) )} </span>
                                        <button className={styles.viewBtn}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.loadingText}>Loading products...</p>
            )}
        </div>
    );
}

export default First;
