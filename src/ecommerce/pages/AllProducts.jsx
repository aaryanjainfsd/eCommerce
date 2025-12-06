import axios from "axios";
import { useState, useEffect } from "react";
import instance from "../routes/axiosConfig";
import styles from "../../assets/css/allproducts.module.css";
import { useCurrency } from "../contexts/CurrencyProvider";

function First() {
	const [products, setProducts] = useState([]);
	const { convert, currency } = useCurrency();

	useEffect(() => { getData(); }, []);

	async function getData() {
		const response = await instance.get("/product/get");
		setProducts(response.data);
	}

	function limitWords(text, wordLimit) {
		if (!text) return "";
		const words = text.split(" ");
		return words.length <= wordLimit
			? text
			: words.slice(0, wordLimit).join(" ") + "...";
	}

	return (
		<div className={styles.productContainer}>
			<h2 className={styles.productHeading}>🛍️ Explore Our Products</h2>

			{products.length > 0 ? (
				<div className={styles.productGrid}>
					{products.map((item) => (
						<div className={styles.productCard} key={item._id}>
							<a href={`/product-details/${item._id}`} className={styles.productLink}>
								<div className={styles.imageWrapper}>
									<img
										src={item.image}
										alt={item.title}
										className={styles.productImage}
										loading="lazy"
									/>
								</div>

								<div className={styles.productInfo}>
									<h3 className={styles.productTitle}>{item.code}</h3>
									<p className={styles.productCategory}>{limitWords(item.name, 5)}</p>
									<p className={styles.productDesc}>{limitWords(item.description, 2)}</p>

									<div className={styles.productFooter}>
										{/* ⭐ UPDATED PRICE */}
										<span className={styles.productPrice}>
											{currency} {convert((item.price).toFixed(2))}
										</span>

										<button className={styles.viewBtn}>View Details</button>
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
