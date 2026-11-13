import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'

export interface LiveSelfieCaptureProps {
  label: string
  hint: string
  required?: boolean
  file: File | null
  onFileSelect: (file: File | null) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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

export function LiveSelfieCapture({
  label,
  hint,
  required,
  file,
  onFileSelect,
}: LiveSelfieCaptureProps) {
  const [cameraModalOpen, setCameraModalOpen] = useState(false)
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isStartingCamera, setIsStartingCamera] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const nativeCameraInputRef = useRef<HTMLInputElement>(null)

  const displayUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    return () => {
      if (displayUrl) {
        URL.revokeObjectURL(displayUrl)
      }
    }
  }, [displayUrl])

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

  const startLiveStream = useCallback(async () => {
    setIsStartingCamera(true)
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsStartingCamera(false)
      return true
    } catch {
      stopCameraStream()
      setIsStartingCamera(false)
      return false
    }
  }, [stopCameraStream])

  const handleOpenCamera = async () => {
    setCameraError(null)
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
      window.innerWidth < 768

    if (isTouchDevice || !navigator.mediaDevices?.getUserMedia) {
      nativeCameraInputRef.current?.click()
      return
    }

    setCapturedDataUrl(null)
    setCameraModalOpen(true)
    const ok = await startLiveStream()
    if (!ok) {
      setCameraModalOpen(false)
      setCameraError(
        'Camera permission was denied or unavailable. Please allow camera access in your browser to take a live selfie.',
      )
    }
  }

  const handleCloseModal = () => {
    stopCameraStream()
    setCapturedDataUrl(null)
    setCameraModalOpen(false)
  }

  const handleCaptureFrame = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return

    const maxDim = 960
    const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight))
    const width = Math.round(video.videoWidth * scale)
    const height = Math.round(video.videoHeight * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw unmirrored frame so any ID held beside the face remains legible
    ctx.drawImage(video, 0, 0, width, height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedDataUrl(dataUrl)
    stopCameraStream()
  }

  const handleRetakeInModal = async () => {
    setCapturedDataUrl(null)
    const ok = await startLiveStream()
    if (!ok) {
      handleCloseModal()
      setCameraError('Unable to restart camera. Please check your browser permissions.')
    }
  }

  const handleConfirmSelfie = () => {
    if (!capturedDataUrl) return
    const capturedFile = dataUrlToFile(capturedDataUrl, `kyc-live-selfie-${Date.now()}.jpg`)
    onFileSelect(capturedFile)
    handleCloseModal()
  }

  const handleNativeCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    e.target.value = ''
    if (selected) {
      setCameraError(null)
      onFileSelect(selected)
    }
  }

  const handleRemove = () => {
    onFileSelect(null)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-ink-900">
          {label} {required ? <span className="text-danger">*</span> : null}
        </label>
        {file ? (
          <span className="text-[11px] font-medium text-success flex items-center gap-1">
            <Icon name="check" size={12} /> Captured
          </span>
        ) : null}
      </div>

      {/* Mobile native camera fallback (capture="user" opens front camera directly) */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleNativeCameraChange}
        className="hidden"
      />

      {file ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-success/30 bg-success/5 p-3">
          <div className="flex items-center gap-3 min-w-0">
            {displayUrl ? (
              <img
                src={displayUrl}
                alt="Live selfie preview"
                className="h-12 w-12 shrink-0 rounded-full object-cover border border-line"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface border border-line text-ink-700">
                <Icon name="camera" size={20} />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-ink-900">{file.name}</p>
              <p className="text-[11px] text-ink-500">
                Live selfie • {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon="camera"
              onClick={handleOpenCamera}
            >
              Retake
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-danger hover:text-danger hover:bg-danger/10"
            >
              <Icon name="trash" size={14} />
              <span className="sr-only sm:not-sr-only sm:ml-1">Remove</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-sm)] border-2 border-dashed border-line bg-surface-muted/40 p-5 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface border border-line text-brand-600 shadow-xs">
            <Icon name="camera" size={22} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-ink-900">Take a live selfie with your camera</p>
            <p className="text-[11px] text-ink-500">{hint}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon="camera"
            onClick={handleOpenCamera}
          >
            Open Camera
          </Button>
          {cameraError ? (
            <p className="text-[11px] font-medium text-danger max-w-md">{cameraError}</p>
          ) : null}
        </div>
      )}

      <Modal
        open={cameraModalOpen}
        onClose={handleCloseModal}
        title="Take Live Selfie"
        description="Position your face clearly in good lighting. Hold your Government ID beside your face if needed."
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            {capturedDataUrl ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  leftIcon="camera"
                  onClick={handleRetakeInModal}
                >
                  Retake
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  leftIcon="check"
                  onClick={handleConfirmSelfie}
                >
                  Use Selfie
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="primary"
                leftIcon="camera"
                disabled={isStartingCamera}
                onClick={handleCaptureFrame}
              >
                {isStartingCamera ? 'Starting camera...' : 'Capture Selfie'}
              </Button>
            )}
          </div>
        }
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] bg-ink-900">
          {capturedDataUrl ? (
            <img
              src={capturedDataUrl}
              alt="Captured live selfie"
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
                <div className="h-52 w-40 rounded-full border-2 border-dashed border-surface/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.28)]" />
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
