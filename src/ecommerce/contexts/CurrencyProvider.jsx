import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

function CurrencyProvider() 
{
    const[] = useState(() => { localStorage.getItem("currency") || "INR" });

    const[rates, setRates] = useState({});
    const[loading, setLoading] = useState(true);

    
}

export default CurrencyProvider;
