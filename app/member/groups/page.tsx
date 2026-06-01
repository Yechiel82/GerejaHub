import { MemberShell } from '../member-shell'
import { requireMemberUser } from '@/lib/supabase/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { GroupCard } from './group-card'

export default async function MemberGroupsPage() {
  const { user, profile } = await requireMemberUser()
  const supabase = await createSupabaseServerClient()

  // Get all published small groups
  const { data: groups } = await supabase
    .from('small_groups')
    .select('*')
    .eq('published', true)
    .order('name', { ascending: true })

  // Get user's group memberships
  const { data: userMemberships } = await supabase
    .from('small_group_members')
    .select('group_id')
    .eq('user_id', user.id)

  // Get member counts for each group
  const { data: memberCounts } = await supabase
    .from('small_group_members')
    .select('group_id')

  // Create maps
  const membershipSet = new Set(
    (userMemberships as any)?.map((m: any) => m.group_id) || []
  )

  const countMap = new Map()
  ;(memberCounts as any)?.forEach((m: any) => {
    countMap.set(m.group_id, (countMap.get(m.group_id) || 0) + 1)
  })

  // Transform data
  const groupsWithStatus = (groups as any)?.map((group: any) => ({
    ...group,
    isMember: membershipSet.has(group.id),
    memberCount: countMap.get(group.id) || 0,
    isFull: countMap.get(group.id) >= group.max_members
  })) || []

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Small Groups</p>
        <h1>Find Your Community</h1>
        <p>Join a small group to build deeper relationships and grow in faith together.</p>
      </div>

      <div className="groups-grid">
        {groupsWithStatus.length > 0 ? (
          groupsWithStatus.map((group: any) => (
            <GroupCard
              key={group.id}
              group={group}
              isMember={group.isMember}
              memberCount={group.memberCount}
              isFull={group.isFull}
            />
          ))
        ) : (
          <p>No small groups available yet.</p>
        )}
      </div>
    </MemberShell>
  )
}

// Made with Bob