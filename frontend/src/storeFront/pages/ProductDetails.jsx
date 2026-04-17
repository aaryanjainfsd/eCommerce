// Import Librarys
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import instance from "../../shared/config/axiosConfig";
import { useCurrency } from "../contexts/CurrencyProvider";
import "../assets/css/productDetail.css";

// import { useCart } from "../contexts/CartProvider";

// ✅ Import Zustand cart store
import useCartStore from "../stores/cartStore";

// Import Files
export default function ProductDetails() {
    const { id } = useParams();

    // -------------------------
    // ZUSTAND CART STATE
    // -------------------------
    const cart = useCartStore((state) => state.cart);
    const addToCart = useCartStore((state) => state.addToCart);
    const increaseQty = useCartStore((state) => state.increaseQty);
    const decreaseQty = useCartStore((state) => state.decreaseQty);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    // -------------------------
    // LOCAL STATE
    // -------------------------
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInCart, setIsInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // -------------------------
    // CONTEXT CALL
    // -------------------------
    const { convert, currency } = useCurrency();

    // -------------------------
    // FETCH PRODUCT
    // -------------------------
    useEffect(() => {
        getProductData(id);
    }, [id]);

    // -------------------------
    // SYNC CART ↔ UI
    // -------------------------
    useEffect(() => {
        if (!product) return;

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
            const response = await instance.get("/products/get/" + id);
            const foundProduct = response.data?.product;

            if (!foundProduct) {
                setError("Product not found. Please check the ID.");
                setProduct(null);
            } else {
                setProduct(foundProduct);
                setError(null);
            }
        } catch (error) {
            console.log(error);
            setError("Unable to fetch product details.");
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }

    // -------------------------
    // CART ACTIONS
    // -------------------------
    function handleAddToCart() {
        addToCart(product._id, quantity);
    }

    function handleIncrease() {
        if (!isInCart) {
            setQuantity((prev) => prev + 1);
        } else {
            increaseQty(product._id);
        }
    }

    function handleDecrease() {
        if (!isInCart) {
            setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
        } else {
            decreaseQty(product._id);
        }
    }

    function handleRemoveFromCart() {
        removeFromCart(product._id);
        setIsInCart(false);
        setQuantity(1);
    }

    if (loading) return <p className="loading-text">Loading product details...</p>;
    if (error) return <p className="error-text">{error}</p>;
    if (!product) return <p className="error-text">Product not found.</p>;

    return (
        <div className="product-detail-page">
            <div className="product-wrapper">
                <div className="product-image-box">
                    <img
                        src={product.data?.images?.cloud || product.data?.images?.local || ""}
                        alt={product.data?.name || "Product image"}
                        className="product-main-img"
                    />
                </div>

                <div className="product-info-box">
                    <h1 className="product-title">{product.data?.name}</h1>
                    <p className="product-code">SKU: {product.data?.sku}</p>

                    <p className="product-desc">
                        {product.data?.shortDescription || "No description available."}
                    </p>

                    <div className="product-price-box">
                        <span className="product-price">
                            {currency} {convert(Number(product.data?.sellingPrice) || 0).toFixed(2)}
                        </span>
                        <span className="price-tag">Inclusive of all taxes</span>
                    </div>

                    <div className="quantity-container">
                        <p className="quantity-label">Quantity</p>
                        <div className="quantity-controls">
                            <button className="qty-btn" onClick={handleDecrease}>
                                −
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button className="qty-btn" onClick={handleIncrease}>
                                +
                            </button>
                        </div>
                    </div>

                    <div className="product-action-buttons">
                        {!isInCart ? (
                            <button onClick={handleAddToCart} className="btn-add-cart">
                                Add to Cart
                            </button>
                        ) : (
                            <button onClick={handleRemoveFromCart} className="btn-remove-cart">
                                🗑️ Remove from Cart
                            </button>
                        )}
                        <NavLink to="/cart">
                            <button className="btn-buy-now">⚡ Go to Cart</button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
