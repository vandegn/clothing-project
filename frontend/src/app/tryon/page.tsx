import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import TryOnContent from './TryOnContent'

export default async function TryOnPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <TryOnContent user={user} />
}
