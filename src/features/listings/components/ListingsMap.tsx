import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { PropertyCard } from '@/components/cards/PropertyCard'
import { formatCompactNaira } from '@/lib/formatters'
import type { Listing } from '@/types/domain'

export interface ListingsMapProps {
  listings: readonly Listing[]
  onSelectListing?: (listingId: string) => void
  savedIds?: readonly string[]
  onToggleSave?: (listingId: string) => void
  className?: string
}

function createPricePinIcon(price: number): L.DivIcon {
  const formatted = formatCompactNaira(price)
  return L.divIcon({
    className: 'oruvia-price-pin',
    html: `<div style="background: var(--color-surface); color: var(--color-ink-900); border: 1.5px solid var(--color-ink-900); border-radius: 9999px; padding: 4px 10px; font-weight: 700; font-size: 12px; white-space: nowrap; box-shadow: var(--shadow-card); display: inline-block;">${formatted}</div>`,
    iconSize: [72, 28],
    iconAnchor: [36, 14],
  })
}

export function ListingsMap({
  listings,
  onSelectListing,
  savedIds = [],
  onToggleSave,
  className = 'h-[540px] w-full',
}: ListingsMapProps) {
  const first = listings[0]
  const center: [number, number] = first ? [first.lat, first.lng] : [6.85, 3.4]

  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-muted ${className}`}
    >
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            icon={createPricePinIcon(listing.price)}
          >
            <Popup minWidth={260} maxWidth={280}>
              <div className="p-1">
                <PropertyCard
                  listing={listing}
                  variant="compact"
                  isSaved={savedIds.includes(listing.id)}
                  onToggleSave={onToggleSave}
                  onSelect={onSelectListing}
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

