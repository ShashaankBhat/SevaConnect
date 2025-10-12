// Simple functionality test
export const testFunctionality = async () => {
  console.log('🧪 Testing functionality...');
  
  try {
    // Test backend connection
    const health = await fetch('http://localhost:5000/api/health');
    console.log(health.ok ? '✅ Backend is running' : '❌ Backend not responding');
    
    // Test NGOs endpoint
    const ngos = await fetch('http://localhost:5000/api/search/ngos');
    if (ngos.ok) {
      const data = await ngos.json();
      console.log(`✅ NGOs: ${data.ngos?.length || 0} found`);
    } else {
      console.log('❌ NGOs endpoint failed');
    }
    
  } catch (error) {
    console.log('❌ Test failed - backend might be offline');
  }
};
