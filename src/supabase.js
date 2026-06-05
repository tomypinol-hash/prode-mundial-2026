import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ylozzgfnwrodohxeqcwj.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZqqOj5fMILk7XvbJeoZxVA_l-pJSfZD'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)