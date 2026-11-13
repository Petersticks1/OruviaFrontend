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
  UseUploadAgentListingMediaMutation,
  UseUploadLandlordListingMediaMutation,
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
import { showOruviaToast } from '@/utils/toast'

function compressImageFile(file: File, maxDim = 512, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to load image element'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(reader.result as string)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

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

  const { uploadAgentListingMediaMutationAsync } = UseUploadAgentListingMediaMutation()
  const { uploadLandlordListingMediaMutationAsync } = UseUploadLandlordListingMediaMutation()

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !authUser) return

    if (file.size > 5 * 1024 * 1024) {
      showOruviaToast('error', 'Profile photo must be under 5MB.')
      e.target.value = ''
      return
    }

    setIsUploadingAvatar(true)
    try {
      let avatarUrl: string | null = null

      if (authUser.role === 'agent') {
        try {
          const formData = new FormData()
          formData.append('images', file)
          const uploadRes = await uploadAgentListingMediaMutationAsync(formData)
          if (uploadRes?.data?.images?.[0]) {
            avatarUrl = uploadRes.data.images[0]
          }
        } catch {
          // Fall back to client compression
        }
      } else if (authUser.role === 'landlord') {
        try {
          const formData = new FormData()
          formData.append('images', file)
          const uploadRes = await uploadLandlordListingMediaMutationAsync(formData)
          if (uploadRes?.data?.images?.[0]) {
            avatarUrl = uploadRes.data.images[0]
          }
        } catch {
          // Fall back to client compression
        }
      }

      if (!avatarUrl) {
        avatarUrl = await compressImageFile(file, 512, 0.85)
      }

      if (authUser.role === 'seeker') {
        const res = await updateSeekerMeMutationAsync({ avatar_url: avatarUrl })
        if (res.data) dispatch(updateUserProfile(mapProfileDtoToDomain(res.data)))
      } else if (authUser.role === 'agent') {
        const res = await updateAgentMeMutationAsync({ avatar_url: avatarUrl })
        if (res.data) dispatch(updateUserProfile(mapProfileDtoToDomain(res.data)))
      } else if (authUser.role === 'landlord') {
        const res = await updateLandlordMeMutationAsync({ avatar_url: avatarUrl })
        if (res.data) dispatch(updateUserProfile(mapProfileDtoToDomain(res.data)))
      }
    } catch {
      // Handled by mutation hook
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!authUser) return
    setIsUploadingAvatar(true)
    try {
      if (authUser.role === 'seeker') {
        const res = await updateSeekerMeMutationAsync({ avatar_url: null })
        if (res.data) dispatch(updateUserProfile(mapProfileDtoToDomain(res.data)))
      } else if (authUser.role === 'agent') {
        const res = await updateAgentMeMutationAsync({ avatar_url: null })
        if (res.data) dispatch(updateUserProfile(mapProfileDtoToDomain(res.data)))
      } else if (authUser.role === 'landlord') {
        const res = await updateLandlordMeMutationAsync({ avatar_url: null })
        if (res.data) dispatch(updateUserProfile(mapProfileDtoToDomain(res.data)))
      }
    } catch {
      // Handled by mutation hook
    } finally {
      setIsUploadingAvatar(false)
    }
  }

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
              <div className="relative inline-block shrink-0">
                <Avatar
                  name={profile.name}
                  src={profile.avatarUrl}
                  size="xl"
                />
                {isUploadingAvatar ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-surface">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-surface border-t-transparent" />
                  </div>
                ) : null}
                {isOwnProfile ? (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isUploadingAvatar}
                    aria-label="Upload display picture"
                    title="Upload display picture"
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-brand-600 text-surface shadow-md transition hover:bg-brand-700 disabled:opacity-50"
                  >
                    <Icon name="camera" size={15} />
                  </button>
                ) : null}
              </div>
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
          onUploadAvatar={isOwnProfile ? triggerFileInput : undefined}
          isUploadingAvatar={isUploadingAvatar}
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
                ? 'Update your personal information, profile photo, and housing search preferences.'
                : 'Keep your contact details and profile photo accurate so clients can reach you.'
            }
          >
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Photo / Display Picture Section */}
              <div className="flex flex-col gap-4 rounded-[var(--radius-sm)] border border-line bg-surface-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <Avatar name={profile.name} src={profile.avatarUrl} size="lg" />
                    {isUploadingAvatar ? (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-surface">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-transparent" />
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">Profile Display Picture</p>
                    <p className="text-xs text-ink-500">
                      PNG, JPG or WebP up to 5MB. Clear face photo recommended.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    loading={isUploadingAvatar}
                    onClick={triggerFileInput}
                    className="gap-1.5"
                  >
                    <Icon name="camera" size={14} />
                    <span>{profile.avatarUrl ? 'Change photo' : 'Upload photo'}</span>
                  </Button>
                  {profile.avatarUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isUploadingAvatar}
                      onClick={handleRemoveAvatar}
                      className="text-danger hover:text-danger hover:bg-danger/10"
                    >
                      <Icon name="trash" size={14} />
                      <span className="sr-only sm:not-sr-only sm:ml-1">Remove</span>
                    </Button>
                  ) : null}
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleAvatarFileSelected}
                className="hidden"
              />

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


