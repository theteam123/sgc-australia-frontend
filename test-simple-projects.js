// Simple test to get basic project data without complex mapping
async function testSimpleProjects() {
  try {
    const response = await fetch('/api/resource/Project?limit=5', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Simple project test result:', data);
    console.log('Number of projects:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('First project raw data:', data.data[0]);
    }
    
    return data;
  } catch (error) {
    console.error('Simple project test failed:', error);
    throw error;
  }
}

// Test it
testSimpleProjects();
