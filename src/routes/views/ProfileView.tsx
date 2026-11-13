import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { ListerCard } from '@/components/cards/ListerCard'
import { PropertyCard } from '@/components/cards/PropertyCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { FormField } from '@/components/shared/FormField'
import { PageContainer } from '@/components/shared/PageContainer'
import { Button } from '@/components/ui/Button'
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

export default function ProfileView() {
  const { userId } = useParams({ strict: false }) as { userId: string }
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((state) => state.auth.user)
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

  const profile = ownLiveProfile ?? userListings[0]?.lister

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [bio, setBio] = useState('')
  const [agencyOrCompany, setAgencyOrCompany] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    if (!ownLiveProfile) return
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
          description="This lister profile has no public listings or could not be loaded."
          actionLabel="Explore verified homes"
          onAction={() => navigate({ to: '/' })}
        />
      </PageContainer>
    )
  }

  const contactPhone = (profile.whatsappNumber || profile.phone || '').replace(/[^\d+]/g, '')

  return (
    <PageContainer className="py-8 space-y-8">
      <ListerCard
        lister={profile}
        onContact={() => navigate({ to: '/inbox' })}
        onWhatsApp={
          contactPhone
            ? () => window.open(`https://wa.me/${contactPhone}`, '_blank')
            : undefined
        }
      />

      {isOwnProfile && authUser?.role !== 'admin' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard
            title="Account Profile"
            subtitle="Keep your contact details accurate so seekers or listers can reach you."
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

              <FormField label="Phone Number">
                {({ id }) => (
                  <Input
                    id={id}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                )}
              </FormField>

              {authUser?.role === 'seeker' ? (
                <FormField label="Preferred Location">
                  {({ id }) => (
                    <Input
                      id={id}
                      placeholder="e.g. Abeokuta, Ogun"
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
            subtitle="Update your account password."
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

      {userListings.length > 0 ? (
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

