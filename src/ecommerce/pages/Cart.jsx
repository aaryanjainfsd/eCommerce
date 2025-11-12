import { useEffect, useState, useRef } from "react";
import { useCart } from "../contexts/CartProvider";
import instance from "../routes/axiosConfig";
import { NavLink } from "react-router-dom";
import "../../assets/css/cart.css";

function Cart() {
	const { cart, setCart } = useCart();
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const hasLoadedOnce = useRef(false);

	useEffect(() => {
		if (cart.length > 0) getCartProducts();
		else setCartItems([]);
	}, [cart]);

	async function getCartProducts() {
		if (!hasLoadedOnce.current) setLoading(true);
		try {
			const responses = await Promise.all(cart.map((item) => instance.get(`/product/product/${item.id}`)));
			const updated = responses.map((res, index) => ({ ...res.data, quantity: cart[index].quantity }));
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

	const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

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
					<img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" className="empty-cart-icon" />
					<h2>Your cart is empty 🛒</h2>
					<p>Looks like you haven’t added anything yet.</p>
					<NavLink to="/allproducts"><button className="explore-btn">Explore Our Products</button></NavLink>
				</div>
			</div>
		);
	}

	return (
		<div className="cart-container">
			<div className="cart-left">
				<h2 className="cart-title">Your Shopping Cart</h2>
				{cartItems.map((item) => (
					<div key={item._id} className="cart-item">
						<div className="cart-item-img"><img src={item.image} alt={item.name} /></div>
						<div className="cart-item-info">
							<h3>{item.name}</h3>
							<p className="price">₹{item.price}</p>
							<div className="quantity-control">
								<button onClick={() => handleQuantityChange(item._id, -1)}>−</button>
								<span>{item.quantity}</span>
								<button onClick={() => handleQuantityChange(item._id, +1)}>+</button>
							</div>
						</div>
						<button className="delete-btn" onClick={() => handleDelete(item._id)}>✕</button>
					</div>
				))}
			</div>

			<div className="cart-right">
				<div className="summary-card">
					<h2>Order Summary</h2>
					<div className="summary-item"><span>Items:</span><span>{cartItems.length}</span></div>
					<div className="summary-item total"><span>Total:</span><span>₹{totalAmount.toLocaleString("en-IN")}</span></div>
					<NavLink to="/checkout"><button className="checkout-btn">Proceed to Checkout</button></NavLink>
				</div>
			</div>
		</div>
	);
}

export default Cart;
