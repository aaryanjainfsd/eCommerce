import { useEffect, useState, useRef } from "react";
import { useCart } from "../contexts/CartProvider";
import instance from "../../shared/config/axiosConfig";
import { NavLink } from "react-router-dom";
import "../../assets/css/cart.css";
import { useCurrency } from "../contexts/CurrencyProvider";


function Cart() {
    const { cart, setCart } = useCart();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const hasLoadedOnce = useRef(false);
    const { convert, currency } = useCurrency();

    useEffect(() => {
        if (cart.length > 0) getCartProducts();
        else setCartItems([]);
    }, [cart]);

    async function getCartProducts() {
        if (!hasLoadedOnce.current) setLoading(true);
        try {
            const responses = await Promise.all(
                cart.map((item) => instance.get(`/product/product/${item.id}`))
            );
            const updated = responses.map((res, index) => ({
                ...res.data,
                quantity: cart[index].quantity,
            }));
            setCartItems(updated);
            hasLoadedOnce.current = true;
        } catch (error) {
            console.error("Error fetching cart products:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleQuantityChange(id, change) {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.id === id) {
                        const newQuantity = item.quantity + change;
                        if (newQuantity <= 0) return null;
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
                .filter(Boolean)
        );
    }

    function handleDelete(id) {
        setCart((prev) => prev.filter((item) => item.id !== id));
    }

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + (convert(item.price).toFixed(2) || 0) * (item.quantity || 1),
        0
    );

    if (loading) {
        return (
            <div className="cart-loader-container">
                <div className="spinner"></div>
                <p>Loading your cart...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-container">
                <div className="empty-card">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                        alt="Empty Cart"
                        className="empty-cart-icon"
                    />
                    <h2>Your cart is empty 🛒</h2>
                    <p>Looks like you haven’t added anything yet.</p>
                    <NavLink to="/allproducts">
                        <button className="explore-btn">
                            Explore Our Products
                        </button>
                    </NavLink>
                </div>
            </div>
        );
    }
    return (
        <div className="cart-wrapper-new">
            <div className="cart-left-new">
                <h2 className="cart-heading-new">
                    <i className="ri-shopping-bag-3-line"></i> My Cart
                </h2>

                {cartItems.map((item) => (
                    <div className="row-item" key={item._id}>
                        <div className="left-product-info">
                            <img
                                src={item.image}
                                className="prod-img"
                                alt={item.name}
                            />

                            <div className="prod-details">
                                <h3 className="prod-title">{item.name}</h3>
                                <p className="prod-meta">
                                    Price: {currency} {convert(item.price).toFixed(2)}
                                </p>
                                <p className="prod-meta">In Stock</p>

                                <div className="small-actions">
                                    <span
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Remove
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="each-price">{currency} {convert(item.price).toFixed(2)}</div>

                        <div className="qty-select-box">
                            <select
                                value={item.quantity}
                                onChange={(e) =>
                                    handleQuantityChange(
                                        item._id,
                                        Number(e.target.value) - item.quantity
                                    )
                                }
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((q) => (
                                    <option key={q} value={q}>
                                        {q}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="total-price">
                            {currency} 
                            {(convert(item.price).toFixed(2) * item.quantity).toLocaleString(
                                "en-IN"
                            )}
                        </div>
                    </div>
                ))}

                <div className="item-count">
                    <b>{cartItems.length} Items</b>
                </div>
            </div>

            {/* ================= RIGHT SIDE SUMMARY ================ */}
            <div className="cart-right-new">
                <div className="summary-box-new">
                    <h3 className="summary-title-new">Order Summary</h3>

                    <div className="promo-box">
                        <input type="text" placeholder="Promo Code" />
                        <button>Apply</button>
                    </div>

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>TBD</span>
                    </div>

                    <div className="summary-row">
                        <span>Discount</span>
                        <span>- ₹0</span>
                    </div>

                    <div className="summary-row">
                        <span>Tax</span>
                        <span>TBD</span>
                    </div>

                    <div className="summary-row total-row">
                        <span>Estimated Total</span>
                        <span>{currency} {totalAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <button className="checkout-button">Checkout</button>
                </div>
            </div>
        </div>
    );
}

export default Cart;
