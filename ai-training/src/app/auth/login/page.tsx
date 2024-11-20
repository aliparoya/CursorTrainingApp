'use client'

import { Auth } from '@supabase/auth-ui-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboards')
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/dashboards`}
          view="sign_in"
        />
      </div>
    </div>
  )
} 