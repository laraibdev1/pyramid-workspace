import { cookies } from 'next/headers'
import WorkspaceApp from '@/components/workspace-app'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const store = await cookies()
  const authenticated = Boolean(store.get('pyramid_guest')?.value)
  return <WorkspaceApp initialAuthenticated={authenticated} />
}
