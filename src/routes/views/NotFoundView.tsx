import { useNavigate } from '@tanstack/react-router'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { PageContainer } from '@/components/shared/PageContainer'

export default function NotFoundView() {
  const navigate = useNavigate()

  return (
    <PageContainer className="py-16">
      <EmptyStateCard
        icon="home"
        title="404 — We couldn’t find that roof"
        description="The page or listing address you visited does not exist. Explore verified apartments, duplexes, and land across Ogun and Lagos."
        actionLabel="Return to Explore"
        onAction={() => navigate({ to: '/' })}
      />
    </PageContainer>
  )
}

