
/* WGWLAD SUPABASE CONFIGURATION */

const SUPABASE_URL =
    "https://fnoamkvpxzgnmoyfljpx.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_i3SQexog5LBHYWbflQDO6Q_MxIa-g45";

window.db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
