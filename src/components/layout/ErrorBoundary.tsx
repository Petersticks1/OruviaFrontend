import { Component, type ErrorInfo, type ReactNode } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { PropertyCardSkeleton } from '@/components/cards/PropertyCard'
import { PageContainer } from '@/components/shared/PageContainer'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Oruvia ErrorBoundary caught:', error, errorInfo)
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <PageContainer className="py-16">
          <EmptyStateCard
            icon="info"
            title="Something went wrong loading this view"
            description={this.state.errorMessage}
            actionLabel="Reload Oruvia"
            onAction={() => window.location.reload()}
          />
        </PageContainer>
      )
    }

    return this.props.children
  }
}

export function RoutePendingSkeleton() {
  return (
    <PageContainer className="py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, idx) => (
          <PropertyCardSkeleton key={idx} />
        ))}
      </div>
    </PageContainer>
  )
}

export function RouteErrorFallback({ error }: { error: unknown }) {
  const message =
    error instanceof Error
      ? error.message
      : 'Please check your connection and try again.'
  return (
    <PageContainer className="py-12">
      <EmptyStateCard
        icon="info"
        title="Unable to load this page"
        description={message}
        actionLabel="Back to Explore"
        onAction={() => {
          window.location.href = '/'
        }}
      />
    </PageContainer>
  )
}
