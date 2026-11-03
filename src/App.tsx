import { FormEvent, ReactNode, useMemo, useState } from "react"

type View = "home" | "results" | "seats" | "details" | "payment" | "confirmation" | "bookings" | "support"
interface SearchTrip {
  from: string
  to: string
  date: string
  passengers: number
}

function formatTripDate(value: string) {
  if (!value) return "Choose date"
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`))
}

function dateOffset(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

type IconName = "arrow" | "back" | "bus" | "calendar" | "card" | "check" | "chevron" | "clock" | "close" | "headset" | "location" | "lock" | "mail" | "moon" | "passengers" | "phone" | "search" | "shield" | "star" | "sun" | "swap" | "ticket" | "user" | "wifi"

interface IconProps {
  name: IconName
  size?: number
}

interface Traveler {
  first: string
  last: string
  email: string
  phone: string
}

const Icon = ({ name, size = 20 }: IconProps) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    back: (
      <>
        <path d="M19 12H5m6-6-6 6 6 6" />
      </>
    ),
    bus: (
      <>
        <path d="M6 17h12M5 17V7.5C5 5.2 6.8 4 12 4s7 1.2 7 3.5V17" />
        <path d="M5 11h14M8 8h8" />
        <circle cx="8" cy="17.5" r="1.5" />
        <circle cx="16" cy="17.5" r="1.5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    card: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19M7 15h4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    headset: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 14a2 2 0 0 1 2-2h1v7H6a2 2 0 0 1-2-2v-3ZM20 14a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2v-3ZM17 19c0 1.1-1.3 2-3 2" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    moon: <path d="M20.5 14.5A8 8 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />,
    passengers: (
      <>
        <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 20v-2.5a4 4 0 0 0-3-3.9M16 3.2a4 4 0 0 1 0 7.7" />
      </>
    ),
    phone: (
      <path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L7.1 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z" />
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    star: (
      <path d="m12 2.5 3 6 6.5 1-4.7 4.6 1.1 6.4-5.9-3.1-5.9 3.1 1.1-6.4-4.7-4.6 6.5-1 3-6Z" />
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    swap: (
      <>
        <path d="M7 7h12l-3-3M17 17H5l3 3" />
      </>
    ),
    ticket: (
      <>
        <path d="M3 7a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a3 3 0 0 0 0-6V7Z" />
        <path d="M13 5v3M13 11v2M13 16v3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    wifi: (
      <>
        <path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />
        <circle cx="12" cy="19" r=".7" fill="currentColor" stroke="none" />
      </>
    ),
  }
  return <svg {...common}>{paths[name]}</svg>
}

const initialBuses = [
  {
    id: 1,
    operator: "Velora Express",
    type: "Executive Sleeper",
    depart: "06:30",
    arrive: "17:00",
    duration: "10h 30m",
    price: 1299,
    rating: 4.9,
    reviews: 842,
    seats: 7,
    tag: "Best rated",
  },
  {
    id: 2,
    operator: "Skyline Coaches",
    type: "Luxury AC Seater",
    depart: "08:15",
    arrive: "20:25",
    duration: "12h 10m",
    price: 999,
    rating: 4.7,
    reviews: 638,
    seats: 12,
    tag: "Best value",
  },
  {
    id: 3,
    operator: "Northbound",
    type: "Premium Sleeper",
    depart: "21:00",
    arrive: "08:45",
    duration: "11h 45m",
    price: 1499,
    rating: 4.6,
    reviews: 415,
    seats: 5,
    tag: "Overnight",
  },
]

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Go to home">
      <span className="logo-mark">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            className="logo-sun"
            d="M7 23a16 16 0 0 1 27-11M9 10l4 4M20 5l1 6M4 20h6"
          />
          <path
            className="logo-bus"
            d="M10 26c0-5 4-8 12-8h14c3 0 5 2 5 5v13H10V26Z"
          />
          <path className="logo-bus-window" d="M16 23h18v7H16z" />
          <path className="logo-bus-detail" d="M12 34h27M20 38v3m14-3v3" />
          <circle className="logo-wheel" cx="17" cy="37" r="2.5" />
          <circle className="logo-wheel" cx="34" cy="37" r="2.5" />
        </svg>
      </span>
      <span>
        Route<span>ly</span>
      </span>
    </button>
  )
}

function App() {
  const [view, setView] = useState<View>("home")
  const [dark, setDark] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [sort, setSort] = useState("recommended")
  const [maxPrice, setMaxPrice] = useState(1800)
  const [busType, setBusType] = useState("All types")
  const [selectedSeats, setSelectedSeats] = useState<string[]>(["2A", "2B"])
  const [cancelled, setCancelled] = useState(false)
  const [reschedule, setReschedule] = useState(false)
  const [toast, setToast] = useState("")
  const [trip, setTrip] = useState<SearchTrip>({
    from: "Bengaluru",
    to: "Goa",
    date: dateOffset(2),
    passengers: 2,
  })
  const [traveler, setTraveler] = useState({
    first: "Aarav",
    last: "Sharma",
    email: "aarav.sharma@example.in",
    phone: "+91 98765 43210",
  })

  const buses = useMemo(
    () =>
      initialBuses.filter(
        (b) =>
          b.price <= maxPrice &&
          (busType === "All types" || b.type.includes(busType)),
      ),
    [maxPrice, busType],
  )

  const navigate = (next: View) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const searchTrips = (nextTrip = trip) => {
    if (!nextTrip.from.trim() || !nextTrip.to.trim()) {
      showToast("Enter both your starting point and destination")
      return
    }
    if (
      nextTrip.from.trim().toLowerCase() === nextTrip.to.trim().toLowerCase()
    ) {
      showToast("Choose two different cities for your journey")
      return
    }
    setTrip(nextTrip)
    setSelectedSeats(
      ["2A", "2B", "2C", "2D", "4A", "4B"].slice(0, nextTrip.passengers),
    )
    navigate("results")
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 3000)
  }

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="header">
        <div className="header-inner">
          <Logo onClick={() => navigate("home")} />
          <nav className="main-nav" aria-label="Primary navigation">
            <button
              className={view === "home" ? "active" : ""}
              onClick={() => navigate("home")}
            >
              Home
            </button>
            <button
              className={view === "bookings" ? "active" : ""}
              onClick={() => navigate("bookings")}
            >
              My bookings
            </button>
            <button
              className={view === "support" ? "active" : ""}
              onClick={() => navigate("support")}
            >
              Support
            </button>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() => setDark(!dark)}
              aria-label="Toggle color theme"
            >
              <Icon name={dark ? "sun" : "moon"} size={18} />
            </button>
            <span className="divider" />
            <button
              className="login-button"
              onClick={() => {
                setAuthMode("login")
                setAuthOpen(true)
              }}
            >
              <span className="avatar-mini">
                <Icon name="user" size={16} />
              </span>{" "}
              Log in
            </button>
            <button
              className="button compact"
              onClick={() => {
                setAuthMode("signup")
                setAuthOpen(true)
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      <main>
        {view === "home" && (
          <Home
            trip={trip}
            setTrip={setTrip}
            onSearch={searchTrips}
            onSupport={() => navigate("support")}
          />
        )}
        {view === "results" && (
          <Results
            buses={buses}
            trip={trip}
            sort={sort}
            setSort={setSort}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            busType={busType}
            setBusType={setBusType}
            onSelect={() => navigate("seats")}
            onModify={() => navigate("home")}
          />
        )}
        {view === "seats" && (
          <Seats
            trip={trip}
            selected={selectedSeats}
            setSelected={setSelectedSeats}
            onBack={() => navigate("results")}
            onContinue={() => navigate("details")}
          />
        )}
        {view === "details" && (
          <Details
            trip={trip}
            traveler={traveler}
            setTraveler={setTraveler}
            selected={selectedSeats}
            onBack={() => navigate("seats")}
            onContinue={() => navigate("payment")}
          />
        )}
        {view === "payment" && (
          <Payment
            trip={trip}
            selected={selectedSeats}
            onBack={() => navigate("details")}
            onPay={() => navigate("confirmation")}
          />
        )}
        {view === "confirmation" && (
          <Confirmation
            trip={trip}
            selected={selectedSeats}
            traveler={traveler}
            onBookings={() => navigate("bookings")}
            showToast={showToast}
          />
        )}
        {view === "bookings" && (
          <Bookings
            trip={trip}
            cancelled={cancelled}
            onCancel={() => setCancelled(true)}
            onReschedule={() => setReschedule(true)}
            onExplore={() => navigate("home")}
          />
        )}
        {view === "support" && <Support showToast={showToast} />}
      </main>

      <Footer navigate={navigate} />
      {authOpen && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setAuthOpen(false)}
          showToast={showToast}
        />
      )}
      {reschedule && (
        <RescheduleModal
          onClose={() => setReschedule(false)}
          onSave={() => {
            setReschedule(false)
            showToast("Your trip has been rescheduled")
          }}
        />
      )}
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" size={17} />
          </span>
          {toast}
        </div>
      )}
    </div>
  )
}

function Home({
  trip,
  setTrip,
  onSearch,
  onSupport,
}: {
  trip: SearchTrip
  setTrip: (trip: SearchTrip) => void
  onSearch: (trip?: SearchTrip) => void
  onSupport: () => void
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span>
                <Icon name="shield" size={15} />
              </span>{" "}
              Trusted by 2M+ travelers
            </div>
            <h1>
              The journey is yours.
              <br />
              <em>Make it unforgettable.</em>
            </h1>
            <p>
              Compare routes, choose your perfect seat, and hit the road with
              confidence. No hidden fees, ever.
            </p>
            <div className="trust-row">
              <div className="avatar-stack">
                <span>AM</span>
                <span>RK</span>
                <span>JL</span>
                <span>+2k</span>
              </div>
              <div>
                <div className="stars">
                  ★★★★★ <b>4.9</b>
                </div>
                <small>from 18,000+ happy travelers</small>
              </div>
            </div>
          </div>
          <div className="route-visual" aria-hidden="true">
            <svg className="hero-route" viewBox="0 0 540 310" fill="none">
              <path
                className="hero-route-track"
                d="M56 265C104 265 98 206 158 206S225 265 276 231 328 118 380 139s51 82 106 39"
              />
              <path
                className="hero-route-glow"
                d="M56 265C104 265 98 206 158 206S225 265 276 231 328 118 380 139s51 82 106 39"
              />
              <circle cx="56" cy="265" r="6" className="route-origin" />
              <circle cx="486" cy="178" r="7" className="route-destination" />
            </svg>
            <div className="visual-card route-mini">
              <div>
                <span className="route-dot blue" />
                <b>Bengaluru</b>
                <small>Kempegowda Bus Station</small>
              </div>
              <div className="route-line">
                <span>10h 30m</span>
              </div>
              <div>
                <span className="route-dot orange" />
                <b>Goa</b>
                <small>Panaji Bus Stand</small>
              </div>
            </div>
            <div className="bus-illustration">
              <div className="bus-top">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="bus-bottom">
                <b>ROUTELY</b>
                <div className="bus-door" />
              </div>
              <i className="wheel one" />
              <i className="wheel two" />
            </div>
            <div className="floating-badge">
              <span>
                <Icon name="check" size={15} />
              </span>
              <div>
                <b>Instant confirmation</b>
                <small>Ticket ready in seconds</small>
              </div>
            </div>
            <div className="ticket-float">
              <span className="ticket-float-mark">
                <Icon name="ticket" size={16} />
              </span>
              <span>
                <small>YOUR NEXT STOP</small>
                <b>Goa, India</b>
              </span>
              <span className="ticket-float-time">4h 45m</span>
            </div>
            <span className="destination-stamp">
              12° 58′ N<br />
              77° 35′ E
            </span>
          </div>
        </div>
        <div className="container search-wrap">
          <div className="search-card">
            <LocationField
              label="From"
              value={trip.from}
              onChange={(from) => setTrip({ ...trip, from })}
              suggestions={[
                "Bengaluru",
                "Mumbai",
                "Delhi",
                "Chennai",
                "Hyderabad",
                "Pune",
              ]}
            />
            <button
              className="swap-button"
              aria-label="Swap origin and destination"
              onClick={() => setTrip({ ...trip, from: trip.to, to: trip.from })}
            >
              <Icon name="swap" size={18} />
            </button>
            <LocationField
              label="To"
              value={trip.to}
              onChange={(to) => setTrip({ ...trip, to })}
              suggestions={[
                "Goa",
                "Jaipur",
                "Kochi",
                "Varanasi",
                "Agra",
                "Mysuru",
              ]}
            />
            <DatePickerField
              value={trip.date}
              onChange={(date) => setTrip({ ...trip, date })}
            />
            <PassengerPicker
              value={trip.passengers}
              onChange={(passengers) => setTrip({ ...trip, passengers })}
            />
            <button className="button search-cta" onClick={() => onSearch()}>
              <Icon name="search" size={19} /> Search buses
            </button>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading split">
          <div>
            <span className="kicker">POPULAR ROUTES</span>
            <h2>Where are you headed?</h2>
          </div>
          <button className="text-link" onClick={() => onSearch()}>
            Explore all routes <Icon name="arrow" size={17} />
          </button>
        </div>
        <div className="route-cards">
          <svg
            className="route-thread"
            viewBox="0 0 1200 260"
            fill="none"
            aria-hidden="true"
          >
            <path d="M22 184C170 184 154 94 310 94S453 217 596 183 757 67 875 107s167 92 303 20" />
            <circle cx="22" cy="184" r="5" />
            <circle cx="1178" cy="127" r="6" />
          </svg>
          {[
            ["Bengaluru", "Goa", "10h 30m", "₹999", "18 departures"],
            ["Mumbai", "Pune", "3h 30m", "₹499", "24 departures"],
            ["Delhi", "Agra", "3h 30m", "₹699", "16 departures"],
          ].map((r, i) => (
            <button
              className="route-card"
              key={r[1]}
              onClick={() => {
                setTrip({ ...trip, from: r[0], to: r[1] })
                onSearch({ ...trip, from: r[0], to: r[1] })
              }}
            >
              <div className={`city-art art-${i + 1}`}>
                <span className="poster-coordinates">
                  {
                    [
                      "15° 29′ N · 73° 49′ E",
                      "19° 04′ N · 72° 52′ E",
                      "27° 10′ N · 78° 02′ E",
                    ][i]
                  }
                </span>
                <b className="poster-city">{i === 1 ? r[0] : r[1]}</b>
                <span className="poster-route">
                  <Icon name="location" size={13} /> {r[0]} <i /> {r[2]}
                </span>
                <span className="poster-index">0{i + 1}</span>
              </div>
              <div className="route-card-body">
                <div className="route-names">
                  <b>{r[0]}</b>
                  <span>
                    <Icon name="arrow" size={16} />
                  </span>
                  <b>{r[1]}</b>
                </div>
                <div>
                  <span>{r[4]}</span>
                  <strong>
                    from <b>{r[3]}</b>
                  </strong>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="kicker">WHY ROUTELY</span>
            <h2>Travel better, from start to finish</h2>
            <p>We take care of the details so you can enjoy the journey.</p>
          </div>
          <div className="benefits">
            <Benefit
              icon="ticket"
              title="Book in a few clicks"
              text="Compare, choose, and book your trip in less than two minutes."
            />
            <Benefit
              icon="shield"
              title="Travel with confidence"
              text="Verified operators, secure payments, and 24/7 assistance."
            />
            <Benefit
              icon="card"
              title="No surprise fees"
              text="The price you see is the price you pay. Simple and transparent."
            />
            <Benefit
              icon="headset"
              title="Here when you need us"
              text="Real people, ready to help at any point in your journey."
              onClick={onSupport}
            />
          </div>
        </div>
      </section>
    </>
  )
}

function LocationField({
  label,
  value,
  onChange,
  suggestions,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  suggestions: string[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="search-control location-control">
      <span className="field-icon">
        <Icon name="location" size={20} />
      </span>
      <div className="location-input">
        <label htmlFor={`trip-${label.toLowerCase()}`}>{label}</label>
        <input
          id={`trip-${label.toLowerCase()}`}
          value={value}
          aria-label={label}
          placeholder={`Enter ${label.toLowerCase()} city`}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        />
        {open && (
          <div className="search-popover city-popover">
            <small>POPULAR IN INDIA</small>
            {suggestions
              .filter((city) =>
                city.toLowerCase().includes(value.toLowerCase()),
              )
              .map((city) => (
                <button
                  type="button"
                  key={city}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(city)
                    setOpen(false)
                  }}
                >
                  <Icon name="location" size={15} /> {city}
                </button>
              ))}
            {value &&
              !suggestions.some(
                (city) => city.toLowerCase() === value.toLowerCase(),
              ) && <span className="custom-city">Use “{value}”</span>}
          </div>
        )}
      </div>
    </div>
  )
}

function DatePickerField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const formatted = value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(`${value}T00:00:00`))
    : "Choose date"
  return (
    <div className="picker-wrap">
      <button
        className="search-field"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="field-icon">
          <Icon name="calendar" size={20} />
        </span>
        <span>
          <small>Departure</small>
          <b>{formatted}</b>
          <em>Choose a travel date</em>
        </span>
      </button>
      {open && (
        <div className="search-popover date-popover">
          <label>
            <small>SELECT DEPARTURE DATE</small>
            <input
              type="date"
              min={dateOffset(0)}
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          </label>
          <button className="popover-done" onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  )
}

function PassengerPicker({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="picker-wrap">
      <button
        className="search-field"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="field-icon">
          <Icon name="passengers" size={20} />
        </span>
        <span>
          <small>Passengers</small>
          <b>
            {value} {value === 1 ? "passenger" : "passengers"}
          </b>
          <em>Adults</em>
        </span>
      </button>
      {open && (
        <div className="search-popover passenger-popover">
          <div>
            <span>
              <b>Adults</b>
              <small>Ages 12+</small>
            </span>
            <div className="passenger-stepper">
              <button
                onClick={() => onChange(Math.max(1, value - 1))}
                aria-label="Remove passenger"
              >
                −
              </button>
              <b>{value}</b>
              <button
                onClick={() => onChange(Math.min(6, value + 1))}
                aria-label="Add passenger"
              >
                +
              </button>
            </div>
          </div>
          <button className="popover-done" onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  )
}

function Benefit({
  icon,
  title,
  text,
  onClick,
}: {
  icon: IconName
  title: string
  text: string
  onClick?: () => void
}) {
  return (
    <button className="benefit" onClick={onClick}>
      <span>
        <Icon name={icon} size={25} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </button>
  )
}

function TripSummary({ trip }: { trip: SearchTrip }) {
  const date = formatTripDate(trip.date)
  return (
    <div className="trip-summary">
      <div>
        <small>FROM</small>
        <b>{trip.from}</b>
        <span>Bus station</span>
      </div>
      <div className="summary-track">
        <span>06:30</span>
        <i />
        <span>10h 30m</span>
        <i />
        <span>17:00</span>
      </div>
      <div>
        <small>TO</small>
        <b>{trip.to}</b>
        <span>Bus station</span>
      </div>
      <div className="date-summary">
        <Icon name="calendar" size={18} />
        <span>
          <small>DEPARTURE</small>
          <b>{date}</b>
        </span>
      </div>
      <div className="date-summary">
        <Icon name="passengers" size={18} />
        <span>
          <small>TRAVELERS</small>
          <b>
            {trip.passengers}{" "}
            {trip.passengers === 1 ? "passenger" : "passengers"}
          </b>
        </span>
      </div>
    </div>
  )
}

function Results({
  buses,
  trip,
  sort,
  setSort,
  maxPrice,
  setMaxPrice,
  busType,
  setBusType,
  onSelect,
  onModify,
}: {
  buses: typeof initialBuses
  trip: SearchTrip
  sort: string
  setSort: (v: string) => void
  maxPrice: number
  setMaxPrice: (v: number) => void
  busType: string
  setBusType: (v: string) => void
  onSelect: () => void
  onModify: () => void
}) {
  return (
    <div className="page-bg">
      <div className="container page-pad">
        <div className="back-row">
          <button onClick={onModify}>
            <Icon name="back" size={17} /> Modify search
          </button>
        </div>
        <TripSummary trip={trip} />
        <div className="results-header">
          <div>
            <h1>
              Buses from {trip.from} to {trip.to}
            </h1>
            <p>
              {buses.length || "No"} options for {formatTripDate(trip.date)} ·{" "}
              {trip.passengers} travelers
            </p>
          </div>
          <label>
            Sort by{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="lowest">Lowest price</option>
              <option value="earliest">Earliest departure</option>
            </select>
          </label>
        </div>
        <div className="results-layout">
          <aside className="filters">
            <div className="filter-title">
              <h3>Filters</h3>
              <button
                onClick={() => {
                  setMaxPrice(1800)
                  setBusType("All types")
                }}
              >
                Reset all
              </button>
            </div>
            <div className="filter-group">
              <label>
                Price range <b>Up to ₹{maxPrice.toLocaleString("en-IN")}</b>
              </label>
              <input
                type="range"
                min="499"
                max="1800"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="range-labels">
                <span>₹499</span>
                <span>₹1,800+</span>
              </div>
            </div>
            <div className="filter-group">
              <label>Departure time</label>
              {["Early morning", "Morning", "Afternoon", "Evening"].map(
                (v, i) => (
                  <CheckRow
                    key={v}
                    label={v}
                    detail={
                      [
                        "Before 6 AM",
                        "6 AM – 12 PM",
                        "12 PM – 6 PM",
                        "After 6 PM",
                      ][i]
                    }
                  />
                ),
              )}
            </div>
            <div className="filter-group">
              <label>Bus type</label>
              {["All types", "Sleeper", "Seater"].map((v) => (
                <button
                  key={v}
                  className={`filter-chip ${busType === v ? "active" : ""}`}
                  onClick={() => setBusType(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="filter-group">
              <label>Rating</label>
              <CheckRow
                label="4.5 and above"
                detail="Top-rated trips"
                checked
              />
            </div>
          </aside>
          <div className="bus-list">
            {buses.length ? (
              buses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  trip={trip}
                  onSelect={onSelect}
                />
              ))
            ) : (
              <div className="empty-card">
                <Icon name="bus" size={40} />
                <h3>No buses match these filters</h3>
                <p>Try increasing your price range or changing the bus type.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckRow({
  label,
  detail,
  checked = false,
}: {
  label: string
  detail: string
  checked?: boolean
}) {
  return (
    <label className="check-row">
      <input type="checkbox" defaultChecked={checked} />
      <span>
        <b>{label}</b>
        <small>{detail}</small>
      </span>
    </label>
  )
}

function BusCard({
  bus,
  trip,
  onSelect,
}: {
  bus: typeof initialBuses[number]
  trip: SearchTrip
  onSelect: () => void
}) {
  return (
    <article className="bus-card">
      <div className="bus-card-top">
        <div className="operator">
          <span>
            <Icon name="bus" size={23} />
          </span>
          <div>
            <h3>{bus.operator}</h3>
            <p>
              {bus.type} · VB {202 + bus.id}
            </p>
          </div>
        </div>
        <div className="bus-tag">{bus.tag}</div>
      </div>
      <div className="schedule">
        <div>
          <b>{bus.depart}</b>
          <span>{trip.from}</span>
          <small>Main bus terminal</small>
        </div>
        <div className="journey-line">
          <span>{bus.duration}</span>
          <i>
            <em />
          </i>
          <small>Direct</small>
        </div>
        <div className="right">
          <b>{bus.arrive}</b>
          <span>{trip.to}</span>
          <small>Main bus terminal</small>
        </div>
      </div>
      <div className="amenities">
        <span>
          <Icon name="wifi" size={16} /> Wi-Fi
        </span>
        <span>USB charging</span>
        <span>Extra legroom</span>
        <span className="rating">
          <Icon name="star" size={14} /> {bus.rating} <em>({bus.reviews})</em>
        </span>
      </div>
      <div className="bus-card-bottom">
        <span className="seats-left">{bus.seats} seats left</span>
        <div className="price">
          <small>from</small>
          <b>₹{bus.price.toLocaleString("en-IN")}</b>
          <span>/ person</span>
        </div>
        <button className="button" onClick={onSelect}>
          Select seats <Icon name="arrow" size={17} />
        </button>
      </div>
    </article>
  )
}

function Stepper({ active }: { active: number }) {
  return (
    <div className="stepper">
      {["Seats", "Details", "Payment"].map((s, i) => (
        <div className={i <= active ? "active" : ""} key={s}>
          <span>{i < active ? <Icon name="check" size={14} /> : i + 1}</span>
          <b>{s}</b>
          {i < 2 && <i />}
        </div>
      ))}
    </div>
  )
}

function Seats({
  trip,
  selected,
  setSelected,
  onBack,
  onContinue,
}: {
  trip: SearchTrip
  selected: string[]
  setSelected: (v: string[]) => void
  onBack: () => void
  onContinue: () => void
}) {
  const occupied = ["1B", "1C", "3A", "3D", "5B", "6C", "7A", "8D"]
  const rows = Array.from({ length: 9 }, (_, i) => i + 1)
  const toggle = (seat: string) => {
    if (occupied.includes(seat)) return
    setSelected(
      selected.includes(seat)
        ? selected.filter((s) => s !== seat)
        : selected.length < 4
          ? [...selected, seat]
          : selected,
    )
  }
  return (
    <div className="page-bg">
      <div className="container booking-page">
        <button className="back-link" onClick={onBack}>
          <Icon name="back" size={17} /> Back to results
        </button>
        <Stepper active={0} />
        <div className="booking-title">
          <span className="kicker">VELORA EXPRESS · VB 203</span>
          <h1>Choose your seats</h1>
          <p>
            {trip.from} to {trip.to} · {formatTripDate(trip.date)} · 06:30
          </p>
        </div>
        <div className="booking-layout">
          <div className="seat-card">
            <div className="seat-legend">
              <span>
                <i className="seat-demo available" />
                Available
              </span>
              <span>
                <i className="seat-demo chosen" />
                Selected
              </span>
              <span>
                <i className="seat-demo occupied" />
                Occupied
              </span>
            </div>
            <div className="bus-shell">
              <div className="driver">
                <span>Front</span>
                <i>◯</i>
              </div>
              <div className="seat-grid">
                {rows.map((row) => (
                  <div className="seat-row" key={row}>
                    {["A", "B"].map((l) => (
                      <Seat
                        key={l}
                        id={`${row}${l}`}
                        selected={selected}
                        occupied={occupied}
                        toggle={toggle}
                      />
                    ))}
                    <span className="row-number">{row}</span>
                    {["C", "D"].map((l) => (
                      <Seat
                        key={l}
                        id={`${row}${l}`}
                        selected={selected}
                        occupied={occupied}
                        toggle={toggle}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <OrderCard
            trip={trip}
            passengers={trip.passengers}
            selected={selected}
            buttonText="Continue to details"
            onContinue={onContinue}
          />
        </div>
      </div>
    </div>
  )
}

function Seat({
  id,
  selected,
  occupied,
  toggle,
}: {
  id: string
  selected: string[]
  occupied: string[]
  toggle: (id: string) => void
}) {
  const status = occupied.includes(id)
    ? "occupied"
    : selected.includes(id)
      ? "chosen"
      : "available"
  return (
    <button
      aria-label={`Seat ${id}, ${status}`}
      className={`seat ${status}`}
      onClick={() => toggle(id)}
      disabled={status === "occupied"}
    >
      {selected.includes(id) ? <Icon name="check" size={15} /> : id}
    </button>
  )
}

function OrderCard({
  trip,
  passengers,
  selected,
  buttonText,
  onContinue,
  payment = false,
}: {
  trip: SearchTrip
  passengers: number
  selected: string[]
  buttonText: string
  onContinue: () => void
  payment?: boolean
}) {
  const subtotal = selected.length * 1299
  const fee = 49
  return (
    <aside className="order-card">
      <h3>Trip summary</h3>
      <div className="order-route">
        <span className="route-dot blue" />
        <div>
          <b>06:30 · {trip.from}</b>
          <small>Bus station</small>
        </div>
        <i />
        <span className="route-dot orange" />
        <div>
          <b>17:00 · {trip.to}</b>
          <small>Bus station</small>
        </div>
      </div>
      <div className="order-meta">
        <span>
          <Icon name="calendar" size={17} /> {formatTripDate(trip.date)}
        </span>
        <span>
          <Icon name="clock" size={17} /> 10h 30m · Direct
        </span>
        <span>
          <Icon name="bus" size={17} /> Velora Express
        </span>
      </div>
      <div className="price-lines">
        <div>
          <span>
            {selected.length || passengers} × Adult seat{" "}
            {selected.length ? `(${selected.join(", ")})` : ""}
          </span>
          <b>₹{subtotal.toLocaleString("en-IN")}</b>
        </div>
        <div>
          <span>Booking fee</span>
          <b>₹{fee}</b>
        </div>
        <div className="total">
          <span>Total</span>
          <b>₹{(subtotal + fee).toLocaleString("en-IN")}</b>
        </div>
      </div>
      <button
        className="button full"
        disabled={!selected.length}
        onClick={onContinue}
      >
        {payment && <Icon name="lock" size={16} />}
        {buttonText}
        <Icon name="arrow" size={17} />
      </button>
      <p className="secure-note">
        <Icon name="shield" size={15} /> Secure booking · Free cancellation for
        1 hour
      </p>
    </aside>
  )
}

function Details({
  trip,
  traveler,
  setTraveler,
  selected,
  onBack,
  onContinue,
}: {
  trip: SearchTrip
  traveler: Traveler
  setTraveler: (v: typeof traveler) => void
  selected: string[]
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="page-bg">
      <div className="container booking-page">
        <button className="back-link" onClick={onBack}>
          <Icon name="back" size={17} /> Back to seats
        </button>
        <Stepper active={1} />
        <div className="booking-title">
          <h1>Passenger details</h1>
          <p>
            Please enter the traveler information exactly as shown on their ID.
          </p>
        </div>
        <div className="booking-layout">
          <div className="form-card">
            <div className="form-section-title">
              <span>1</span>
              <div>
                <h3>Primary passenger</h3>
                <p>Seat {selected[0] || "—"} · Adult</p>
              </div>
            </div>
            <div className="form-grid">
              <Field
                label="First name"
                value={traveler.first}
                onChange={(v) => setTraveler({ ...traveler, first: v })}
              />
              <Field
                label="Last name"
                value={traveler.last}
                onChange={(v) => setTraveler({ ...traveler, last: v })}
              />
              <Field
                label="Email address"
                value={traveler.email}
                type="email"
                onChange={(v) => setTraveler({ ...traveler, email: v })}
              />
              <Field
                label="Phone number"
                value={traveler.phone}
                type="tel"
                onChange={(v) => setTraveler({ ...traveler, phone: v })}
              />
            </div>
            {selected.length > 1 && (
              <>
                <div className="form-divider" />
                <div className="form-section-title">
                  <span>2</span>
                  <div>
                    <h3>Second passenger</h3>
                    <p>Seat {selected[1]} · Adult</p>
                  </div>
                </div>
                <div className="form-grid">
                  <Field
                    label="First name"
                    value=""
                    placeholder="Enter first name"
                  />
                  <Field
                    label="Last name"
                    value=""
                    placeholder="Enter last name"
                  />
                </div>
              </>
            )}
            <label className="check-row consent">
              <input type="checkbox" defaultChecked />
              <span>
                <b>Send trip updates by SMS</b>
                <small>
                  Get departure reminders and important service alerts.
                </small>
              </span>
            </label>
          </div>
          <OrderCard
            trip={trip}
            passengers={trip.passengers}
            selected={selected}
            buttonText="Continue to payment"
            onContinue={onContinue}
          />
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string
  value: string
  placeholder?: string
  type?: string
  onChange?: (v: string) => void
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        type={type}
        value={onChange ? value : undefined}
        defaultValue={onChange ? undefined : value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  )
}

function Payment({
  trip,
  selected,
  onBack,
  onPay,
}: {
  trip: SearchTrip
  selected: string[]
  onBack: () => void
  onPay: () => void
}) {
  const [method, setMethod] = useState("card")
  return (
    <div className="page-bg">
      <div className="container booking-page">
        <button className="back-link" onClick={onBack}>
          <Icon name="back" size={17} /> Back to details
        </button>
        <Stepper active={2} />
        <div className="booking-title">
          <h1>Secure payment</h1>
          <p>Your payment details are encrypted and processed securely.</p>
        </div>
        <div className="booking-layout">
          <div className="form-card">
            <div className="payment-tabs">
              <button
                className={method === "card" ? "active" : ""}
                onClick={() => setMethod("card")}
              >
                <Icon name="card" size={20} /> Credit card
              </button>
              <button
                className={method === "wallet" ? "active" : ""}
                onClick={() => setMethod("wallet")}
              >
                UPI / wallet
              </button>
            </div>
            {method === "card" ? (
              <>
                <Field
                  label="Cardholder name"
                  value=""
                  placeholder="Name as it appears on card"
                />
                <label className="form-field full-field">
                  <span>Card number</span>
                  <div className="input-with-icon">
                    <input
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                    />
                    <Icon name="card" size={20} />
                  </div>
                </label>
                <div className="form-grid">
                  <Field label="Expiry date" value="" placeholder="MM / YY" />
                  <Field label="Security code" value="" placeholder="CVC" />
                </div>
                <label className="check-row consent">
                  <input type="checkbox" />
                  <span>
                    <b>Save this card for future bookings</b>
                    <small>Your card details are stored securely.</small>
                  </span>
                </label>
              </>
            ) : (
              <div className="wallet-box">
                <Icon name="phone" size={32} />
                <h3>Pay with UPI or your wallet</h3>
                <p>
                  Choose UPI, Google Pay, PhonePe, or Paytm for quick checkout.
                </p>
                <button className="wallet-button">Choose wallet</button>
              </div>
            )}
            <div className="payment-security">
              <Icon name="lock" size={20} />
              <div>
                <b>Your payment is protected</b>
                <span>256-bit SSL encryption · PCI DSS compliant</span>
              </div>
            </div>
          </div>
          <OrderCard
            trip={trip}
            passengers={trip.passengers}
            selected={selected}
            buttonText={`Pay ₹${(selected.length * 1299 + 49).toLocaleString("en-IN")}`}
            onContinue={onPay}
            payment
          />
        </div>
      </div>
    </div>
  )
}

function Confirmation({
  trip,
  selected,
  traveler,
  onBookings,
  showToast,
}: {
  trip: SearchTrip
  selected: string[]
  traveler: Pick<Traveler, "first" | "email">
  onBookings: () => void
  showToast: (s: string) => void
}) {
  return (
    <div className="page-bg confirmation-page">
      <div className="container narrow">
        <div className="success-mark">
          <Icon name="check" size={35} />
        </div>
        <span className="kicker">BOOKING CONFIRMED</span>
        <h1>You’re all set, {traveler.first}!</h1>
        <p>
          Your ticket is on its way to <b>{traveler.email}</b>. We can’t wait to
          have you on board.
        </p>
        <article className="ticket-card">
          <div className="ticket-head">
            <Logo onClick={() => {}} />
            <div>
              <span>BOOKING REFERENCE</span>
              <b>RTY-84Q2L9</b>
            </div>
          </div>
          <div className="ticket-body">
            <div className="ticket-route">
              <div>
                <small>DEPARTURE</small>
                <b>07:30</b>
                <span>{trip.from}</span>
                <em>Bus terminal</em>
              </div>
              <div className="ticket-journey">
                <Icon name="bus" size={19} />
                <i />
                <span>4h 45m · Direct</span>
              </div>
              <div className="right">
                <small>ARRIVAL</small>
                <b>12:15</b>
                <span>{trip.to}</span>
                <em>Bus terminal</em>
              </div>
            </div>
            <div className="ticket-details">
              <div>
                <small>DATE</small>
                <b>{formatTripDate(trip.date)}</b>
              </div>
              <div>
                <small>PASSENGERS</small>
                <b>{selected.length} Adults</b>
              </div>
              <div>
                <small>SEATS</small>
                <b>{selected.join(", ")}</b>
              </div>
              <div>
                <small>COACH</small>
                <b>VB 203</b>
              </div>
            </div>
          </div>
          <div className="ticket-cut">
            <span />
            <span />
          </div>
          <div className="ticket-foot">
            <div className="qr" aria-label="Ticket QR code">
              {Array.from({ length: 49 }, (_, i) => (
                <i key={i} className={(i * 7 + i * i) % 5 < 2 ? "dark" : ""} />
              ))}
            </div>
            <div>
              <b>Scan to board</b>
              <span>Have this QR code ready when boarding.</span>
            </div>
            <div className="paid">
              <small>PAID</small>
              <b>₹{(selected.length * 1299 + 49).toLocaleString("en-IN")}</b>
            </div>
          </div>
        </article>
        <div className="confirmation-actions">
          <button
            className="button"
            onClick={() => showToast("Ticket downloaded successfully")}
          >
            Download ticket
          </button>
          <button className="button secondary" onClick={onBookings}>
            View my bookings
          </button>
        </div>
        <div className="notice">
          <Icon name="mail" size={20} />
          <div>
            <b>Check your inbox</b>
            <span>
              We sent your ticket and trip details to {traveler.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Bookings({
  trip,
  cancelled,
  onCancel,
  onReschedule,
  onExplore,
}: {
  trip: SearchTrip
  cancelled: boolean
  onCancel: () => void
  onReschedule: () => void
  onExplore: () => void
}) {
  return (
    <div className="page-bg">
      <div className="container page-pad bookings">
        <div className="page-title">
          <div>
            <span className="kicker">YOUR TRIPS</span>
            <h1>My bookings</h1>
            <p>Manage your upcoming and past journeys.</p>
          </div>
          <button className="button" onClick={onExplore}>
            Book a new trip
          </button>
        </div>
        <div className="tab-row">
          <button className="active">
            Upcoming <span>{cancelled ? 0 : 1}</span>
          </button>
          <button>
            Past <span>2</span>
          </button>
          <button>
            Cancelled <span>{cancelled ? 1 : 0}</span>
          </button>
        </div>
        {!cancelled ? (
          <article className="booking-item">
            <div className="booking-item-head">
              <div>
                <span className="status-pill">UPCOMING</span>
                <b>{formatTripDate(trip.date)}</b>
              </div>
              <span>
                Booking <b>RTY-84Q2L9</b>
              </span>
            </div>
            <div className="booking-item-body">
              <div className="operator">
                <span>
                  <Icon name="bus" size={24} />
                </span>
                <div>
                  <h3>Velora Express</h3>
                  <p>Executive Sleeper · VB 203</p>
                </div>
              </div>
              <div className="mini-route">
                <div>
                  <b>06:30</b>
                  <span>{trip.from}</span>
                </div>
                <i>
                  <em />
                </i>
                <small>10h 30m</small>
                <div>
                  <b>17:00</b>
                  <span>{trip.to}</span>
                </div>
              </div>
              <div className="seat-info">
                <small>SEATS</small>
                <b>2A, 2B</b>
              </div>
            </div>
            <div className="booking-item-foot">
              <button className="text-link">
                <Icon name="ticket" size={17} /> View ticket
              </button>
              <div>
                <button className="subtle-button" onClick={onReschedule}>
                  Reschedule
                </button>
                <button className="danger-button" onClick={onCancel}>
                  Cancel trip
                </button>
              </div>
            </div>
          </article>
        ) : (
          <div className="empty-card">
            <Icon name="calendar" size={42} />
            <h3>No upcoming journeys</h3>
            <p>When you book a trip, you’ll find all the details here.</p>
            <button className="button" onClick={onExplore}>
              Find a bus
            </button>
          </div>
        )}
        <div className="help-strip">
          <span>
            <Icon name="headset" size={24} />
          </span>
          <div>
            <b>Need help with a booking?</b>
            <p>Our support team is available around the clock.</p>
          </div>
          <button className="text-link">
            Contact support <Icon name="arrow" size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Support({ showToast }: { showToast: (s: string) => void }) {
  const [topic, setTopic] = useState("Booking changes")
  const submit = (e: FormEvent) => {
    e.preventDefault()
    showToast("Message sent — we’ll be in touch soon")
  }
  return (
    <div className="page-bg support-page">
      <section className="support-hero">
        <div className="container">
          <span className="kicker">ROUTELY SUPPORT</span>
          <h1>How can we help?</h1>
          <p>
            Find a quick answer or get in touch with our friendly support team.
          </p>
          <div className="help-search">
            <Icon name="search" size={21} />
            <input placeholder="Search help articles..." />
            <span>⌘ K</span>
          </div>
        </div>
      </section>
      <div className="container support-content">
        <div className="support-options">
          <button>
            <span>
              <Icon name="ticket" size={23} />
            </span>
            <div>
              <b>Manage a booking</b>
              <small>Change, cancel, or find your ticket</small>
            </div>
            <Icon name="chevron" size={18} />
          </button>
          <button>
            <span>
              <Icon name="card" size={23} />
            </span>
            <div>
              <b>Payments & refunds</b>
              <small>Charges, payment methods, and refunds</small>
            </div>
            <Icon name="chevron" size={18} />
          </button>
          <button>
            <span>
              <Icon name="bus" size={23} />
            </span>
            <div>
              <b>Travel information</b>
              <small>Luggage, boarding, and amenities</small>
            </div>
            <Icon name="chevron" size={18} />
          </button>
        </div>
        <div className="contact-grid">
          <div>
            <span className="kicker">CONTACT US</span>
            <h2>Still need a hand?</h2>
            <p>
              Send us a note and our team will get back to you within 2 hours.
            </p>
            <div className="contact-method">
              <span>
                <Icon name="phone" size={20} />
              </span>
              <div>
                <small>CALL US</small>
                <b>+91 80 4567 8900</b>
                <em>Available 24/7</em>
              </div>
            </div>
            <div className="contact-method">
              <span>
                <Icon name="mail" size={20} />
              </span>
              <div>
                <small>EMAIL US</small>
                <b>hello@routely.com</b>
                <em>Replies within 2 hours</em>
              </div>
            </div>
          </div>
          <form className="form-card contact-form" onSubmit={submit}>
            <div className="form-grid">
              <Field label="Your name" value="" placeholder="Aarav Sharma" />
              <Field
                label="Email address"
                value=""
                placeholder="you@example.in"
                type="email"
              />
            </div>
            <label className="form-field">
              <span>What can we help with?</span>
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option>Booking changes</option>
                <option>Payments & refunds</option>
                <option>Travel information</option>
                <option>Something else</option>
              </select>
            </label>
            <label className="form-field">
              <span>Message</span>
              <textarea
                placeholder="Tell us what happened and how we can help..."
                rows={5}
              />
            </label>
            <button className="button full" type="submit">
              Send message <Icon name="arrow" size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function AuthModal({
  mode,
  setMode,
  onClose,
  showToast,
}: {
  mode: "login" | "signup"
  setMode: (m: "login" | "signup") => void
  onClose: () => void
  showToast: (s: string) => void
}) {
  const submit = (e: FormEvent) => {
    e.preventDefault()
    onClose()
    showToast(
      mode === "login"
        ? "Welcome back to Routely"
        : "Your Routely account is ready",
    )
  }
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal auth-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
        <Logo onClick={() => {}} />
        <span className="kicker">
          {mode === "login" ? "WELCOME BACK" : "JOIN ROUTELY"}
        </span>
        <h2>
          {mode === "login" ? "Log in to your account" : "Create your account"}
        </h2>
        <p>
          {mode === "login"
            ? "Your trips, tickets, and travel preferences in one place."
            : "Book faster and keep every journey organized."}
        </p>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <Field label="Full name" value="" placeholder="Aarav Sharma" />
          )}
          <Field
            label="Email address"
            value=""
            placeholder="you@example.com"
            type="email"
          />
          <Field
            label="Password"
            value=""
            placeholder="At least 8 characters"
            type="password"
          />
          {mode === "login" && (
            <button type="button" className="forgot">
              Forgot password?
            </button>
          )}
          <button className="button full" type="submit">
            {mode === "login" ? "Log in" : "Create account"}{" "}
            <Icon name="arrow" size={17} />
          </button>
        </form>
        <div className="auth-divider">
          <span>or continue with</span>
        </div>
        <button className="social-button">G&nbsp;&nbsp; Google</button>
        <p className="switch-auth">
          {mode === "login" ? "New to Routely?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  )
}

function RescheduleModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: () => void
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal small-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
        <span className="modal-icon">
          <Icon name="calendar" size={25} />
        </span>
        <h2>Reschedule your trip</h2>
        <p>
          Choose a new departure date. We’ll show any fare difference before
          confirming.
        </p>
        <Field label="New departure date" type="date" value="2025-06-27" />
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>
            Keep current trip
          </button>
          <button className="button" onClick={onSave}>
            Find new times
          </button>
        </div>
      </div>
    </div>
  )
}

function Footer({ navigate }: { navigate: (v: View) => void }) {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo onClick={() => navigate("home")} />
          <p>Beautifully simple bus travel, wherever the road takes you.</p>
        </div>
        <div>
          <b>Travel</b>
          <button onClick={() => navigate("home")}>Search buses</button>
          <button onClick={() => navigate("bookings")}>My bookings</button>
          <button>Popular routes</button>
        </div>
        <div>
          <b>Support</b>
          <button onClick={() => navigate("support")}>Help center</button>
          <button onClick={() => navigate("support")}>Contact us</button>
          <button>Travel policies</button>
        </div>
        <div>
          <b>Company</b>
          <button>About Routely</button>
          <button>Careers</button>
          <button>For operators</button>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Routely, Inc.</span>
        <span className="india-note">
          <span>🇮🇳</span> Made in India, for every journey
        </span>
        <div>
          <button>Privacy</button>
          <button>Terms</button>
          <button>Accessibility</button>
        </div>
      </div>
    </footer>
  )
}

export default App
