'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  console.log(error);

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signupGoogle(origin: any) {
  const supabase = createClient()
  // const origin = event.origin;

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // const dataLogin = {
  //   email: formData.get('email') as string,
  //   password: formData.get('password') as string,
  // }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      skipBrowserRedirect: true
    },
  })
  
  console.log(data);
  console.log(error);

  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }

  if (error) {
    redirect('/error')
  }
}

export async function handleSignInWithGoogle(response:any) {

  console.log(response);

  // const { data, error } = await supabase.auth.signInWithIdToken({
  //   provider: 'google',
  //   token: response.credential,
  // })
}