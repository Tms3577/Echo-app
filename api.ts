
const API_URL = 'https://api.echo-obsidian.io/v1'; // Simulated endpoint

/**
 * Standard API request utility for the Echo Obsidian web platform.
 * Handles JWT authorization via localStorage and provides a clean fetch wrapper.
 */
export const apiRequest = async (endpoint: string, method: string = 'GET', body: any = null) => {
  const token = localStorage.getItem('echo_token');
  
  const settings: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`,
      'X-Echo-Protocol': 'v4.2'
    }
  };

  if (body) {
    settings.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, settings);
    
    // In a real app, we'd handle 401 Unauthorized here to trigger logout
    if (response.status === 401) {
      console.error("Node session expired. Re-synchronization required.");
    }

    return await response.json();
  } catch (error) {
    console.error("Signal propagation failed:", error);
    throw error;
  }
};
