"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import SupabaseProvider from '@/app/supabase-provider'
import { useEffect, useState } from 'react'

export default function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createClientComponentClient())
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()
  }, [supabase])

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <SupabaseProvider session={session}>
        {children}
      </SupabaseProvider>
    </SessionContextProvider>
  )
} 