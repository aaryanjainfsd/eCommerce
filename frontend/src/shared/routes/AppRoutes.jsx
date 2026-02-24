// ==================== REACT & ROUTING ====================
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// ==================== STOREFRONT PAGES ====================
import Home from "../../storeFront/pages/Home";
import Cart from "../../storeFront/pages/Cart";
import Login from "../../storeFront/pages/Login";
import AboutUs from "../../storeFront/pages/AboutUs";
import Checkout from "../../storeFront/pages/Checkout";
import Register from "../../storeFront/pages/Register";
import AllProducts from "../../storeFront/pages/AllProducts";
import ProductDetails from "../../storeFront/pages/ProductDetails";
import Dice from "../../storeFront/pages/DiceGame";
import ItemShiftTask from "../../storeFront/pages/ItemShiftTask";

// ==================== STOREFRONT COMPONENTS ====================
import OutletComponent from "../../storeFront/components/OutletComponent";

// ==================== ADMIN PAGES ====================
import AdminLogin from "../../adminPanel/pages/AdminLogin";

// ==================== ADMIN COMPONENTS ====================
import AdminOutlet from "../../adminPanel/components/AdminOutlet";

// ==================== ROUTE PROTECTION ====================
import ProtectedRoute from "./ProtectedRoute";

// ==================== CONTEXT PROVIDERS ====================
import FirebaseProvider from "../../storeFront/contexts/FirebaseProvider";
import CartProvider from "../../storeFront/contexts/CartProvider";
import CurrencyProvider from "../../storeFront/contexts/CurrencyProvider";



const storeFrontChildren = [
    { index : true, element: <Home /> },
    { path: "/cart", element: <Cart /> },
    { path: "/login", element: <Login /> },
    { path: "/aboutus", element: <AboutUs /> },
    { path: "/register", element: <Register /> },
    { path: "/allproducts", element: <AllProducts /> },
    { path: "/product-details/:id", element: <ProductDetails /> },
    { path: "/checkout", element: (<ProtectedRoute> <Checkout/> </ProtectedRoute>)},
];

const adminChildren = [
    { index: true, element: <AdminLogin />},
    // { path: "login", element: <AdminLogin /> },

];

const router = createBrowserRouter([
    // ================= STORE FRONT =================
    {
        path: "/",
        element: <OutletComponent />,
        children: storeFrontChildren,
    },
    // ================= ADMIN PANEL =================
	{
		path: "/admin",
		element: <AdminOutlet />,
		children:  adminChildren
	},


]);

function AppRoutes() {
    return (
        <FirebaseProvider>
            <CurrencyProvider>
                    <CartProvider>
                        <RouterProvider router={router} />
                    </CartProvider>
            </CurrencyProvider>
        </FirebaseProvider>
    );
}

export default AppRoutes;
