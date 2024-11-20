'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'

interface SupabaseContext {
  supabase: SupabaseClient<any, "public", any>
  session: any
}

const Context = createContext<SupabaseContext | null>(null)

export default function SupabaseProvider({ 
  children,
  session
}: { 
  children: React.ReactNode
  session: any
}) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
} 