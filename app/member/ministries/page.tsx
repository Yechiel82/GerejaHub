import { MemberShell } from '../member-shell'
import { requireMemberUser } from '@/lib/supabase/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { MinistryCard } from './ministry-card'

export default async function MemberMinistriesPage() {
  const { user, profile } = await requireMemberUser()
  const supabase = await createSupabaseServerClient()

  // Get all published ministries
  const { data: ministries } = await supabase
    .from('ministries')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  // Get user's ministry memberships
  const { data: userMemberships } = await supabase
    .from('ministry_members')
    .select('ministry_id, role')
    .eq('user_id', user.id)

  // Create a map of user's memberships
  const membershipMap = new Map(
    (userMemberships as any)?.map((m: any) => [m.ministry_id, m.role]) || []
  )

  // Transform data to include membership status
  const ministriesWithMembership = (ministries as any)?.map((ministry: any) => ({
    ...ministry,
    isMember: membershipMap.has(ministry.id),
    memberRole: membershipMap.get(ministry.id) || null
  })) || []

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Ministries</p>
        <h1>Church Ministries</h1>
        <p>Explore ministries and join the ones that interest you.</p>
      </div>

      <div className="ministry-grid-member">
        {ministriesWithMembership.length > 0 ? (
          ministriesWithMembership.map((ministry: any) => (
            <MinistryCard
              key={ministry.id}
              ministry={ministry}
              isMember={ministry.isMember}
              memberRole={ministry.memberRole}
            />
          ))
        ) : (
          <p>No ministries available yet.</p>
        )}
      </div>
    </MemberShell>
  )
}

// Made with Bob
