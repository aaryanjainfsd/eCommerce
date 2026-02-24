import "../../assets/css/cart.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import useCartStore from "../stores/cartStore";
import instance from "../../shared/config/axiosConfig";
import { useCurrency } from "../contexts/CurrencyProvider";

function Cart() {
    // ================= ZUSTAND STATE =================
    const cart = useCartStore((state) => state.cart);
    const increaseQty = useCartStore((state) => state.increaseQty);
	const decreaseQty = useCartStore((state) => state.decreaseQty);
	const setQty = useCartStore((state) => state.setQty);
	const removeFromCart = useCartStore((state) => state.removeFromCart);

    // ================= LOCAL STATE =================
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const hasLoadedOnce = useRef(false);

    const { convert, currency } = useCurrency();
    
    useEffect(() =>{
        if (cart.length > 0) {
            getCartProducts();
        }
        else{
            setCartItems([]);
        }
    }, [cart]);

    
    async function getCartProducts() {
        if (!hasLoadedOnce.current) {
			setLoading(true);
		}
        try{
            const responses = await Promise.all(
				cart.map(function (item) {
					return instance.get(`products/get/${item.id}`);
				})
			);

            const updated = responses.map( function (res, index) {
                return {
                    ...res.data,
                    quantity: cart[index].quantity,
                };
            });
            setCartItems(updated);
            hasLoadedOnce.current = true;
        }
        catch (error)
        {
            console.error("Error fetching cart products:", error);
        }
        finally
        {
            setLoading(false);
        }

    }




    function handleQuantityChange(productId, newQty) {
        if (newQty >= 1) {
            setQty(productId, newQty);
        }
        else {
            setQty(productId, 1);
        }
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

    cartItems.map((item) => console.log(item));

    
    return (
        <div className="cart-wrapper-new">
            <div className="cart-left-new">
                <h2 className="cart-heading-new">
                    <i className="ri-shopping-bag-3-line"></i> My Cart
                </h2>

                {cartItems.map((item) => {
                    return (
                        <div className="row-item" key={item.product._id}>
                            <div className="left-product-info">
                                <img src={item.product.image} className="prod-img" alt={item.product.name} />

                                <div className="prod-details">
                                    <h3 className="prod-title"> {item.product.name} </h3>
                                    <p className="prod-meta"> Price: {currency}{" "} {item.product.discountedPrice} </p>
                                    <p className="prod-meta">In Stock</p>
                                    <div className="small-actions"> <span onClick={() => handleDelete(item._id)} > Remove </span> </div>
                                </div>
                            </div>

                            <div className="each-price"> {currency}{" "} {item.product.discountedPrice} </div>

                            <div className="qty-select-box">
                                <select value={item.quantity} onChange={(e) => { handleQuantityChange( item.product._id, Number(e.target.value) ); }} >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((q) => {
                                        return (
                                            <option key={q} value={q}>
                                                {q}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="total-price">
                                {currency}{" "}
                                {(
                                    convert(item.product.discountedPrice) *
                                    item.quantity
                                ).toLocaleString("en-IN")}
                            </div>
                        </div>
                    );
                })}

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
                        <span>
                            {currency}{" "}
                            {/* {totalAmount.toLocaleString("en-IN")} */}
                        </span>
                    </div>

                    <button className="checkout-button">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );

}

export default Cart;
