# Routely bus reservation frontend

Routely is a React + Vite bus booking frontend prototype. The screens currently
use hard-coded sample data and local component state; there are no implemented
backend API calls yet. This README describes the existing user-facing features
and a suggested REST API contract for connecting the frontend to a Spring Boot
backend.

## Current frontend features

- **Home and trip search:** choose origin, destination, departure date, and 1–6
  adult passengers; swap the cities; browse a few popular routes.
- **Search results:** view bus operator, bus type, departure and arrival,
  duration, amenities, rating, remaining seats, and fare. The UI presents sort
  choices and price/type/departure/rating filters.
- **Seat selection:** view a seat map with available, selected, and occupied
  states and select seats for the trip.
- **Passenger details:** enter the primary passenger's name, email, and phone;
  enter a second passenger's name when multiple seats are selected; opt in to
  SMS trip updates.
- **Payment:** choose card or UPI/wallet in the UI and continue to a confirmation
  screen.
- **Booking confirmation:** display a booking reference, trip and seat
  information, and a ticket-download action.
- **My bookings:** view an upcoming booking and start cancellation or
  rescheduling.
- **Account and support:** login/signup modal, Google sign-in button, help
  search field, and a contact form.
- **Presentation:** light/dark theme toggle, popular routes, and responsive
  navigation.

### Prototype limitations to account for

Several controls are visual-only or simulate success locally. In particular,
trip results, seat availability, booking details, authentication, payment,
cancellation, rescheduling, ticket download, help search, and contact form
submission are not connected to a server. Popular routes and the bus list are
static. Some displayed values are inconsistent between screens (for example,
times, price, booking reference, and passenger/seat counts); use server
responses as the source of truth when integrating.

The passenger picker allows up to six passengers, while the seat picker and
passenger form currently support fewer passenger details. The backend should
support one passenger record per selected seat, and the frontend should be
updated to match that behavior.

## Suggested Spring Boot API

The routes below are a proposed contract, not endpoints already present in this
frontend. Use a common base path such as `/api/v1`, JSON request/response bodies,
and ISO-8601 dates/timestamps. Require HTTPS in production.

### 1. Cities and popular routes

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/cities?query=ben` | Search city/station suggestions for origin and destination fields. |
| `GET` | `/api/v1/routes/popular` | Return popular routes, minimum fare, and departure count for the home page. |

Example city response:

```json
[
  {
    "id": "city-blr",
    "name": "Bengaluru",
    "stations": [{ "id": "station-1", "name": "Kempegowda Bus Station" }]
  }
]
```

Use stable city/station IDs in API requests even if the UI displays names.

### 2. Search trips and apply filters

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/trips?originId=city-blr&destinationId=city-goa&departureDate=2026-11-06&passengers=2&sort=recommended&maxFare=1800&busType=sleeper&departurePeriod=morning&minRating=4.5` | Search trips and return the filtered/sorted results for the selected date and passenger count. |
| `GET` | `/api/v1/trips/{tripId}` | Fetch the current details for one trip before seat selection or checkout. |

Suggested supported sort values: `recommended`, `lowest`, and `earliest`.
Suggested bus types: `sleeper`, `seater`, or omit for all types. Suggested
departure periods: `early_morning`, `morning`, `afternoon`, and `evening`.
Return departure and arrival timestamps with their timezone/offset; do not
derive a schedule from the browser's local clock.

Example trip result:

```json
{
  "id": "trip-203",
  "operator": { "id": "operator-1", "name": "Velora Express" },
  "coach": { "id": "coach-203", "number": "VB 203", "type": "sleeper" },
  "origin": { "city": "Bengaluru", "station": "Kempegowda Bus Station" },
  "destination": { "city": "Goa", "station": "Panaji Bus Stand" },
  "departureAt": "2026-11-06T06:30:00+05:30",
  "arrivalAt": "2026-11-06T17:00:00+05:30",
  "durationMinutes": 630,
  "farePerPassenger": { "amount": 1299, "currency": "INR" },
  "availableSeatCount": 7,
  "rating": 4.9,
  "reviewCount": 842,
  "amenities": ["wifi", "usb_charging", "extra_legroom"]
}
```

### 3. Seat map and temporary seat holds

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/trips/{tripId}/seats` | Return the seat map and each seat's current availability and fare. |
| `POST` | `/api/v1/seat-holds` | Temporarily reserve selected seats while the customer enters passenger details and pays. |
| `DELETE` | `/api/v1/seat-holds/{holdId}` | Release a hold when the user abandons or changes the selection. |

Example hold request:

```json
{
  "tripId": "trip-203",
  "seatIds": ["2A", "2B"]
}
```

Return a `holdId`, `expiresAt`, and the held seats. Holds must be atomic and
time-limited so two customers cannot purchase the same seat. Recheck availability
when creating the booking and handle expired/occupied seats with a `409 Conflict`
response.

### 4. Fare quote and booking

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/bookings/quote` | Calculate the current fare, fees, taxes, and total for the trip and selected seats. |
| `POST` | `/api/v1/bookings` | Create a pending booking using a valid seat hold and passenger details. |
| `GET` | `/api/v1/bookings/{bookingId}` | Fetch booking status, itinerary, passenger/seat details, and payment status. |
| `GET` | `/api/v1/bookings/{bookingId}/ticket` | Download or retrieve the confirmed ticket (PDF or a signed download URL). |

Example booking request:

```json
{
  "tripId": "trip-203",
  "seatHoldId": "hold-abc123",
  "passengers": [
    {
      "seatId": "2A",
      "firstName": "Aarav",
      "lastName": "Sharma",
      "email": "aarav.sharma@example.in",
      "phone": "+919876543210"
    },
    {
      "seatId": "2B",
      "firstName": "Mira",
      "lastName": "Sharma"
    }
  ],
  "contact": { "email": "aarav.sharma@example.in", "phone": "+919876543210" },
  "smsUpdates": true
}
```

Validate that passenger count equals seat count and that every requested seat
belongs to the hold. Calculate all prices on the server; never trust a total
provided by the browser. Return a booking ID/reference and a state such as
`PENDING_PAYMENT`; mark it confirmed only after verified payment succeeds.

### 5. Payment

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/bookings/{bookingId}/payment-session` | Create a checkout session with the configured payment provider. |
| `GET` | `/api/v1/payments/{paymentId}` | Return payment status for the frontend return/polling screen. |
| `POST` | `/api/v1/payments/webhook/{provider}` | Receive and verify signed payment-provider events (server-to-server). |

Example payment-session response:

```json
{
  "paymentId": "pay-456",
  "status": "REQUIRES_ACTION",
  "checkoutUrl": "https://payment-provider.example/checkout/session"
}
```

Use a payment gateway's hosted checkout or tokenized SDK. **Do not send raw
card numbers, expiry dates, or CVC values to the Spring Boot API or store them
in the application database.** Verify webhook signatures, make webhook handling
idempotent, and update booking status only from a trusted provider result.

### 6. Customer bookings, cancellation, and rescheduling

All customer-specific endpoints below should require authentication and enforce
ownership of the booking.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/me/bookings?status=upcoming` | List the signed-in customer's upcoming, past, or cancelled bookings. |
| `POST` | `/api/v1/bookings/{bookingId}/cancellation-quote` | Calculate cancellation eligibility, fee, and refund amount before confirmation. |
| `POST` | `/api/v1/bookings/{bookingId}/cancel` | Cancel an eligible booking and initiate any refund. |
| `POST` | `/api/v1/bookings/{bookingId}/reschedule-quote` | Check a new trip/date/seats and calculate any fare difference or fee. |
| `POST` | `/api/v1/bookings/{bookingId}/reschedule` | Confirm a reschedule against a valid new seat hold/quote. |

Return the updated booking and refund/payment state after a successful operation.
Enforce operator cancellation/reschedule policies on the server and prevent
repeated requests from charging or refunding twice.

### 7. Authentication and account

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Create an account with name, email, and password. |
| `POST` | `/api/v1/auth/login` | Authenticate and return the session/token response. |
| `POST` | `/api/v1/auth/refresh` | Refresh an expired access token if using refresh tokens. |
| `POST` | `/api/v1/auth/logout` | Revoke the current refresh token/session. |
| `POST` | `/api/v1/auth/password/forgot` | Start the password reset flow. |
| `POST` | `/api/v1/auth/password/reset` | Set a new password with a one-time reset token. |
| `GET` | `/api/v1/me` | Return the current customer's profile. |
| `GET` | `/api/v1/auth/oauth/{provider}/url` or OAuth redirect | Start Google sign-in using an OAuth provider. |

Use Spring Security, BCrypt/Argon2 password hashing, rate limits, secure
HttpOnly/SameSite cookies or a carefully managed token strategy, and generic
responses for password-reset requests. Never return password hashes.

### 8. Help and customer support

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/help/articles?query=refund` | Search help articles for the support search field. |
| `GET` | `/api/v1/help/articles/{articleId}` | Retrieve a help article. |
| `POST` | `/api/v1/support/requests` | Submit a contact request with name, email, topic, message, and optional booking reference. |

Suggested support topics: `BOOKING_CHANGES`, `PAYMENTS_REFUNDS`,
`TRAVEL_INFORMATION`, and `OTHER`. Validate and length-limit submitted content,
and return a support request reference number.

## Common API behavior

- Use JSON and consistent error responses, for example:

  ```json
  {
    "timestamp": "2026-11-04T10:38:26Z",
    "status": 409,
    "code": "SEAT_NO_LONGER_AVAILABLE",
    "message": "One or more selected seats are no longer available.",
    "details": [{ "seatId": "2A" }]
  }
  ```

- Use appropriate HTTP statuses: `400` for invalid input, `401` for missing or
  invalid authentication, `403` for forbidden actions, `404` for missing
  resources, `409` for seat/booking conflicts, and `422` for validly formed but
  ineligible business operations.
- Paginate larger lists such as bookings and help articles. Add an idempotency
  key for booking creation, payment-session creation, cancellation, and other
  operations that must not run twice.
- Avoid exposing personal details in logs. Apply authorization checks to every
  booking/ticket endpoint and rate-limit authentication and support endpoints.

## Suggested end-to-end booking flow

1. Load popular routes/city suggestions and submit a trip search.
2. Display `GET /trips` results; request fresh details and seat availability for
   the selected trip.
3. Create a temporary seat hold, collect passenger information, then request a
   fare quote.
4. Create a pending booking and a hosted payment session.
5. Confirm payment from the verified provider webhook; fetch booking status and
   show the confirmed ticket/reference.
6. Load the customer's bookings from the API; use quote-then-confirm operations
   for cancellation or rescheduling.

## Frontend configuration

When wiring the frontend, configure a public API base URL such as
`VITE_API_BASE_URL=https://api.example.com/api/v1`. Keep provider secrets,
database credentials, and signing keys only in the Spring Boot deployment
environment. Configure CORS on Spring Boot for the exact frontend origin rather
than using a wildcard with credentials.
