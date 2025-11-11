import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartProvider";
import instance from "../routes/axiosConfig";
import { NavLink, useNavigate } from "react-router-dom";
import "../../assets/css/cart.css";

function Cart() {
	const { cart, setCart } = useCart();
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		if (cart.length > 0) {
			getCartProducts();
		} else {
			setCartItems([]);
		}
	}, [cart]);

	async function getCartProducts() {
		try {
			const responses = await Promise.all(
				cart.map((item) => instance.get(`/product/product/${item.id}`))
			);

			const updated = responses.map((res, index) => ({
				...res.data,
				quantity: cart[index].quantity,
			}));

			setCartItems(updated);
		} catch (error) {
			console.error("Error fetching cart products:", error);
		}
	}

	function handleQuantityChange(id, change) {
		setCart((prev) =>
			prev
				.map((item) =>
                {
                    if(item.id === id)
                    {
                        const newQuantity = item.quantity + change;
                        if(newQuantity <= 0)
                        {
                            return null
                        }
                        else{
                           return { ...item, quantity: newQuantity }  
                        }
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
		(sum, item) => sum + (item.price || 0) * (item.quantity || 1),
		0
	);

	return (
		<div className="cart-container">
			{/* LEFT SIDE - CART ITEMS */}
			<div className="left">
				{cartItems.length === 0 ? (
					<p className="empty-cart">Your cart is empty 🛒</p>
				) : (
					cartItems.map((item) => (
						<div key={item._id} className="cartItem">
							<div className="img">
								<img src={item.image} alt={item.name} />
							</div>

							<div className="content">
								<h3>{item.name}</h3>
								<p className="price">₹{item.price}</p>

								<div className="quantity-control">
									<button
										onClick={() => handleQuantityChange(item._id, -1)}
										className="qty-btn"
									>
										−
									</button>
									<span>{item.quantity}</span>
									<button
										onClick={() => handleQuantityChange(item._id, +1)}
										className="qty-btn"
									>
										+
									</button>
								</div>
							</div>

							<button
								className="delete-btn"
								onClick={() => handleDelete(item._id)}
							>
								✕
							</button>
						</div>
					))
				)}
			</div>

			{/* RIGHT SIDE - ORDER SUMMARY */}
			<div className="right">
				<h2>Order Summary</h2>

				<div className="summary-item">
					<span>Items:</span>
					<span>{cartItems.length}</span>
				</div>

				<div className="summary-item total">
					<span>Total:</span>
					<span>₹{totalAmount.toLocaleString("en-IN")}</span>
				</div>

				<NavLink to="/checkout" className="checkout-link">
					<button className="checkout-btn">Proceed to Checkout</button>
				</NavLink>
			</div>
		</div>
	);
}

export default Cart;
