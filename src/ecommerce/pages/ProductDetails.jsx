// Import Librarys
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../routes/axiosConfig";
import { useCart } from "../contexts/CartProvider";
import "../../assets/css/productDetail.css";

// Import Files

export default function ProductDetails() {
    const { id } = useParams();
	const { cart, setCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInCart, setIsInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {getProductData(id);}, [id]);
	useEffect(() => {
        if (!product) return;
        localStorage.setItem("storedCart", JSON.stringify(cart));
        const existing = cart.find((item) => item.id === product._id);
		if (existing) {
			setIsInCart(true);
			setQuantity(existing.quantity);
		} else {
			setIsInCart(false);
			setQuantity(1);
		} 
    }, [cart, product]);

    async function getProductData() {
        try {
            setLoading(true);
            const response = await instance.get("/product/product/" + id);

            if (response.data.length === 0) {
                setLoading(false);
                setError("Check the ID parameter");
            } else {
                setProduct(response.data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setError("Check the ID parameter");
            setLoading(false);
        }
    }

	function handleAddToCart(idToAdd) 
    {
        const checkItem = cart.find((item) => item.id === idToAdd);
        if (checkItem) 
        {
            alert("Item is already in the cart.");
            return;
        }
        // console.log("Adding to cart:", idToAdd);
		setCart([...cart,{ id: idToAdd, quantity: 1 }]);
	}
    
    if (loading)  return <p className="loading-text">Loading product details...</p>;
    if (!product) return <p className="error-text">Product not found.</p>;
    
    // console.log("Current cart:", cart);
    // console.log(product);

    return (
        <div className="product-detail-page">
            <div className="product-wrapper">
                <div className="product-image-box">
                    <img src={product.image} alt={product.title} className="product-main-img" />
                </div>

                <div className="product-info-box">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-code">Code: {product.code}</p>

                    <p className="product-desc">{product.description}</p>

                    <div className="product-price-box">
                        <span className="product-price">${product.price}</span>
                        <span className="price-tag">Inclusive of all taxes</span>
                    </div>

                    {/* Quantity selector */}
                    <div className="quantity-container">
                        <p className="quantity-label">Quantity</p>
                        <div className="quantity-controls">
                            <button className="qty-btn">−</button>
                            <span className="qty-value">1</span>
                            <button className="qty-btn">+</button>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="product-action-buttons">
                        <button onClick={() => handleAddToCart(product._id)} className="btn-add-cart" disabled={isInCart} >
							{isInCart ? "Added" : "Add to Cart"}
						</button>
                        <button className="btn-buy-now">⚡ Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );


    
}
