// ==================== REACT & ROUTING ====================
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// ==================== STOREFRONT IMPORTS ====================
import OutletComponent from "../../storeFront/components/OutletComponent";

import Home from "../../storeFront/pages/Home";
import Cart from "../../storeFront/pages/Cart";
import Login from "../../storeFront/pages/Login";
import AboutUs from "../../storeFront/pages/AboutUs";
import Checkout from "../../storeFront/pages/Checkout";
import Register from "../../storeFront/pages/Register";
import AllProducts from "../../storeFront/pages/AllProducts";
import ProductDetails from "../../storeFront/pages/ProductDetails";


// ==================== ADMIN IMPORTS ====================
import AdminOutlet from "../../adminPanel/components/AdminOutlet";
import AdminLogin from "../../adminPanel/pages/AdminLogin";
import Dashboard from "../../adminPanel/pages/Dashboard";
import AdminProfile from "../../adminPanel/pages/AdminProfile";
import Products from "../../adminPanel/pages/Products";
import AddProduct from "../../adminPanel/pages/AddProduct";
import AddMorePhotos from "../../adminPanel/pages/AddMorePhotos";

// ==================== SUPER ADMIN IMPORTS ====================
import SuperAdminPanelOutlet from "../../superAdminPanel/components/SuperAdminPanelOutlet.jsx";

import SuperClients from "../../superAdminPanel/pages/AddClients.jsx";
import SuperAdminLogin from "../../superAdminPanel/pages/Login.jsx";


// ==================== PROTECTED ROUTES ====================
import UserProtectedRoute from "./protectedRoutes/UserProtectedRoute";
import AdminProtectedRoute from "./protectedRoutes/AdminProtectedRoute";
import SuperAdminProtectedRoute from "./protectedRoutes/SuperAdminProtectedRoute";

// ==================== CONTEXT PROVIDERS ====================
import FirebaseProvider from "../../storeFront/contexts/FirebaseProvider";
import CurrencyProvider from "../../storeFront/contexts/CurrencyProvider";


const storeFrontChildren = [ 
    { index : true, element: <Home /> },
    { path: "cart", element: <Cart /> },
    { path: "login", element: <Login /> },
    { path: "aboutus", element: <AboutUs /> },
    { path: "register", element: <Register /> },
    { path: "allproducts", element: <AllProducts /> },
    { path: "product-details/:id", element: <ProductDetails /> },
    { path: "checkout", element: (<UserProtectedRoute> <Checkout/> </UserProtectedRoute>)},
];

const adminChildren = [
    { index: true, element: <AdminLogin />},
    { path: "dashboard", element: ( <AdminProtectedRoute> <Dashboard /> </AdminProtectedRoute>),},
    { path: "profile", element: ( <AdminProtectedRoute> <AdminProfile /> </AdminProtectedRoute>),},
    { path: "products", element: ( <AdminProtectedRoute> <Products /> </AdminProtectedRoute>),},
    { path: "products/add", element: ( <AdminProtectedRoute> <AddProduct /> </AdminProtectedRoute>),},
    { path: "products/:productId/photos", element: ( <AdminProtectedRoute> <AddMorePhotos /> </AdminProtectedRoute>),},
];

const superAdminPanelChildren = [
    { index: true, element: <SuperAdminLogin />},
    { path: "clients", element: (<SuperAdminProtectedRoute> <SuperClients /> </SuperAdminProtectedRoute>)},
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
        path: "/adminPanel",
		element: <AdminOutlet />,
		children:  adminChildren
	},
    // ================= SUPER ADMIN PANEL =================
    {
        path: "/superAdminPanel",
        element: <SuperAdminPanelOutlet />,
        children:  superAdminPanelChildren
    }
]);

function AppRoutes() {
    return (
        <FirebaseProvider>
            <CurrencyProvider>
                        <RouterProvider router={router} />
            </CurrencyProvider>
        </FirebaseProvider>
    );
}

export default AppRoutes;
