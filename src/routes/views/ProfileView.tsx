import { useNavigate, useParams } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { Textarea } from '@/components/ui/Textarea'
import {
  mapProfileDtoToDomain,
  mapPropertyListingDtoToDomain,
} from '@/features/listings/api/mappers'
import { cn } from '@/lib/cn'
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
  UseGetAgentKycQuery,
  UseGetAgentMeQuery,
  UseGetLandlordKycQuery,
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

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header?.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const binary = atob(base64 ?? '')
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    array[i] = binary.charCodeAt(i)
  }
  return new File([array], filename, { type: mime })
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

  const { agentKycData } = UseGetAgentKycQuery(isOwnProfile && authUser?.role === 'agent')
  const { landlordKycData } = UseGetLandlordKycQuery(isOwnProfile && authUser?.role === 'landlord')
  const kycStatus = authUser?.role === 'agent' ? agentKycData?.data : landlordKycData?.data

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
  const [dpPreviewOpen, setDpPreviewOpen] = useState(false)
  const [photoSourceModalOpen, setPhotoSourceModalOpen] = useState(false)
  const [cameraModalOpen, setCameraModalOpen] = useState(false)
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopCameraStream()
    }
  }, [stopCameraStream])

  const uploadAvatarFile = async (file: File) => {
    if (!authUser) return
    if (file.size > 5 * 1024 * 1024) {
      showOruviaToast('error', 'Profile photo must be under 5MB.')
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
    }
  }

  const triggerGalleryPicker = () => {
    setPhotoSourceModalOpen(false)
    galleryInputRef.current?.click()
  }

  const triggerCameraCapture = async () => {
    setPhotoSourceModalOpen(false)
    setCapturedPhotoUrl(null)
    setCameraError(null)

    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
      window.innerWidth < 768

    if (isTouchDevice || !navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click()
      return
    }

    setCameraModalOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      stopCameraStream()
      setCameraModalOpen(false)
      setCameraError('Camera access unavailable. Opening file selector instead.')
      cameraInputRef.current?.click()
    }
  }

  const handleCloseCameraModal = () => {
    stopCameraStream()
    setCapturedPhotoUrl(null)
    setCameraModalOpen(false)
  }

  const handleCaptureFrame = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return

    const size = Math.min(video.videoWidth, video.videoHeight, 512)
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Center-crop square frame & mirror horizontally to match selfie preview
    const sx = (video.videoWidth - Math.min(video.videoWidth, video.videoHeight)) / 2
    const sy = (video.videoHeight - Math.min(video.videoWidth, video.videoHeight)) / 2
    const sSize = Math.min(video.videoWidth, video.videoHeight)

    ctx.translate(size, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, sx, sy, sSize, sSize, 0, 0, size, size)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88)
    setCapturedPhotoUrl(dataUrl)
    stopCameraStream()
  }

  const handleRetakePhoto = async () => {
    setCapturedPhotoUrl(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      handleCloseCameraModal()
    }
  }

  const handleConfirmCapturedPhoto = async () => {
    if (!capturedPhotoUrl) return
    const file = dataUrlToFile(capturedPhotoUrl, `profile-camera-${Date.now()}.jpg`)
    handleCloseCameraModal()
    await uploadAvatarFile(file)
  }

  const handleAvatarFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    await uploadAvatarFile(file)
  }

  const handleRemoveAvatar = async () => {
    if (!authUser) return
    setDpPreviewOpen(false)
    setPhotoSourceModalOpen(false)
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
        <Skeleton className="h-56 w-full rounded-[var(--radius-lg)]" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-[var(--radius-lg)]" />
          <Skeleton className="h-96 w-full rounded-[var(--radius-lg)]" />
        </div>
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
    <PageContainer className="py-6 sm:py-8 space-y-8">
      {/* Hidden File Inputs for Gallery & Camera */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleAvatarFileSelected}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleAvatarFileSelected}
        className="hidden"
      />

      {isSeeker ? (
        <Card variant="elevated" padding="none" className="overflow-hidden border border-line">
          {/* Subtle Decorative Banner */}
          <div className="relative h-24 sm:h-28 w-full bg-gradient-to-r from-brand-50 via-brand-100/50 to-surface-muted border-b border-line/60">
            <div className="absolute right-6 top-4 hidden sm:flex items-center gap-2 rounded-full bg-surface/85 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-ink-700 border border-line/80 shadow-xs">
              <Icon name="shield" size={13} className="text-brand-600" />
              <span>Oruvia Verified Member</span>
            </div>
          </div>

          <div className="relative z-10 px-5 pb-6 pt-4 sm:px-8 sm:pb-7 sm:pt-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                {/* Overlapping Avatar with Preview + Camera Trigger */}
                <div className="relative inline-block self-start sm:self-auto shrink-0 -mt-14 sm:-mt-16">
                  {profile.avatarUrl ? (
                    <button
                      type="button"
                      onClick={() => setDpPreviewOpen(true)}
                      aria-label="Preview display picture"
                      className="group relative rounded-full ring-4 ring-surface shadow-[var(--shadow-hover)] focus:outline-none focus-visible:ring-brand-500 cursor-pointer"
                    >
                      <Avatar name={profile.name} src={profile.avatarUrl} size="xl" />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-ink-900/40 opacity-0 transition-opacity group-hover:opacity-100 text-surface">
                        <Icon name="eye" size={20} />
                      </span>
                    </button>
                  ) : (
                    <div className="rounded-full ring-4 ring-surface shadow-[var(--shadow-hover)]">
                      <Avatar name={profile.name} src={profile.avatarUrl} size="xl" />
                    </div>
                  )}

                  {isUploadingAvatar ? (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-ink-900/50 text-surface">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-surface border-t-transparent" />
                    </div>
                  ) : null}

                  {isOwnProfile ? (
                    <button
                      type="button"
                      onClick={() => setPhotoSourceModalOpen(true)}
                      disabled={isUploadingAvatar}
                      aria-label="Change display picture"
                      title="Change display picture"
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-brand-600 text-surface shadow-md transition hover:bg-brand-700 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Icon name="camera" size={15} />
                    </button>
                  ) : null}
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
                      {profile.name}
                    </h1>
                    <Badge variant="brand">Property Seeker</Badge>
                    {profile.isEmailVerified ? (
                      <Badge variant="success" icon="check">
                        Email Verified
                      </Badge>
                    ) : null}
                  </div>

                  {profile.preferredLocation ? (
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                      <Icon name="location" size={14} className="text-brand-600 shrink-0" />
                      <span>Searching in {profile.preferredLocation}</span>
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Right Quick Action & Stats */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate({ to: '/saved' })}
                  className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-line bg-surface-muted/70 px-3.5 py-2 text-left transition hover:border-ink-300 hover:bg-surface-muted cursor-pointer"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon name="heartFilled" size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-none text-ink-900">{savedIds.length}</p>
                    <p className="text-[11px] font-medium text-ink-500 mt-0.5">Saved Homes</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate({ to: '/inspections' })}
                  className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-line bg-surface-muted/70 px-3.5 py-2 text-left transition hover:border-ink-300 hover:bg-surface-muted cursor-pointer"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-ink-700 border border-line">
                    <Icon name="calendar" size={15} />
                  </span>
                  <div>
                    <p className="text-xs font-bold leading-none text-ink-900">Inspections</p>
                    <p className="text-[11px] font-medium text-ink-500 mt-0.5">View schedule</p>
                  </div>
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate({ to: '/' })}
                  className="gap-1.5"
                >
                  <Icon name="search" size={14} />
                  Browse Homes
                </Button>
              </div>
            </div>

            {/* Contact Meta Strip */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-ink-600">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="mail" size={14} className="text-ink-400" />
                {profile.email}
              </span>
              {profile.phone ? (
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="phone" size={14} className="text-ink-400" />
                  {profile.phone}
                </span>
              ) : null}
              {memberSinceFormatted ? (
                <span className="inline-flex items-center gap-1.5 text-ink-500">
                  <Icon name="calendar" size={14} className="text-ink-400" />
                  Member since {memberSinceFormatted}
                </span>
              ) : null}
            </div>
          </div>
        </Card>
      ) : (
        <ListerCard
          lister={profile}
          onUploadAvatar={isOwnProfile ? () => setPhotoSourceModalOpen(true) : undefined}
          onPreviewAvatar={profile.avatarUrl ? () => setDpPreviewOpen(true) : undefined}
          isUploadingAvatar={isUploadingAvatar}
          onContact={() => navigate({ to: '/inbox' })}
          onWhatsApp={
            contactPhone
              ? () => window.open(`https://wa.me/${contactPhone}`, '_blank')
              : undefined
          }
        />
      )}

      {/* KYC Verification Card for Agents and Landlords */}
      {isOwnProfile && (authUser?.role === 'agent' || authUser?.role === 'landlord') ? (
        <Card variant="elevated" padding="lg" className="border-line bg-surface overflow-hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-surface shadow-xs',
                  kycStatus?.is_verified
                    ? 'bg-success'
                    : kycStatus?.verification_status === 'pending'
                      ? 'bg-warning text-ink-900'
                      : kycStatus?.verification_status === 'rejected'
                        ? 'bg-danger'
                        : 'bg-brand-600',
                )}
              >
                <Icon
                  name={
                    kycStatus?.is_verified
                      ? 'verified'
                      : kycStatus?.verification_status === 'pending'
                        ? 'clock'
                        : kycStatus?.verification_status === 'rejected'
                          ? 'report'
                          : 'shield'
                  }
                  size={22}
                />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-ink-900">
                    {kycStatus?.is_verified
                      ? 'Account Verified'
                      : kycStatus?.verification_status === 'pending'
                        ? 'KYC Verification In Progress'
                        : kycStatus?.verification_status === 'rejected'
                          ? 'KYC Verification Needs Attention'
                          : 'Identity & Professional Verification (KYC)'}
                  </h3>
                  <Badge
                    variant={
                      kycStatus?.is_verified
                        ? 'success'
                        : kycStatus?.verification_status === 'pending'
                          ? 'warning'
                          : kycStatus?.verification_status === 'rejected'
                            ? 'danger'
                            : 'brand'
                    }
                  >
                    {kycStatus?.is_verified
                      ? 'Approved'
                      : kycStatus?.verification_status === 'pending'
                        ? 'Pending Review'
                        : kycStatus?.verification_status === 'rejected'
                          ? 'Rejected'
                          : 'Unverified'}
                  </Badge>
                </div>
                <p className="text-xs text-ink-600 max-w-xl">
                  {kycStatus?.is_verified
                    ? 'Your Government ID and professional credentials have been confirmed. Your listings feature the authentic Oruvia verified badge.'
                    : kycStatus?.verification_status === 'pending'
                      ? 'Your documents have been submitted and are currently in the compliance moderation queue. Turnaround is typically 12–24 hours.'
                      : kycStatus?.verification_status === 'rejected'
                        ? `Reason: ${kycStatus.kyc_submission?.rejection_reason || 'Documents were unclear'}. Please upload updated credentials.`
                        : 'Verify your Government ID (NIN, Passport) and property/practice documents to earn the Oruvia trust badge and publish verified listings.'}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                variant={kycStatus?.is_verified ? 'outline' : 'primary'}
                size="sm"
                onClick={() => navigate({ to: '/verify' })}
                className="gap-1.5 w-full sm:w-auto"
              >
                <Icon name="verified" size={15} />
                <span>
                  {kycStatus?.is_verified
                    ? 'View KYC Details'
                    : kycStatus?.verification_status === 'pending'
                      ? 'Track Verification'
                      : kycStatus?.verification_status === 'rejected'
                        ? 'Resubmit Documents'
                        : 'Complete KYC'}
                </span>
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {isOwnProfile && authUser?.role !== 'admin' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard
            title="Account Profile"
            subtitle={
              isSeeker
                ? 'Update your personal information, display picture, and housing search preferences.'
                : 'Keep your contact details and profile photo accurate so clients can reach you.'
            }
          >
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Photo / Display Picture Manager */}
              <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-line bg-surface-muted/50 p-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    {profile.avatarUrl ? (
                      <button
                        type="button"
                        onClick={() => setDpPreviewOpen(true)}
                        aria-label="Preview profile picture"
                        className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer"
                      >
                        <Avatar name={profile.name} src={profile.avatarUrl} size="lg" />
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-ink-900/40 opacity-0 transition-opacity group-hover:opacity-100 text-surface">
                          <Icon name="eye" size={16} />
                        </span>
                      </button>
                    ) : (
                      <Avatar name={profile.name} src={profile.avatarUrl} size="lg" />
                    )}
                    {isUploadingAvatar ? (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-ink-900/45 text-surface">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-transparent" />
                      </div>
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-900">Display Picture</p>
                    <p className="text-xs text-ink-500">
                      {profile.avatarUrl
                        ? 'Tap your photo to preview full size, or choose a new image below.'
                        : 'Upload from your gallery or snap a new photo with your camera.'}
                    </p>
                  </div>
                </div>

                {cameraError ? (
                  <p className="text-xs text-warning">{cameraError}</p>
                ) : null}

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingAvatar}
                    onClick={triggerGalleryPicker}
                    className="gap-1.5"
                  >
                    <Icon name="gallery" size={14} />
                    <span>Select from Gallery</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingAvatar}
                    onClick={triggerCameraCapture}
                    className="gap-1.5"
                  >
                    <Icon name="camera" size={14} />
                    <span>Capture from Camera</span>
                  </Button>

                  {profile.avatarUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isUploadingAvatar}
                      onClick={handleRemoveAvatar}
                      className="text-danger hover:text-danger hover:bg-danger/10 ml-auto"
                    >
                      <Icon name="trash" size={14} />
                      <span className="ml-1">Remove</span>
                    </Button>
                  ) : null}
                </div>
              </div>

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

              <Button type="submit" variant="primary" loading={isSavingProfile} fullWidth>
                Save profile changes
              </Button>
            </form>
          </SectionCard>

          <div className="space-y-6">
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

                <FormField
                  label="New Password"
                  required
                  hint="Use at least 8 characters including letters and numbers."
                >
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

            {/* Account Summary Card */}
            <SectionCard
              title="Account Overview"
              subtitle="Your verified Oruvia account status and activity summary."
            >
              <div className="divide-y divide-line text-sm">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-ink-500">Account Type</span>
                  <span className="font-semibold capitalize text-ink-900">
                    {profile.role === 'seeker' ? 'Property Seeker' : profile.role}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-ink-500">Email Verification</span>
                  {profile.isEmailVerified ? (
                    <Badge variant="success" icon="check">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </div>
                {memberSinceFormatted ? (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-ink-500">Member Since</span>
                    <span className="font-medium text-ink-900">{memberSinceFormatted}</span>
                  </div>
                ) : null}
              </div>
            </SectionCard>
          </div>
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
          action={
            savedListings.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/saved' })}>
                View all
              </Button>
            ) : undefined
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

      {/* Full-Size Display Picture Preview Modal */}
      <Modal
        open={dpPreviewOpen && Boolean(profile.avatarUrl)}
        onClose={() => setDpPreviewOpen(false)}
        title={profile.name}
        description="Display picture preview"
        size="md"
        footer={
          isOwnProfile ? (
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDpPreviewOpen(false)
                    triggerGalleryPicker()
                  }}
                  className="gap-1.5"
                >
                  <Icon name="gallery" size={14} />
                  <span>Gallery</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDpPreviewOpen(false)
                    triggerCameraCapture()
                  }}
                  className="gap-1.5"
                >
                  <Icon name="camera" size={14} />
                  <span>Camera</span>
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveAvatar}
                className="text-danger hover:text-danger hover:bg-danger/10 gap-1.5"
              >
                <Icon name="trash" size={14} />
                <span>Remove</span>
              </Button>
            </div>
          ) : undefined
        }
      >
        {profile.avatarUrl ? (
          <div className="flex items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-surface-muted border border-line">
            <img
              src={profile.avatarUrl}
              alt={`${profile.name} display picture`}
              className="max-h-[60vh] w-full object-contain"
            />
          </div>
        ) : null}
      </Modal>

      {/* Photo Source Chooser Modal (Triggered from Avatar Camera Badge) */}
      <Modal
        open={photoSourceModalOpen}
        onClose={() => setPhotoSourceModalOpen(false)}
        title="Update Display Picture"
        description="Choose how you want to add or update your profile photo."
        size="sm"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={triggerGalleryPicker}
            className="flex flex-col items-center justify-center gap-2.5 rounded-[var(--radius-md)] border border-line bg-surface-muted/40 p-5 text-center transition hover:border-brand-500 hover:bg-brand-50/30 cursor-pointer"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Icon name="gallery" size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-900">Select from Gallery</p>
              <p className="text-[11px] text-ink-500 mt-0.5">Choose PNG, JPG or WebP</p>
            </div>
          </button>

          <button
            type="button"
            onClick={triggerCameraCapture}
            className="flex flex-col items-center justify-center gap-2.5 rounded-[var(--radius-md)] border border-line bg-surface-muted/40 p-5 text-center transition hover:border-brand-500 hover:bg-brand-50/30 cursor-pointer"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Icon name="camera" size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-900">Capture from Camera</p>
              <p className="text-[11px] text-ink-500 mt-0.5">Take a live photo now</p>
            </div>
          </button>
        </div>

        {profile.avatarUrl ? (
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setPhotoSourceModalOpen(false)
                setDpPreviewOpen(true)
              }}
              className="gap-1.5"
            >
              <Icon name="eye" size={14} />
              <span>Preview current photo</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveAvatar}
              className="text-danger hover:text-danger hover:bg-danger/10 gap-1.5"
            >
              <Icon name="trash" size={14} />
              <span>Remove</span>
            </Button>
          </div>
        ) : null}
      </Modal>

      {/* Live Webcam Capture Modal */}
      <Modal
        open={cameraModalOpen}
        onClose={handleCloseCameraModal}
        title="Capture Profile Photo"
        description="Position your face inside the frame and capture a clear photo."
        size="md"
        footer={
          <div className="flex items-center justify-between gap-3 w-full">
            <Button type="button" variant="ghost" size="sm" onClick={handleCloseCameraModal}>
              Cancel
            </Button>
            {capturedPhotoUrl ? (
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleRetakePhoto}>
                  Retake
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  loading={isUploadingAvatar}
                  onClick={handleConfirmCapturedPhoto}
                >
                  Use this photo
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                leftIcon="camera"
                onClick={handleCaptureFrame}
              >
                Capture Photo
              </Button>
            )}
          </div>
        }
      >
        <div className="relative mx-auto aspect-square max-h-[360px] w-full overflow-hidden rounded-[var(--radius-md)] bg-ink-900 border border-line">
          {capturedPhotoUrl ? (
            <img
              src={capturedPhotoUrl}
              alt="Captured profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover -scale-x-100"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-56 w-56 rounded-full border-2 border-dashed border-surface/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.28)]" />
              </div>
            </>
          )}
        </div>
      </Modal>
    </PageContainer>
  )
}
