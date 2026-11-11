
import { supabase } from './supabase'

export type AccessRole = 'adm' | 'pastor_setorial' | 'livre'

export interface AccessProfile {
  id: string
  username: string
  role: AccessRole
  active: boolean
}

export async function signIn(
  username: string,
  password: string,
) {
  const email = `${username.trim().toLowerCase()}@obreirosplus.invalid`

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    throw new Error('Login ou senha incorretos.')
  }

  const { data: profile, error: profileError } = await supabase
    .from('perfis_acesso')
    .select('id, username, role, active')
    .eq('id', data.user.id)
    .single()

  if (profileError || !profile || !profile.active) {
    await supabase.auth.signOut()
    throw new Error('Usuário não encontrado ou desativado.')
  }

  return profile as AccessProfile
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}


export async function getCurrentProfile(): Promise<AccessProfile | null> {
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('perfis_acesso')
    .select('id, username, role, active')
    .eq('id', data.session.user.id)
    .single()

  if (error || !profile || !profile.active) {
    await supabase.auth.signOut()
    return null
  }

  return profile as AccessProfile
}

