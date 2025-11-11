// Import Libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import custom files
import Home from "../pages/Home";
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
import CartProvider from "../contexts/CartProvider";
import AuthProvider from "../contexts/AuthProvider";

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
            { path: "/checkout", element: (<ProtectedRoute> <Checkout/> </ProtectedRoute>)},
        ],
    },
]);

function AppRoutes() {
    return (
        <AuthProvider>
            <CartProvider>
                <RouterProvider router={router} />
            </CartProvider>
        </AuthProvider>
    );
}

export default AppRoutes;
