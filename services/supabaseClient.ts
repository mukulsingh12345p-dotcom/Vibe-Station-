import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rhxkyxkexpukppcuwzwk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__LMRWXByAgqoa0gALKu3ag_JpirIjOe';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);