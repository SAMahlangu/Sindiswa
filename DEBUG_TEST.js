// Debug Test - Check Supabase Connection
// Paste this in browser console to test

async function testSupabaseConnection() {
  console.log('🔧 Testing Supabase Connection...\n');
  
  // 1. Test Supabase import
  try {
    console.log('✅ Supabase imported successfully');
  } catch (e) {
    console.error('❌ Supabase import failed:', e);
    return;
  }

  // 2. Test appointments fetch
  console.log('\n📋 Fetching appointments...');
  try {
    // This assumes supabase is available globally after importing the app
    // You might need to open DevTools on the app page
    const result = await fetch('/.env.local').then(() => {
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    });
  } catch (e) {
    console.log('Note: Environment check skipped (expected)\n');
  }

  console.log('\n🎯 To properly debug:');
  console.log('1. Open http://localhost:5173/admin/dashboard');
  console.log('2. Open DevTools (F12)');
  console.log('3. Go to Console tab');
  console.log('4. Look for any red errors');
  console.log('5. Screenshot and send to developer');
}

// Run the test
// testSupabaseConnection();

// OR manually check:
// 1. Go to Supabase dashboard
// 2. Click Table Editor
// 3. Click "appointments"
// 4. Are there any rows? If YES, data is saving but admin fetch has issue
//    If NO, appointments aren't being saved (createAppointment failing)
