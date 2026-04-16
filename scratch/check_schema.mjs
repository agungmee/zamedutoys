import { createClient } from './lib/supabase/server.js';

async function checkData() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .limit(1);
    
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkData();
