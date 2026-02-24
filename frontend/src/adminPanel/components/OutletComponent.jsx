import { Outlet } from "react-router-dom";

import Header from "./Header.jsx";
import Header from "./Footer.jsx";


export default function OutletComponent()
{
    return (        
        <>
            <Header/>
            <Outlet/>       
            <Footer/>
        </>
    );
}
