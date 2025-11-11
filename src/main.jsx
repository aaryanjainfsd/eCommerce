
// Import Library
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { StrictMode } from 'react'

// Import Files
// import './index.css'
import './assets/css/main.css'

import AppRoutes from "./ecommerce/routes/AppRoutes";

{/* <RouterProvider router={AppRoutes} /> */}

createRoot(document.getElementById('root')).render(<AppRoutes />);
