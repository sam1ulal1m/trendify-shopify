export async function getOrderedProducts(shop, token) {
    try {
      const query = `{
        orders(first: 100) {
          nodes {
            lineItems(first: 100) {
              nodes {
                name
                product {
                  handle
                  category {
                    name
                  }
                }
              }
            }
            shippingAddress {
              address1
              address2
              city
              country
            }
          }
        }
      }`;
  
      const response = await fetch(`https://${shop}/admin/api/2024-10/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({ query })
      });
  
      if (!response.ok) {
        // Handle non-2xx HTTP responses
        console.error('Network response was not ok:', response.statusText);
        return { error: `Network error: ${response.statusText}` };
      }
  
      try {
        const data = await response.json();
        if (data.errors) {
          // Handle GraphQL errors
          console.error('GraphQL errors:', data.errors);
          return { error: 'GraphQL error occurred', details: data.errors };
        }
        console.log('Data received:', data);
        return data;
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        return { error: 'JSON parsing error' };
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { error: 'Error fetching orders', details: error.message };
    }
  }
  