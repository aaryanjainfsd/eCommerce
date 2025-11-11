import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartProvider";
import { useAuth } from "../contexts/AuthProvider";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import "../../assets/css/header.css";

export default function Header() {
	const { cart } = useCart();
	const { loggedInStatus, logout, userData } = useAuth();
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	const name = userData?.name
		? userData.name.split(" ")[0].charAt(0).toUpperCase() +
		  userData.name.split(" ")[0].slice(1)
		: "User";

	return (
		<header className="shopy-header">
			<div className="shopy-container">
				{/* Left Nav */}
				<nav className={`shopy-nav-left ${menuOpen ? "open" : ""}`}>
					<NavLink to="/allproducts" onClick={() => setMenuOpen(false)}>Products</NavLink>
					<NavLink to="/aboutus" onClick={() => setMenuOpen(false)}>About Us</NavLink>
					<NavLink to="/contactus" onClick={() => setMenuOpen(false)}>Contact Us</NavLink>
					<NavLink to="/checkout" onClick={() => setMenuOpen(false)}>Checkout</NavLink>
				</nav>

				{/* Center Logo */}
				<div className="shopy-logo">
					<NavLink to="/">ReactEcom</NavLink>
				</div>

				{/* Right Icons */}
				<div className="shopy-icons">
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
					<div
						className="profile-dropdown"
						onMouseEnter={() => setDropdownOpen(true)}
						onMouseLeave={() => setDropdownOpen(false)}
					>
						<button title="Account" className="profile-button">
							<User size={20} />
							{loggedInStatus && (
								<span className="username">Hi, {name}</span>
							)}
						</button>

						{dropdownOpen && (
							<div className="dropdown-menu">
								{loggedInStatus ? (
									<>
										<NavLink to="/profile">My Profile</NavLink>
										<button onClick={logout}>Logout</button>
									</>
								) : (
									<>
										<NavLink to="/login">Login</NavLink>
										<NavLink to="/register">Register</NavLink>
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
