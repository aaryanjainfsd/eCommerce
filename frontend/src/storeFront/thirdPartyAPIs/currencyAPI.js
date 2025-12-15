export async function fetchRates() {
	try {
		const response = await fetch(
			"https://v6.exchangerate-api.com/v6/4a8c8afdc155462392777883/latest/USD"
		);

		if (response.ok)
        {
            const data = await response.json();
            return data.conversion_rates;
        }
        else
        {        
            throw new Error("Failed to fetch exchange rates");
        }

	} catch (error) {
		console.error("Error fetching currency rates:", error);
		return null;
	}
}
