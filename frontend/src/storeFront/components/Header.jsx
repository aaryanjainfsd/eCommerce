import { useEffect, useState } from "react";
import "../../assets/css/header.css";
import { useAuth } from "../contexts/AuthProvider";
import { useCart } from "../contexts/CartProvider";
import { useFirebase } from "../contexts/FirebaseProvider";
import { useCurrency } from "../contexts/CurrencyProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";

import { getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase.js";

const db = getDatabase(app);

export default function Header() {
            const { currentUser, isLoggedIn, logout } = useFirebase();
    const checkClicks = () => {
        set(ref(db, "users/clicks"), {
            userIPAddress: "198:196:197:198",
            clickLocation: "headerLogo",
        });
    };

    const { cart } = useCart();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { currency, setCurrency, rates, setRates, currencyList } = useCurrency();

    const name = currentUser
        ? currentUser.displayName
            ? currentUser.displayName.split(" ")[0].charAt(0).toUpperCase() +
              currentUser.displayName.split(" ")[0].slice(1)
            : currentUser.email
        : "User";

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    return (
        <header className="shopy-header">
            <div className="shopy-container">
                {/* Left Nav */}
                <nav className={`shopy-nav-left ${menuOpen ? "open" : ""}`}>
                    <NavLink
                        to="/allproducts"
                        onClick={() => setMenuOpen(false)}
                    >
                        Products
                    </NavLink>
                    <NavLink to="/aboutus" onClick={() => setMenuOpen(false)}>
                        About Us
                    </NavLink>
                    <NavLink to="/contactus" onClick={() => setMenuOpen(false)}>
                        Contact Us
                    </NavLink>
                    <NavLink to="/checkout" onClick={() => setMenuOpen(false)}>
                        Checkout
                    </NavLink>
                </nav>

                {/* Center Logo */}
                <div className="shopy-logo">
                    <NavLink to="/" onClick={checkClicks}>
                        ReactEcom
                    </NavLink>
                </div>

                {/* Right Icons */}
                <div className="shopy-icons">
                    {/* ✅ Currency Dropdown */}
                    <div className="currency-selector">
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            {currencyList.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <NavLink title="Wishlist" to="/wishlist">
                        <Heart size={20} />
                    </NavLink>

                    <NavLink title="Cart" to="/cart" className="cart-icon">
                        <ShoppingBag size={20} />
                        {cart.length > 0 && (
                            <span className="cart-count">{cart.length}</span>
                        )}
                    </NavLink>

                    {/* Profile Section */}
                    <div className="profile-dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)} >
                        <button title="Account" className="profile-button">
                            <User size={20} />
                            {isLoggedIn && (
                                <span className="username">Hi, {name}</span>
                            )}
                        </button>

                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                {isLoggedIn ? (
                                    <> 
                                        <NavLink to="/profile"> {" "} My Profile{" "} </NavLink>
                                        <button onClick={() => { logout(); navigate("/login"); }} > Logout </button>
                                    </>
                                ) : (
                                    <>
                                        <NavLink to="/login">Login</NavLink>
                                        <NavLink to="/register">
                                            Register
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button
                        className="menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
}
