import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard'

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
      }

      if (data.user) {
        const supabaseAdmin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        )

        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (!existingProfile) {
          const { error: profileError } = await supabaseAdmin.from('profiles').insert({
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
            avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          if (profileError) {
            console.error('Profile insert error:', profileError)
          }
        }

        const { error: sessionError } = await supabaseAdmin.from('user_sessions').insert({
          user_id: data.user.id,
          provider: data.user.app_metadata?.provider || 'google',
          logged_in_at: new Date().toISOString()
        })
        if (sessionError) {
          console.error('Session insert error:', sessionError)
        }

        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('Callback error:', err)
      return NextResponse.redirect(`${origin}/login?error=callback_failed`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
