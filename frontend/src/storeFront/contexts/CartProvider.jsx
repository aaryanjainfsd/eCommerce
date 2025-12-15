import { createContext, useContext, useEffect, useState } from "react";

const cartContext = createContext();

function CartProvider({ children }) {
	const [cart, setCart] = useState(() => 
    {
		try {
			const stored = localStorage.getItem("storedCart");
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error("Error parsing stored cart:", error);
			return [];
		}
	});

	// ✅ Save cart to localStorage whenever it changes
	useEffect(() => 
    {
		try {
			localStorage.setItem("storedCart", JSON.stringify(cart));
		} catch (error) {
			console.error("Error saving cart:", error);
		}
	}, [cart]);

	return (
		<cartContext.Provider value={{ cart, setCart }}>
			{children}
		</cartContext.Provider>
	);
}

export function useCart() {
	return useContext(cartContext);
}

export default CartProvider;
