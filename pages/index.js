export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🏠 Property Search</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <label style={{ display: 'block', margin: '10px 0 5px', fontWeight: 'bold' }}>City</label>
        <input type="text" id="city" placeholder="Enter city name" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', margin: '10px 0 5px', fontWeight: 'bold' }}>Min Price</label>
            <input type="number" id="minPrice" placeholder="Min price" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', margin: '10px 0 5px', fontWeight: 'bold' }}>Max Price</label>
            <input type="number" id="maxPrice" placeholder="Max price" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }} />
          </div>
        </div>
        
        <label style={{ display: 'block', margin: '10px 0 5px', fontWeight: 'bold' }}>Property Type</label>
        <select id="propertyType" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}>
          <option value="">All Types</option>
          <option value="Residential">Residential</option>
          <option value="Condo">Condo</option>
          <option value="Single Family">Single Family</option>
        </select>
        
        <button id="searchBtn" onClick="searchProperties()" style={{ width: '100%', background: '#007bff', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>Search Properties</button>
      </div>
      
      <div id="results"></div>
      <p id="error" style={{ color: 'red', textAlign: 'center' }}></p>

      <script dangerouslySetInnerHTML={{
        __html: `
          async function searchProperties() {
            const city = document.getElementById('city').value;
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;
            const propertyType = document.getElementById('propertyType').value;
            const btn = document.getElementById('searchBtn');
            const results = document.getElementById('results');
            const error = document.getElementById('error');
            
            btn.disabled = true;
            btn.textContent = 'Searching...';
            error.textContent = '';
            results.innerHTML = '';
            
            try {
              const params = new URLSearchParams();
              if (city) params.append('city', city);
              if (minPrice) params.append('minPrice', minPrice);
              if (maxPrice) params.append('maxPrice', maxPrice);
              if (propertyType) params.append('propertyType', propertyType);
              
              const response = await fetch('/api/search?' + params.toString());
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Search failed');
              }
              
              const listings = data.Listings || [];
              
              if (listings.length === 0) {
                results.innerHTML = '<p style="text-align: center;">No properties found.</p>';
                return;
              }
              
              results.innerHTML = listings.map(prop => '
                <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
                  <h3 style="margin: 0 0 10px 0;">' + (prop.UnparsedAddress || 'Address not available') + '</h3>
                  <p style="font-size: 20px; font-weight: bold; color: #007bff; margin: 10px 0;">' + (prop.ListPrice ? '$' + prop.ListPrice.toLocaleString() : 'Contact for price') + '</p>
                  <p style="margin: 5px 0;">' + (prop.BedroomsTotal || 0) + ' beds | ' + (prop.BathroomsTotal || 0) + ' baths | ' + (prop.LivingArea ? prop.LivingArea.toLocaleString() + ' sqft' : '') + '</p>
                  <p style="margin: 5px 0; color: #666;">' + (prop.PropertyType || '') + '</p>
                </div>
              ').join('');
              
            } catch (err) {
              error.textContent = 'Error: ' + err.message;
              console.error('Search error:', err);
            } finally {
              btn.disabled = false;
              btn.textContent = 'Search Properties';
            }
          }
        `
      }} />
    </div>
  );
}
