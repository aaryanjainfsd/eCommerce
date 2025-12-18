// Import Library
import { createRoot } from 'react-dom/client'

// Import Files
import './assets/css/main.css'
import AppRoutes from "./storeFront/routes/AppRoutes";

// Render Application
createRoot(document.getElementById('root')).render(<AppRoutes />);
