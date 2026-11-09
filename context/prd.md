Oruvia PRD: Proptech & Real Estate Hackathon MVP
A property marketplace connecting renters and buyers with verified agents and landlords. Built for the Ogun Digital Summit Hackathon, Proptech & Real Estate track.
About the name: Oruvia comes from òrùlé (Yoruba for "roof") plus via (Latin for "way"), meaning "the way to a roof over your head."
1. Problem
Finding an apartment in Nigeria usually means physically visiting many properties, relying on middlemen, and risking fake listings, inflated "agent fees" and wasted trips. Landlords and agents have no simple way to reach serious clients. Both sides lose time and money.
2. Goal
Let anyone search, shortlist, inspect (virtually) and contact the right property owner or agent from their phone, without going to the location until they are serious.
MVP success metrics (demo-able):
A landlord or agent can publish a listing in under 3 minutes.
A renter or buyer can find a relevant property in under 1 minute.
An inspection request can be sent and confirmed fully in-app.
3. Users
User
Need
Seeker (renter/buyer)
Find verified, affordable properties in a chosen location without physical searching
Agent
Showcase multiple listings and get qualified leads
Landlord
List directly and reach tenants or buyers without paying for exposure
Admin
Verify users and moderate listings

4. MVP Features
Must have (build these first)
Auth and roles: sign up and log in as Seeker, Agent or Landlord (email or phone OTP).
Create listing: title, type (rent or sale), price, location, bedrooms and bathrooms, description, amenities, 3 to 10 photos (video optional).
Search and filters: location, rent or sale, price range, bedrooms, property type. Results as cards, with a map view if time allows.
Listing detail page: photo gallery, price, amenities, location map, owner or agent profile, "Verified" badge.
Contact and inspection booking: the seeker requests an inspection date and time. The lister accepts, declines or reschedules. A virtual option (video call or video tour) is available.
Favourites/Saved listings: shortlist properties.
Lister dashboard: manage listings (edit, mark as rented or sold, delete) and view inspection requests and inquiries.
In-app messaging or inquiry: a simple thread per listing, or a WhatsApp deep-link as a fallback.
Should have (if time allows)
Agent and landlord verification (upload ID, admin approves, "Verified" badge).
Report listing or user (fake or scam flag).
Reviews and ratings for agents and landlords (Airbnb-style trust signal).
Notifications via email, SMS or push for inquiries and inspection updates.
Rent payment or inspection fee through Paystack or Flutterwave (test mode).
Won't build now (mention as roadmap)
Mortgage and rent-to-own financing, e-signed tenancy agreements, AI price estimation, 3D/VR tours, escrow payments.
5. Key User Flows
Lister: Sign up, choose Agent or Landlord, upload ID (optional), create listing, receive inquiries and inspection requests, confirm, mark as rented or sold.
Seeker: Sign up, search by location and filters, view listing, save or message, request inspection (virtual or physical), get confirmation.
6. Airbnb Ideas Worth Borrowing
Photo-first listing cards and a clean gallery.
Search by location with filters and a map.
Host profiles with verification badges and reviews.
A structured request and confirm flow instead of back-and-forth calls.
Wishlists (saved properties).
Where to differ: Airbnb is short stays and payment-centric. Oruvia is long-term rent and sales, so the core action is inspection booking and inquiry, not instant booking.
7. Suggested Tech Stack
Frontend: React with Tailwind (mobile-first).
Backend and DB: Neon (auth, Postgres, storage for images, realtime for chat), or Firebase.
Maps: Google Maps or Mapbox (or Leaflet and OpenStreetMap for free).
Payments (optional): Bash test mode.
Hosting: Vercel/Cpanel.
8. Data Model (core tables)
users (id, name, phone, role, verified)
listings (id, owner_id, type, title, price, location, lat/lng, beds, baths, description, status)
listing_images (listing_id, url)
favorites (user_id, listing_id)
inspections (id, listing_id, seeker_id, date_time, mode, status)
messages (thread_id, sender_id, body)
reviews (reviewer_id, target_user_id, rating, comment)
9. Risks and Mitigations
Risk
Mitigation
Fake listings and scams
Verification badge, report button, admin moderation
Low supply at launch
Seed the demo with realistic sample listings and onboard a few real agents
Trust between strangers
Reviews, verified profiles, in-app communication
Poor connectivity
Compress images, lazy-load, mobile-first design

