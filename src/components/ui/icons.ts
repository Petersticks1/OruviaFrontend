export interface OfflineIconDef {
  id: string
  body: string
  width?: number
  height?: number
}

export const ICON_DEFINITIONS = {
  heart: {
    id: 'solar:heart-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 20.4C12 20.4 3.5 15.2 3.5 8.9C3.5 5.9 5.8 3.6 8.7 3.6C10.4 3.6 11.9 4.4 12 5.7C12.1 4.4 13.6 3.6 15.3 3.6C18.2 3.6 20.5 5.9 20.5 8.9C20.5 15.2 12 20.4 12 20.4Z"/>',
  },
  heartFilled: {
    id: 'solar:heart-bold',
    body: '<path fill="currentColor" stroke="currentColor" stroke-width="1.5" d="M12 20.4C12 20.4 3.5 15.2 3.5 8.9C3.5 5.9 5.8 3.6 8.7 3.6C10.4 3.6 11.9 4.4 12 5.7C12.1 4.4 13.6 3.6 15.3 3.6C18.2 3.6 20.5 5.9 20.5 8.9C20.5 15.2 12 20.4 12 20.4Z"/>',
  },
  search: {
    id: 'solar:magnifer-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20l-3.5-3.5"/></g>',
  },
  map: {
    id: 'solar:map-point-wave-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M9 19l-5 2V5l5-2m0 16l6 2m-6-2V3m6 18l5-2V3l-5 2m0 16V5"/></g>',
  },
  list: {
    id: 'solar:list-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></g>',
  },
  bed: {
    id: 'solar:bed-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M3 7v11m18-7v7M3 14h18M6 10h4a1 1 0 0 1 1 1v3H5v-3a1 1 0 0 1 1-1Zm8 0h4a1 1 0 0 1 1 1v3h-6v-3a1 1 0 0 1 1-1Z"/></g>',
  },
  bath: {
    id: 'solar:bath-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Zm2-7a2 2 0 0 1 4 0v1M4 12V6a2 2 0 0 1 2-2h1"/><path d="M7 19v2m10-2v2"/></g>',
  },
  area: {
    id: 'solar:ruler-angular-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M4 9h3M4 14h3M9 4v3m5-3v3"/></g>',
  },
  verified: {
    id: 'solar:shield-check-bold',
    body: '<path fill="currentColor" d="M12 2L4 5.5v6.1c0 5.1 3.4 9.8 8 11.4c4.6-1.6 8-6.3 8-11.4V5.5L12 2Zm-1.1 13.6l-3.5-3.5l1.4-1.4l2.1 2.1l4.6-4.6l1.4 1.4l-6 6Z"/>',
  },
  shield: {
    id: 'solar:shield-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3L4 6.5v5.5c0 4.9 3.4 9.4 8 11c4.6-1.6 8-6.1 8-11V6.5L12 3Z"/>',
  },
  calendar: {
    id: 'solar:calendar-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><rect width="18" height="16" x="3" y="5" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/></g>',
  },
  clock: {
    id: 'solar:clock-circle-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>',
  },
  video: {
    id: 'solar:videocamera-record-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><rect width="13" height="12" x="3" y="6" rx="2.5"/><path d="m16 10l5-3v10l-5-3v-4Z"/></g>',
  },
  camera: {
    id: 'solar:camera-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><circle cx="12" cy="13" r="3"/><path d="M9 4.5h6l1.5 2.5H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h3.5L9 4.5Z"/></g>',
  },
  home: {
    id: 'solar:home-smile-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="m3 10.5l9-7l9 7M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M9.5 14.5a3.5 3.5 0 0 0 5 0"/></g>',
  },
  building: {
    id: 'solar:buildings-2-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 10h3a1 1 0 0 1 1 1v10M2 21h20"/><path d="M8 7h4m-4 4h4m-4 4h4"/></g>',
  },
  duplex: {
    id: 'solar:buildings-3-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M3 21h18M5 21V8l7-5l7 5v13M9 21v-5h6v5M9 11h6"/></g>',
  },
  bungalow: {
    id: 'solar:home-2-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M2 12l10-7l10 7M4 11v9h16v-9M10 20v-5h4v5"/></g>',
  },
  selfContain: {
    id: 'solar:key-minimalistic-square-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><circle cx="9" cy="12" r="3"/><path d="M12 12h8m-2 0v3m-3-3v2"/></g>',
  },
  land: {
    id: 'solar:map-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M3 7l6-3l6 3l6-3v13l-6 3l-6-3l-6 3V7Zm6-3v13m6-10v13"/></g>',
  },
  office: {
    id: 'solar:case-minimalistic-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><rect width="18" height="13" x="3" y="7" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></g>',
  },
  shop: {
    id: 'solar:shop-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M4 9l1.5-5h13L20 9M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9Zm5 11v-6h6v6"/></g>',
  },
  chat: {
    id: 'solar:chat-round-dots-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M12 21a9 9 0 1 0-7.8-4.5L3 21l4.5-1.2A8.96 8.96 0 0 0 12 21Z"/><circle cx="8.5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="15.5" cy="12" r="1" fill="currentColor"/></g>',
  },
  bell: {
    id: 'solar:bell-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M18 9a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 20a2 2 0 0 0 4 0"/></g>',
  },
  user: {
    id: 'solar:user-circle-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><circle cx="12" cy="9" r="3.5"/><path d="M5.5 19.5a7 7 0 0 1 13 0"/><circle cx="12" cy="12" r="9.5"/></g>',
  },
  menu: {
    id: 'solar:hamburger-menu-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" d="M4 7h16M4 12h16M4 17h16"/>',
  },
  filter: {
    id: 'solar:tuning-2-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"><path d="M4 8h9m4 0h3M4 16h3m4 0h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/></g>',
  },
  share: {
    id: 'solar:share-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M12 3v12m0-12l-4 4m4-4l4 4M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></g>',
  },
  star: {
    id: 'solar:star-bold',
    body: '<path fill="currentColor" d="m12 2.5l2.9 6l6.6.9l-4.8 4.6l1.2 6.5L12 17.4l-5.9 3.1l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z"/>',
  },
  starOutline: {
    id: 'solar:star-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8" d="m12 2.5l2.9 6l6.6.9l-4.8 4.6l1.2 6.5L12 17.4l-5.9 3.1l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z"/>',
  },
  check: {
    id: 'solar:check-read-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12.5l4.5 4.5L19 7.5"/>',
  },
  close: {
    id: 'solar:close-circle-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/>',
  },
  chevronLeft: {
    id: 'solar:alt-arrow-left-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6"/>',
  },
  chevronRight: {
    id: 'solar:alt-arrow-right-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 6l6 6l-6 6"/>',
  },
  chevronDown: {
    id: 'solar:alt-arrow-down-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9l6 6l6-6"/>',
  },
  chevronUp: {
    id: 'solar:alt-arrow-up-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 15l6-6l6 6"/>',
  },
  upload: {
    id: 'solar:cloud-upload-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M12 16V8m0 0l-3 3m3-3l3 3"/><path d="M7 18a4.5 4.5 0 0 1-.8-8.9A6 6 0 0 1 18 9.5a4 4 0 0 1 .5 8"/></g>',
  },
  trash: {
    id: 'solar:trash-bin-trash-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3m-8 0l1 13h8l1-13"/></g>',
  },
  edit: {
    id: 'solar:pen-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m15.5 4.5l4 4L7 21H3v-4L15.5 4.5Z"/>',
  },
  report: {
    id: 'solar:flag-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 21V4m0 0h13l-2.5 4.5L18 13H5"/>',
  },
  whatsapp: {
    id: 'mdi:whatsapp',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M12 21a9 9 0 1 0-7.8-4.5L3 21l4.5-1.2A8.96 8.96 0 0 0 12 21Z"/><path d="M9 9.5c.3 2 2.2 4 4.5 4.5l1.5-1.2l1.5 1c-.2 1.4-1.4 2.2-2.8 2c-3.5-.5-6.2-3.2-6.7-6.7c-.2-1.4.6-2.6 2-2.8l1 1.5L9 9.5Z"/></g>',
  },
  location: {
    id: 'solar:map-point-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M12 21s-7-5.8-7-11a7 7 0 1 1 14 0c0 5.2-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></g>',
  },
  wifi: {
    id: 'solar:wi-fi-router-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"><path d="M3 9.5a13 13 0 0 1 18 0M6.5 13a8.5 8.5 0 0 1 11 0M10 16.5a4 4 0 0 1 4 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/></g>',
  },
  power: {
    id: 'solar:bolt-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 2L4 14h7l-1 8l9-12h-7l1-8Z"/>',
  },
  solar: {
    id: 'solar:sun-2-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 3v2m0 14v2M3 12h2m14 0h2m-2.6-6.4l-1.4 1.4M7 17l-1.4 1.4m0-12.8L7 7m10 10l1.4 1.4"/></g>',
  },
  water: {
    id: 'solar:waterdrops-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3s6 6.8 6 11a6 6 0 1 1-12 0c0-4.2 6-11 6-11Z"/>',
  },
  parking: {
    id: 'solar:wheel-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><rect width="16" height="16" x="4" y="4" rx="3"/><path d="M9.5 16V8h3.5a2.5 2.5 0 0 1 0 5H9.5"/></g>',
  },
  security: {
    id: 'solar:shield-user-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M12 3L4 6.5v5.5c0 4.9 3.4 9.4 8 11c4.6-1.6 8-6.1 8-11V6.5L12 3Z"/><path d="M9 12l2 2l4-4"/></g>',
  },
  pool: {
    id: 'solar:swimming-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" d="M3 15c2 0 2-1.5 4-1.5s2 1.5 4 1.5s2-1.5 4-1.5s2 1.5 4 1.5M3 19c2 0 2-1.5 4-1.5s2 1.5 4 1.5s2-1.5 4-1.5s2 1.5 4 1.5M8 11V5a2 2 0 0 1 4 0v6m4 0V5a2 2 0 0 1 4 0"/>',
  },
  gym: {
    id: 'solar:dumbbell-large-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12"/>',
  },
  ac: {
    id: 'solar:wind-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" d="M4 9h11a2.5 2.5 0 1 0-2.5-2.5M4 13h14a2.5 2.5 0 1 1-2.5 2.5M4 17h8a2 2 0 1 1-2 2"/>',
  },
  kitchen: {
    id: 'solar:chef-hat-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M6 14h12v5H6v-5Zm1 5v2h10v-2"/><path d="M6 14a4 4 0 0 1 1-7.8A4.5 4.5 0 0 1 16 6a4 4 0 0 1 2 8"/></g>',
  },
  balcony: {
    id: 'solar:window-frame-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><rect width="16" height="16" x="4" y="4" rx="1.5"/><path d="M12 4v16M4 12h16"/></g>',
  },
  plus: {
    id: 'solar:add-circle-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 5v14M5 12h14"/>',
  },
  minus: {
    id: 'solar:minus-circle-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 12h14"/>',
  },
  phone: {
    id: 'solar:phone-calling-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6.5 4h3l1.5 4l-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2A2 2 0 0 1 6.5 4Z"/>',
  },
  mail: {
    id: 'solar:letter-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="m3 7l9 6l9-6"/></g>',
  },
  arrowRight: {
    id: 'solar:arrow-right-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 12h16m0 0l-6-6m6 6l-6 6"/>',
  },
  arrowLeft: {
    id: 'solar:arrow-left-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 12H4m0 0l6-6m-6 6l6 6"/>',
  },
  sparkles: {
    id: 'solar:stars-minimalistic-linear',
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Zm6 12l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"/>',
  },
  eye: {
    id: 'solar:eye-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6S18 18 12 18S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></g>',
  },
  eyeClosed: {
    id: 'solar:eye-closed-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="m3 3l18 18M10.586 10.586a2 2 0 0 0 2.828 2.828M7.362 7.561C5.68 8.74 4.279 10.42 2.5 12c1.889 2.991 5.282 6 9.5 6c1.55 0 3.043-.523 4.395-1.35M12 6c4.008 0 6.701 3.158 8.032 5.06a13.8 13.8 0 0 1-1.607 2.003"/></g>',
  },
  info: {
    id: 'solar:info-circle-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r="1" fill="currentColor"/></g>',
  },
  globe: {
    id: 'solar:global-linear',
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></g>',
  },
} as const satisfies Record<string, OfflineIconDef>

export type IconName = keyof typeof ICON_DEFINITIONS

export const ICON_REGISTRY: Record<IconName, string> = Object.fromEntries(
  Object.entries(ICON_DEFINITIONS).map(([key, def]) => [key, def.id]),
) as Record<IconName, string>

