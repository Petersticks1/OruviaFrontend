import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

export interface ListingMediaUploaderProps {
  existingImages: string[]
  pendingImageFiles: File[]
  videoUrl: string
  pendingVideoFile: File | null
  isUploading?: boolean
  onAddPhotoFiles: (files: File[]) => void
  onRemoveExistingPhoto: (index: number) => void
  onRemovePendingPhoto: (index: number) => void
  onSelectVideoFile: (file: File | null) => void
  onVideoUrlChange: (url: string) => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header?.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const binary = atob(base64 ?? '')
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new File([bytes], filename, { type: mime })
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/i.test(url)
}

export function ListingMediaUploader({
  existingImages,
  pendingImageFiles,
  videoUrl,
  pendingVideoFile,
  isUploading = false,
  onAddPhotoFiles,
  onRemoveExistingPhoto,
  onRemovePendingPhoto,
  onSelectVideoFile,
  onVideoUrlChange,
}: ListingMediaUploaderProps) {
  const photoFilesInputRef = useRef<HTMLInputElement>(null)
  const photoCameraInputRef = useRef<HTMLInputElement>(null)
  const videoFileInputRef = useRef<HTMLInputElement>(null)
  const videoCameraInputRef = useRef<HTMLInputElement>(null)

  // Local object URLs for pending image files & pending video file
  const pendingImageUrls = useMemo(
    () => pendingImageFiles.map((file) => URL.createObjectURL(file)),
    [pendingImageFiles],
  )
  useEffect(() => {
    return () => {
      pendingImageUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [pendingImageUrls])

  const pendingVideoPreviewUrl = useMemo(
    () => (pendingVideoFile ? URL.createObjectURL(pendingVideoFile) : null),
    [pendingVideoFile],
  )
  useEffect(() => {
    return () => {
      if (pendingVideoPreviewUrl) {
        URL.revokeObjectURL(pendingVideoPreviewUrl)
      }
    }
  }, [pendingVideoPreviewUrl])

  // Photo Camera Modal State
  const [photoCameraOpen, setPhotoCameraOpen] = useState(false)
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null)
  const [photoCameraError, setPhotoCameraError] = useState<string | null>(null)
  const [isStartingPhotoCam, setIsStartingPhotoCam] = useState(false)
  const photoVideoRef = useRef<HTMLVideoElement>(null)
  const photoStreamRef = useRef<MediaStream | null>(null)

  // Image Full Preview Modal
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  // Live Video Recording Modal State
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState<string | null>(null)
  const [videoCameraError, setVideoCameraError] = useState<string | null>(null)
  const [isStartingVideoCam, setIsStartingVideoCam] = useState(false)

  const recordVideoRef = useRef<HTMLVideoElement>(null)
  const recordStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const stopPhotoStream = useCallback(() => {
    if (photoStreamRef.current) {
      photoStreamRef.current.getTracks().forEach((track) => track.stop())
      photoStreamRef.current = null
    }
    if (photoVideoRef.current) {
      photoVideoRef.current.srcObject = null
    }
  }, [])

  const stopVideoStream = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch {
        // Ignore stop errors if already inactive
      }
    }
    mediaRecorderRef.current = null
    if (recordStreamRef.current) {
      recordStreamRef.current.getTracks().forEach((track) => track.stop())
      recordStreamRef.current = null
    }
    if (recordVideoRef.current) {
      recordVideoRef.current.srcObject = null
    }
    setIsRecording(false)
  }, [])

  useEffect(() => {
    return () => {
      stopPhotoStream()
      stopVideoStream()
    }
  }, [stopPhotoStream, stopVideoStream])

  useEffect(() => {
    return () => {
      if (recordedPreviewUrl) {
        URL.revokeObjectURL(recordedPreviewUrl)
      }
    }
  }, [recordedPreviewUrl])

  // ── Photo File & Camera Handlers ───────────────────────────────────────────
  const handlePhotoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return
    onAddPhotoFiles(files)
  }

  const startPhotoCameraStream = useCallback(async () => {
    setIsStartingPhotoCam(true)
    setPhotoCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      photoStreamRef.current = stream
      if (photoVideoRef.current) {
        photoVideoRef.current.srcObject = stream
      }
      setIsStartingPhotoCam(false)
      return true
    } catch {
      stopPhotoStream()
      setIsStartingPhotoCam(false)
      return false
    }
  }, [stopPhotoStream])

  const handleOpenPhotoCamera = async () => {
    setPhotoCameraError(null)
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
      window.innerWidth < 768

    if (isTouchDevice || !navigator.mediaDevices?.getUserMedia) {
      photoCameraInputRef.current?.click()
      return
    }

    setCapturedPhotoUrl(null)
    setPhotoCameraOpen(true)
    const ok = await startPhotoCameraStream()
    if (!ok) {
      setPhotoCameraOpen(false)
      setPhotoCameraError(
        'Camera access denied or unavailable. Please allow camera access or choose image files instead.',
      )
    }
  }

  const handleClosePhotoCamera = () => {
    stopPhotoStream()
    setCapturedPhotoUrl(null)
    setPhotoCameraOpen(false)
  }

  const handleCapturePhoto = () => {
    const video = photoVideoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return

    const maxDim = 1280
    const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight))
    const width = Math.round(video.videoWidth * scale)
    const height = Math.round(video.videoHeight * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, width, height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedPhotoUrl(dataUrl)
    stopPhotoStream()
  }

  const handleRetakePhoto = async () => {
    setCapturedPhotoUrl(null)
    const ok = await startPhotoCameraStream()
    if (!ok) {
      handleClosePhotoCamera()
      setPhotoCameraError('Unable to restart camera.')
    }
  }

  const handleAddCapturedPhoto = () => {
    if (!capturedPhotoUrl) return
    const file = dataUrlToFile(capturedPhotoUrl, `listing-photo-${Date.now()}.jpg`)
    onAddPhotoFiles([file])
    handleClosePhotoCamera()
  }

  // ── Video File & Live Recording Handlers ───────────────────────────────────
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    onSelectVideoFile(file)
  }

  const startRecordStream = useCallback(async () => {
    setIsStartingVideoCam(true)
    setVideoCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      recordStreamRef.current = stream
      if (recordVideoRef.current) {
        recordVideoRef.current.srcObject = stream
      }
      setIsStartingVideoCam(false)
      return true
    } catch {
      stopVideoStream()
      setIsStartingVideoCam(false)
      return false
    }
  }, [stopVideoStream])

  const handleOpenVideoRecorder = async () => {
    setVideoCameraError(null)
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
      window.innerWidth < 768

    if (
      isTouchDevice ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      videoCameraInputRef.current?.click()
      return
    }

    setRecordedBlob(null)
    if (recordedPreviewUrl) {
      URL.revokeObjectURL(recordedPreviewUrl)
      setRecordedPreviewUrl(null)
    }
    setRecordingSeconds(0)
    setVideoModalOpen(true)

    const ok = await startRecordStream()
    if (!ok) {
      setVideoModalOpen(false)
      setVideoCameraError(
        'Camera/microphone access denied or unavailable. Please allow access or select a video file instead.',
      )
    }
  }

  const handleCloseVideoRecorder = () => {
    stopVideoStream()
    setRecordedBlob(null)
    if (recordedPreviewUrl) {
      URL.revokeObjectURL(recordedPreviewUrl)
      setRecordedPreviewUrl(null)
    }
    setRecordingSeconds(0)
    setVideoModalOpen(false)
  }

  const handleStartRecording = () => {
    const stream = recordStreamRef.current
    if (!stream) return

    recordedChunksRef.current = []
    const preferredTypes = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4']
    const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported(type))
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream)

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data)
      }
    }

    recorder.onstop = () => {
      const resolvedMime = recorder.mimeType || 'video/webm'
      const blob = new Blob(recordedChunksRef.current, { type: resolvedMime })
      const url = URL.createObjectURL(blob)
      setRecordedBlob(blob)
      setRecordedPreviewUrl(url)
      if (recordStreamRef.current) {
        recordStreamRef.current.getTracks().forEach((track) => track.stop())
        recordStreamRef.current = null
      }
      if (recordVideoRef.current) {
        recordVideoRef.current.srcObject = null
      }
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
      setIsRecording(false)
    }

    mediaRecorderRef.current = recorder
    recorder.start(250)
    setIsRecording(true)
    setRecordingSeconds(0)
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1)
    }, 1000)
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  const handleRetakeVideo = async () => {
    setRecordedBlob(null)
    if (recordedPreviewUrl) {
      URL.revokeObjectURL(recordedPreviewUrl)
      setRecordedPreviewUrl(null)
    }
    setRecordingSeconds(0)
    const ok = await startRecordStream()
    if (!ok) {
      handleCloseVideoRecorder()
      setVideoCameraError('Unable to restart camera for video recording.')
    }
  }

  const handleUseRecordedVideo = () => {
    if (!recordedBlob) return
    const ext = recordedBlob.type.includes('mp4') ? 'mp4' : 'webm'
    const file = new File([recordedBlob], `listing-tour-${Date.now()}.${ext}`, {
      type: recordedBlob.type || 'video/webm',
    })
    onSelectVideoFile(file)
    handleCloseVideoRecorder()
  }

  const totalPhotos = existingImages.length + pendingImageFiles.length
  const activeVideoSrc = pendingVideoPreviewUrl || videoUrl

  return (
    <div className="space-y-6">
      {/* ── 1. Property Photos ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-ink-900">
              Property Photos <span className="text-brand-500">*</span>
            </p>
            <p className="text-[11px] text-ink-500">
              Select multiple images or capture with your camera. Photos upload when you submit.
            </p>
          </div>
          <span className="text-xs font-semibold text-ink-600">
            {totalPhotos} {totalPhotos === 1 ? 'photo' : 'photos'} selected
          </span>
        </div>

        {/* Hidden Inputs */}
        <input
          ref={photoFilesInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoFilesChange}
          className="hidden"
        />
        <input
          ref={photoCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoFilesChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border-2 border-dashed border-line bg-surface-muted/40 p-5 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface border border-line text-brand-500 shadow-xs">
            <Icon name="upload" size={20} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-ink-900">
              Add property photos (JPEG, PNG, WebP)
            </p>
            <p className="text-[11px] text-ink-500">
              Select multiple files at once or capture directly from camera
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon="upload"
              disabled={isUploading}
              onClick={() => photoFilesInputRef.current?.click()}
            >
              Choose Files
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon="camera"
              disabled={isUploading}
              onClick={handleOpenPhotoCamera}
            >
              Take Photo (Camera)
            </Button>
          </div>
          {photoCameraError ? (
            <p className="text-[11px] font-medium text-danger max-w-md">{photoCameraError}</p>
          ) : null}
        </div>

        {totalPhotos > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {existingImages.map((url, idx) => (
              <div
                key={`existing-${url}-${idx}`}
                className="group relative overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface-muted"
              >
                <button
                  type="button"
                  onClick={() => setPreviewImageUrl(url)}
                  className="block w-full cursor-pointer"
                >
                  <img
                    src={url}
                    alt={`Property photo ${idx + 1}`}
                    width={240}
                    height={180}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </button>
                {idx === 0 ? (
                  <span className="absolute top-1.5 left-1.5 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-surface shadow-xs">
                    Cover
                  </span>
                ) : null}
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => onRemoveExistingPhoto(idx)}
                  aria-label={`Remove photo ${idx + 1}`}
                  className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded bg-ink-900/80 px-2 py-1 text-[11px] font-semibold text-surface transition hover:bg-danger cursor-pointer disabled:opacity-50"
                >
                  <Icon name="trash" size={12} />
                  Remove
                </button>
              </div>
            ))}

            {pendingImageUrls.map((url, idx) => {
              const overallIdx = existingImages.length + idx
              return (
                <div
                  key={`pending-${url}-${idx}`}
                  className="group relative overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface-muted"
                >
                  <button
                    type="button"
                    onClick={() => setPreviewImageUrl(url)}
                    className="block w-full cursor-pointer"
                  >
                    <img
                      src={url}
                      alt={`Selected photo ${overallIdx + 1}`}
                      width={240}
                      height={180}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </button>
                  {overallIdx === 0 ? (
                    <span className="absolute top-1.5 left-1.5 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-surface shadow-xs">
                      Cover
                    </span>
                  ) : (
                    <span className="absolute top-1.5 left-1.5 rounded-full bg-ink-900/75 px-2 py-0.5 text-[10px] font-medium text-surface">
                      Ready
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => onRemovePendingPhoto(idx)}
                    aria-label={`Remove photo ${overallIdx + 1}`}
                    className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded bg-ink-900/80 px-2 py-1 text-[11px] font-semibold text-surface transition hover:bg-danger cursor-pointer disabled:opacity-50"
                  >
                    <Icon name="trash" size={12} />
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>

      {/* ── 2. Property Video Tour ─────────────────────────────────────────── */}
      <div className="space-y-3 border-t border-line pt-5">
        <div>
          <p className="text-xs font-semibold text-ink-900">Property Video Tour (optional)</p>
          <p className="text-[11px] text-ink-500">
            Select a video file or record a live walkthrough. Video uploads when you submit.
          </p>
        </div>

        <input
          ref={videoFileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoFileChange}
          className="hidden"
        />
        <input
          ref={videoCameraInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          onChange={handleVideoFileChange}
          className="hidden"
        />

        {activeVideoSrc ? (
          <div className="space-y-3 rounded-[var(--radius-md)] border border-line bg-surface p-3.5">
            {!pendingVideoFile && isYouTubeUrl(activeVideoSrc) ? (
              <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-surface-muted p-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                    <Icon name="video" size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink-900">External Video Tour Linked</p>
                    <p className="truncate text-[11px] text-ink-500">{activeVideoSrc}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => onVideoUrlChange('')}
                  className="text-danger hover:text-danger hover:bg-danger/10 shrink-0"
                >
                  <Icon name="trash" size={14} />
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <video
                  src={activeVideoSrc}
                  controls
                  playsInline
                  className="aspect-video w-full rounded-[var(--radius-sm)] bg-ink-900 object-contain"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-success flex items-center gap-1">
                    <Icon name="check" size={12} />
                    {pendingVideoFile
                      ? `${pendingVideoFile.name} • Ready to upload on submit`
                      : 'Video tour attached'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon="video"
                      disabled={isUploading}
                      onClick={() => videoFileInputRef.current?.click()}
                    >
                      Replace Video
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => {
                        onSelectVideoFile(null)
                        onVideoUrlChange('')
                      }}
                      className="text-danger hover:text-danger hover:bg-danger/10"
                    >
                      <Icon name="trash" size={14} />
                      Remove
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border-2 border-dashed border-line bg-surface-muted/40 p-5 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface border border-line text-brand-500 shadow-xs">
              <Icon name="video" size={20} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-ink-900">
                Select or record a property walkthrough video
              </p>
              <p className="text-[11px] text-ink-500">
                MP4, WebM, or MOV — uploaded automatically when you submit the listing
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon="upload"
                disabled={isUploading}
                onClick={() => videoFileInputRef.current?.click()}
              >
                Select Video
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                leftIcon="video"
                disabled={isUploading}
                onClick={handleOpenVideoRecorder}
              >
                Start Video Recording
              </Button>
            </div>
            {videoCameraError ? (
              <p className="text-[11px] font-medium text-danger max-w-md">{videoCameraError}</p>
            ) : null}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-ink-500">
            Or paste a video URL (YouTube / hosted MP4)
          </label>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => {
              if (pendingVideoFile) onSelectVideoFile(null)
              onVideoUrlChange(e.target.value)
            }}
            disabled={isUploading}
          />
        </div>
      </div>

      {/* ── Photo Camera Modal ─────────────────────────────────────────────── */}
      <Modal
        open={photoCameraOpen}
        onClose={handleClosePhotoCamera}
        title="Take Property Photo"
        description="Frame the room or exterior clearly, then capture to add to your listing."
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleClosePhotoCamera}>
              Cancel
            </Button>
            {capturedPhotoUrl ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  leftIcon="camera"
                  onClick={handleRetakePhoto}
                >
                  Retake
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  leftIcon="check"
                  onClick={handleAddCapturedPhoto}
                >
                  Add Photo
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="primary"
                leftIcon="camera"
                disabled={isStartingPhotoCam}
                onClick={handleCapturePhoto}
              >
                {isStartingPhotoCam ? 'Starting camera...' : 'Capture Photo'}
              </Button>
            )}
          </div>
        }
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] bg-ink-900">
          {capturedPhotoUrl ? (
            <img
              src={capturedPhotoUrl}
              alt="Captured property photo"
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              ref={photoVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </Modal>

      {/* ── Live Video Recording Modal ─────────────────────────────────────── */}
      <Modal
        open={videoModalOpen}
        onClose={handleCloseVideoRecorder}
        title="Record Property Video Tour"
        description="Walk through the property and record a clear tour video."
        size="lg"
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold text-ink-600">
              {isRecording ? (
                <span className="inline-flex items-center gap-1.5 text-danger">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger animate-pulse" />
                  Recording: {formatDuration(recordingSeconds)}
                </span>
              ) : recordedPreviewUrl ? (
                <span>Recorded ({formatDuration(recordingSeconds)})</span>
              ) : (
                <span>Ready to record</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={handleCloseVideoRecorder}>
                Cancel
              </Button>
              {recordedPreviewUrl ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon="video"
                    onClick={handleRetakeVideo}
                  >
                    Retake
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    leftIcon="check"
                    onClick={handleUseRecordedVideo}
                  >
                    Use Video
                  </Button>
                </>
              ) : isRecording ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleStopRecording}
                >
                  Stop Recording
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  leftIcon="video"
                  disabled={isStartingVideoCam}
                  onClick={handleStartRecording}
                >
                  {isStartingVideoCam ? 'Starting camera...' : 'Start Recording'}
                </Button>
              )}
            </div>
          </div>
        }
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-md)] bg-ink-900">
          {recordedPreviewUrl ? (
            <video
              src={recordedPreviewUrl}
              controls
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <video
              ref={recordVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </Modal>

      {/* ── Photo Full-Size Preview Modal ──────────────────────────────────── */}
      <Modal
        open={Boolean(previewImageUrl)}
        onClose={() => setPreviewImageUrl(null)}
        title="Photo Preview"
        size="lg"
      >
        {previewImageUrl ? (
          <img
            src={previewImageUrl}
            alt="Property preview"
            className="max-h-[70vh] w-full rounded-[var(--radius-sm)] object-contain bg-surface-muted"
          />
        ) : null}
      </Modal>
    </div>
  )
}
