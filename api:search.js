export default function handler(req, res) {
    const SPARK_API_TOKEN = process.env.SPARK_API_TOKEN;
    const { city, minPrice, maxPrice, propertyType } = req.query;
    
    fetch(`https://replication.sparkapi.com/v1/Listings?${new URLSearchParams({
        ...(city && { City: city }),
        ...(minPrice && { ListPrice: `gte:${minPrice}` }),
        ...(maxPrice && { ListPrice: `lte:${maxPrice}` }),
        ...(propertyType && { PropertyType: propertyType }),
        _page: '1',
        _limit: '20'
    })}`, {
        headers: {
            'Authorization': `Bearer ${SPARK_API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json({ message: error.message });
    });
}
