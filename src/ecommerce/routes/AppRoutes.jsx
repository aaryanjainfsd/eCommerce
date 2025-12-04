// Import Libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import custom files
import Home from "../pages/Home";
import Dice from "../pages/Dice";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import AboutUs from "../pages/AboutUs";
import Checkout from "../pages/Checkout";
import Register from "../pages/Register";
import AllProducts from "../pages/AllProducts";
import ProductDetails from "../pages/ProductDetails";
import OutletComponent from "../components/OutletComponent";
import ProtectedRoute from "../routes/ProtectedRoute";

// Contexts

import FirebaseProvider from "../contexts/FirebaseProvider";
import CartProvider from "../contexts/CartProvider";
import AuthProvider from "../contexts/AuthProvider";
import CurrencyProvider from "../contexts/CurrencyProvider";

const router = createBrowserRouter([
    {
        path: "/",
        element: <OutletComponent />,
        children: [
            { index: true, element: <Home /> },
            { path: "/allproducts", element: <AllProducts /> },
            { path: "/product-details/:id", element: <ProductDetails /> },
            { path: "/aboutus", element: <AboutUs /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/cart", element: <Cart /> },
            { path: "/dice", element: <Dice /> },
            { path: "/checkout", element: (<ProtectedRoute> <Checkout/> </ProtectedRoute>)},
        ],
    },
]);

function AppRoutes() {
    return (
        <FirebaseProvider>
            <CurrencyProvider>
                <AuthProvider>
                    <CartProvider>
                        <RouterProvider router={router} />
                    </CartProvider>
                </AuthProvider>
            </CurrencyProvider>
        </FirebaseProvider>
    );
}

export default AppRoutes;
