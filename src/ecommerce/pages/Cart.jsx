import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartProvider";
import instance from "../routes/axiosConfig";
import { NavLink, useNavigate } from "react-router-dom";
import "../../assets/css/Cart.css";

function Cart() {
	const { cart } = useCart();
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		getCartProducts(cart);
	}, [cart]);

	async function getCartProducts(cart) {
		const promises = cart.map((obj) => {
			return instance.get("/product/product/" + obj.id);
		});
		let temp = await Promise.all(promises);
		setCartItems(temp.map((obj) => obj.data));
	}

	function handleQuantityChange(id, change) {
		setCartItems((prev) =>
			prev.map((item) =>
				item._id === id
					? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
					: item
			)
		);
	}

	function handleDelete(id) {
		setCartItems((prev) => prev.filter((item) => item._id !== id));
	}

	return (
		<div className="cart-container">
			<div className="left">
				{cartItems.map((obj) => {
					return (
						<div key={obj._id} className="cartItem">
							<div className="img">
								<img src={obj.image} alt={obj.name} />
							</div>

							<div className="content">
								<h3>{obj.name}</h3>
								<p className="price">₹{obj.price}</p>
								<div className="quantity-control">
									<button
										onClick={() => handleQuantityChange(obj._id, -1)}
										className="qty-btn"
									>
										−
									</button>
									<span>{obj.quantity || 1}</span>
									<button
										onClick={() => handleQuantityChange(obj._id, +1)}
										className="qty-btn"
									>
										+
									</button>
								</div>
							</div>

							<button className="delete-btn" onClick={() => handleDelete(obj._id)}>
								✕
							</button>
						</div>
					);
				})}
			</div>

			<div className="right">
				<h2>Order Summary</h2>
				<div className="summary-item">
					<span>Items:</span>
					<span>{cartItems.length}</span>
				</div>
				<div className="summary-item total">
					<span>Total:</span>
					<span>
						₹
						{cartItems
							.reduce(
								(total, item) =>
									total + (item.price || 0) * (item.quantity || 1),
								0
							)
							.toLocaleString("en-IN")}
					</span>
				</div>
				<NavLink to="/checkout" className="checkout-link">
					<button className="checkout-btn">Proceed to Checkout</button>
				</NavLink>
			</div>
		</div>
	);
}

export default Cart;
