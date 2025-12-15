// src/ecommerce/contexts/CurrencyProvider.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { fetchRates } from "../thirdPartyAPIs/currencyAPI";

const CurrencyContext = createContext();

function CurrencyProvider({ children }) {

	// 🔥🔥 LocalStorage se last selected currency load karega
	const [currency, setCurrency] = useState(
		localStorage.getItem("currency") || "USD" // 🔥🔥
	);

	const [rates, setRates] = useState({});
	const [loading, setLoading] = useState(true);

	// 🔥🔥 Save currency whenever it changes
	useEffect(() => {
		localStorage.setItem("currency", currency);
	}, [currency]); // 🔥🔥

	// Load exchange rates once
	useEffect(() => {
		async function loadRates() {
			setLoading(true);
			const data = await fetchRates();
			if (data) {
				setRates(data);
			}
			setLoading(false);
		}
		loadRates();
	}, []);

	// Convert using selected currency
	function convert(amount) {
		if (!rates || !rates[currency]) return amount;
		return amount * rates[currency];
	}

	// 🔥🔥 Currency List (all currencies from API)
	const currencyList = Object.keys(rates); // 🔥🔥

	const value = { 
		currency, 
		setCurrency, 
		rates, 
		loading, 
		convert, 
		currencyList // 🔥🔥
	};

	return (
		<CurrencyContext.Provider value={value}>
			{children}
		</CurrencyContext.Provider>
	);
}

export function useCurrency() {
	return useContext(CurrencyContext);
}

export default CurrencyProvider;
