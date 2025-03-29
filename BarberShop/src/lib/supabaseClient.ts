import { createClient } from '@supabase/supabase-js'

// Substitua pelos dados reais do seu projeto
const supabaseUrl = 'https://cndmxthiomogihufcmwp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZG14dGhpb21vZ2lodWZjbXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODE5MzUsImV4cCI6MjA1ODY1NzkzNX0.CuKUHmZeyjM6dfKXGHUVtBDUwSwaRZAjotv9cV4VHoI'

export const supabase = createClient(supabaseUrl, supabaseKey)
