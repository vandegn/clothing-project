import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import TryOnContent from './TryOnContent'

interface TryOnPageProps {
  searchParams: Promise<{ payment?: string }>
}

export default async function TryOnPage({ searchParams }: TryOnPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  return <TryOnContent user={user} paymentStatus={params.payment} />
}
