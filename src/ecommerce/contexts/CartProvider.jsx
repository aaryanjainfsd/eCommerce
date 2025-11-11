import { createContext, useContext, useState } from "react";

const cartContext = createContext();

function CartProvider({ children }) {
    const [cart, setCart] = useState(
        localStorage.getItem("storedCart") !== null
            ? JSON.parse(localStorage.getItem("storedCart"))
            : []
    );
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
