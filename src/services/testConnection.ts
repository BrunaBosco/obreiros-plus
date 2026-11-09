import { supabase } from './supabase'

export async function testSupabaseConnection() {
  const { error } = await supabase
    .from('teste_conexao')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Erro na conexão com Supabase:', error.message)
    return false
  }

  console.log('Conexão com Supabase realizada!')
  return true
}