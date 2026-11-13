import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '@/components/cards/Card'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { ListerCard } from '@/components/cards/ListerCard'
import { PropertyCard } from '@/components/cards/PropertyCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { FormField } from '@/components/shared/FormField'
import { PageContainer } from '@/components/shared/PageContainer'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { Textarea } from '@/components/ui/Textarea'
import {
  mapProfileDtoToDomain,
  mapPropertyListingDtoToDomain,
} from '@/features/listings/api/mappers'
import {
  UseChangeAgentPasswordMutation,
  UseChangeLandlordPasswordMutation,
  UseChangeSeekerPasswordMutation,
  UseUpdateAgentMeMutation,
  UseUpdateLandlordMeMutation,
  UseUpdateSeekerMeMutation,
} from '@/services/mutations'
import {
  UseGetAgentMeQuery,
  UseGetLandlordMeQuery,
  UseGetMarketplaceListingsQuery,
  UseGetSeekerMeQuery,
} from '@/services/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUserProfile } from '@/store/slices/authSlice'
import { toggleSavedListing } from '@/store/slices/uiSlice'

export default function ProfileView() {
  const { userId } = useParams({ strict: false }) as { userId: string }
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((state) => state.auth.user)
  const savedIds = useAppSelector((state) => state.ui.savedListingIds)
  const isOwnProfile = Boolean(authUser && authUser.id === userId)

  const { seekerMeData } = UseGetSeekerMeQuery(isOwnProfile && authUser?.role === 'seeker')
  const { agentMeData } = UseGetAgentMeQuery(isOwnProfile && authUser?.role === 'agent')
  const { landlordMeData } = UseGetLandlordMeQuery(isOwnProfile && authUser?.role === 'landlord')

  const { marketplaceListingsData, marketplaceListingsIsLoading } =
    UseGetMarketplaceListingsQuery({ per_page: 100 })

  const { updateSeekerMeIsPending, updateSeekerMeMutationAsync } = UseUpdateSeekerMeMutation()
  const { updateAgentMeIsPending, updateAgentMeMutationAsync } = UseUpdateAgentMeMutation()
  const { updateLandlordMeIsPending, updateLandlordMeMutationAsync } =
    UseUpdateLandlordMeMutation()

  const { changeSeekerPasswordIsPending, changeSeekerPasswordMutationAsync } =
    UseChangeSeekerPasswordMutation()
  const { changeAgentPasswordIsPending, changeAgentPasswordMutationAsync } =
    UseChangeAgentPasswordMutation()
  const { changeLandlordPasswordIsPending, changeLandlordPasswordMutationAsync } =
    UseChangeLandlordPasswordMutation()

  const ownLiveProfile = useMemo(() => {
    if (!isOwnProfile) return undefined
    const dto =
      authUser?.role === 'seeker'
        ? seekerMeData?.data
        : authUser?.role === 'agent'
          ? agentMeData?.data
          : authUser?.role === 'landlord'
            ? landlordMeData?.data
            : undefined
    return dto ? mapProfileDtoToDomain(dto) : authUser ?? undefined
  }, [isOwnProfile, authUser, seekerMeData, agentMeData, landlordMeData])

  const allListings = useMemo(
    () => (marketplaceListingsData?.data ?? []).map(mapPropertyListingDtoToDomain),
    [marketplaceListingsData],
  )

  const userListings = useMemo(
    () => allListings.filter((l) => l.lister.id === userId),
    [allListings, userId],
  )

  const savedListings = useMemo(
    () => allListings.filter((l) => savedIds.includes(l.id)),
    [allListings, savedIds],
  )

  const profile = ownLiveProfile ?? userListings[0]?.lister

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [bio, setBio] = useState('')
  const [agencyOrCompany, setAgencyOrCompany] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const syncedProfileKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!ownLiveProfile) return
    const key = `${ownLiveProfile.id}_${ownLiveProfile.name}_${ownLiveProfile.phone}_${ownLiveProfile.preferredLocation ?? ''}`
    if (syncedProfileKeyRef.current === key) return
    syncedProfileKeyRef.current = key

    setFullName(ownLiveProfile.name)
    setPhone(ownLiveProfile.phone)
    setWhatsappNumber(ownLiveProfile.whatsappNumber ?? '')
    setBio(ownLiveProfile.bio ?? '')
    setAgencyOrCompany(ownLiveProfile.agencyName ?? ownLiveProfile.companyName ?? '')
    setPreferredLocation(ownLiveProfile.preferredLocation ?? '')
  }, [ownLiveProfile])

  const isSavingProfile =
    updateSeekerMeIsPending || updateAgentMeIsPending || updateLandlordMeIsPending
  const isChangingPassword =
    changeSeekerPasswordIsPending ||
    changeAgentPasswordIsPending ||
    changeLandlordPasswordIsPending

  const joinedAt = profile?.joinedAt
  const memberSinceFormatted = useMemo(() => {
    if (!joinedAt) return null
    try {
      const d = new Date(joinedAt)
      if (Number.isNaN(d.getTime())) return null
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } catch {
      return null
    }
  }, [joinedAt])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUser) return

    try {
      if (authUser.role === 'seeker') {
        const res = await updateSeekerMeMutationAsync({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          preferred_location: preferredLocation.trim() || null,
        })
        if (res.data) dispatch(updateUserProfile(mapProfileDtoToDomain(res.data)))
      } else if (authUser.role === 'agent') {
        const res = await updateAgentMeMutationAsync({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          whatsapp_number: whatsappNumber.trim() || null,
          agency_name: agencyOrCompany.trim() || null,
          bio: bio.trim() || null,
        })
        if (res.data) dispatch(updateUserProfile(mapProfileDtoToDomain(res.data)))
      } else if (authUser.role === 'landlord') {
        const res = await updateLandlordMeMutationAsync({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          whatsapp_number: whatsappNumber.trim() || null,
          company_name: agencyOrCompany.trim() || null,
          bio: bio.trim() || null,
        })
        if (res.data) dispatch(updateUserProfile(mapProfileDtoToDomain(res.data)))
      }
    } catch {
      // Mutation hook handles errors
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUser || !currentPassword || !newPassword) return

    try {
      const payload = { current_password: currentPassword, new_password: newPassword }
      if (authUser.role === 'seeker') {
        await changeSeekerPasswordMutationAsync(payload)
      } else if (authUser.role === 'agent') {
        await changeAgentPasswordMutationAsync(payload)
      } else if (authUser.role === 'landlord') {
        await changeLandlordPasswordMutationAsync(payload)
      }
      setCurrentPassword('')
      setNewPassword('')
    } catch {
      // Handled by mutation hook
    }
  }

  if (marketplaceListingsIsLoading && !profile) {
    return (
      <PageContainer className="py-8 space-y-6">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    )
  }

  if (!profile) {
    return (
      <PageContainer className="py-12">
        <EmptyStateCard
          icon="user"
          title="Profile not found"
          description="This user profile could not be loaded or has no public listings."
          actionLabel="Explore verified homes"
          onAction={() => navigate({ to: '/' })}
        />
      </PageContainer>
    )
  }

  const isSeeker = profile.role === 'seeker'
  const contactPhone = (profile.whatsappNumber || profile.phone || '').replace(/[^\d+]/g, '')

  return (
    <PageContainer className="py-8 space-y-8">
      {isSeeker ? (
        <Card variant="elevated" padding="lg" className="overflow-hidden">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4 sm:gap-5">
              <Avatar
                name={profile.name}
                src={profile.avatarUrl}
                size="xl"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-ink-900">{profile.name}</h2>
                  <Badge variant="brand">Property Seeker</Badge>
                  {profile.isEmailVerified ? (
                    <Badge variant="success" icon="check">
                      Email Verified
                    </Badge>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="mail" size={13} className="text-ink-400" />
                    {profile.email}
                  </span>
                  {profile.phone ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="phone" size={13} className="text-ink-400" />
                      {profile.phone}
                    </span>
                  ) : null}
                  {profile.preferredLocation ? (
                    <span className="inline-flex items-center gap-1.5 font-medium text-brand-700">
                      <Icon name="location" size={13} className="text-brand-600" />
                      {profile.preferredLocation}
                    </span>
                  ) : null}
                </div>

                {memberSinceFormatted ? (
                  <p className="text-[11px] text-ink-400">
                    Member since {memberSinceFormatted}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-[var(--radius-sm)] border border-line bg-surface-muted px-4 py-2.5 text-center">
                <p className="text-lg font-bold text-ink-900">{savedIds.length}</p>
                <p className="text-[11px] font-medium text-ink-500">Saved Homes</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/' })}
                className="gap-1.5"
              >
                <Icon name="search" size={14} />
                Browse Homes
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <ListerCard
          lister={profile}
          onContact={() => navigate({ to: '/inbox' })}
          onWhatsApp={
            contactPhone
              ? () => window.open(`https://wa.me/${contactPhone}`, '_blank')
              : undefined
          }
        />
      )}

      {isOwnProfile && authUser?.role !== 'admin' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard
            title="Account Profile"
            subtitle={
              isSeeker
                ? 'Update your personal information and housing search preferences.'
                : 'Keep your contact details accurate so seekers or listers can reach you.'
            }
          >
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <FormField label="Full Name" required>
                {({ id }) => (
                  <Input
                    id={id}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                )}
              </FormField>

              <FormField label="Email Address">
                {({ id }) => (
                  <div className="space-y-1.5">
                    <Input
                      id={id}
                      value={profile.email}
                      disabled
                      className="bg-surface-muted text-ink-600 cursor-not-allowed"
                    />
                    {profile.isEmailVerified ? (
                      <p className="flex items-center gap-1 text-[11px] font-medium text-success">
                        <Icon name="check" size={12} />
                        Verified account email
                      </p>
                    ) : null}
                  </div>
                )}
              </FormField>

              <FormField label="Phone Number">
                {({ id }) => (
                  <Input
                    id={id}
                    placeholder="+2348012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                )}
              </FormField>

              {authUser?.role === 'seeker' ? (
                <FormField
                  label="Preferred Location"
                  hint="Used to recommend matching apartments and flats in your target city or neighborhood."
                >
                  {({ id }) => (
                    <Input
                      id={id}
                      placeholder="e.g. Somorin, Abeokuta, Ogun state"
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                    />
                  )}
                </FormField>
              ) : (
                <>
                  <FormField label="WhatsApp Number">
                    {({ id }) => (
                      <Input
                        id={id}
                        placeholder="+2348012345678"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                      />
                    )}
                  </FormField>

                  <FormField
                    label={authUser?.role === 'agent' ? 'Agency Name' : 'Company Name'}
                  >
                    {({ id }) => (
                      <Input
                        id={id}
                        value={agencyOrCompany}
                        onChange={(e) => setAgencyOrCompany(e.target.value)}
                      />
                    )}
                  </FormField>

                  <FormField label="Bio">
                    {({ id }) => (
                      <Textarea
                        id={id}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    )}
                  </FormField>
                </>
              )}

              <Button type="submit" variant="primary" loading={isSavingProfile}>
                Save profile changes
              </Button>
            </form>
          </SectionCard>

          <SectionCard
            title="Security & Password"
            subtitle="Update your account credentials to keep your profile secure."
          >
            <form onSubmit={handleChangePassword} className="space-y-4">
              <FormField label="Current Password" required>
                {({ id }) => (
                  <Input
                    id={id}
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                )}
              </FormField>

              <FormField label="New Password" required>
                {({ id }) => (
                  <Input
                    id={id}
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                )}
              </FormField>

              <Button type="submit" variant="outline" loading={isChangingPassword}>
                Change password
              </Button>
            </form>
          </SectionCard>
        </div>
      ) : null}

      {isSeeker && isOwnProfile ? (
        <SectionCard
          title={`Your Shortlisted Properties (${savedListings.length})`}
          subtitle={
            profile.preferredLocation
              ? `Homes you've saved while searching around ${profile.preferredLocation}`
              : 'Keep track of properties you want to inspect or inquire about'
          }
        >
          {savedListings.length === 0 ? (
            <EmptyStateCard
              icon="heart"
              title="No saved homes yet"
              description="Tap the heart icon on any verified property to shortlist it here for easy comparison."
              actionLabel="Explore verified homes"
              onAction={() => navigate({ to: '/' })}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {savedListings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  isSaved
                  onToggleSave={(id) => dispatch(toggleSavedListing(id))}
                  onSelect={(id) =>
                    navigate({ to: '/listing/$listingId', params: { listingId: id } })
                  }
                />
              ))}
            </div>
          )}
        </SectionCard>
      ) : !isSeeker && userListings.length > 0 ? (
        <SectionCard
          title={`Active Listings by ${profile.name}`}
          subtitle="Verified marketplace properties listed under this account"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {userListings.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                onSelect={(id) =>
                  navigate({ to: '/listing/$listingId', params: { listingId: id } })
                }
              />
            ))}
          </div>
        </SectionCard>
      ) : null}
    </PageContainer>
  )
}


