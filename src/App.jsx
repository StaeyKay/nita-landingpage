import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  FileArchive,
  FileCheck2,
  FileText,
  Files,
  Fuel,
  Gauge,
  Grid2X2,
  HeartPulse,
  Laptop,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  Moon,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sun,
  UserRound,
  Users,
  WalletCards,
  Droplets,
  Wind,
  X,
} from "lucide-react";
import { HeroImage, Logoo } from "./assets";
import { getAccraWeather } from "./services/weather";

const modules = [
  {
    name: "eMail",
    detail: "Official email & inbox",
    icon: Mail,
    badge: "12 new",
  },
  {
    name: "Calendar",
    detail: "Meetings & schedule",
    icon: CalendarDays,
    badge: "3 today",
  },
  {
    name: "Correspondence",
    detail: "Letters & official mail",
    icon: FileText,
    badge: "",
  },
  {
    name: "Memo & Dispatch",
    detail: "Memos & outgoing mail",
    icon: Send,
    badge: "2 pending",
  },
  {
    name: "My Approvals",
    detail: "Items awaiting your review",
    icon: FileCheck2,
    badge: "4 to review",
  },
  {
    name: "Shared Files",
    detail: "Team files & folders",
    icon: Files,
    badge: "",
  },
  {
    name: "Circulars",
    detail: "Official notices & updates",
    icon: FileArchive,
    badge: "New",
  },
  {
    name: "Staff Directory",
    detail: "Find a colleague",
    icon: Users,
    badge: "",
  },
  {
    name: "Enterprise Search",
    detail: "Search across your workplace",
    icon: Search,
    badge: "",
  },
];
const requests = [
  { name: "IT HelpDesk", description: "Tech Support", icon: Laptop },
  { name: "Funds Request", description: "Disbursement", icon: WalletCards },
  { name: "eLeave", description: "18 Days Left", icon: CalendarDays },
  { name: "Imprest", description: "Petty Cash", icon: BriefcaseBusiness },
  {
    name: "Stores / Supply",
    description: "Stationery & Hardware",
    icon: ShoppingBag,
  },
  { name: "Vehicle Request", description: "Transport Pool", icon: Activity },
  { name: "Medicals", description: "Health Scheme", icon: HeartPulse },
  { name: "Fuel Coupon", description: "Logistics", icon: Fuel },
  { name: "Reimburse", description: "Expense Claim", icon: ArrowDownToLine },
];
const docs = [
  {
    title: "NITA National Cloud Security Policy v3.2.pdf",
    meta: "PDF · 2.4 MB",
    dept: "NITA Cyber Security Directorate",
    time: "Updated 35 min ago",
    tone: "red",
  },
  {
    title: "Digital Ghana 2025–2030 Roadmap Briefing.docx",
    meta: "DOCX · 1.1 MB",
    dept: "Ministry of Communication & Digitalisation",
    time: "Updated today",
    tone: "green",
  },
  {
    title: "Civil Service Standard Operating Procedure.pdf",
    meta: "PDF · 4.8 MB",
    dept: "Data Protection Commission",
    time: "Updated 2 days ago",
    tone: "red",
  },
];
const links = [
  "Gov.gh National Portal",
  "Ghana Meteorological Agency",
  "Data Protection Commission",
  "Cyber Security Authority",
  "Public Services Commission",
  "National Identification Authority",
];
const activities = [
  {
    date: "14",
    month: "OCT",
    title: "National Cyber Security Awareness Month Workshop",
    detail: "Accra Digital Centre · 09:00 GMT",
  },
  {
    date: "18",
    month: "OCT",
    title: "All-Staff MDA Quarterly Townhall",
    detail: "Virtual / GovMeet Room · 14:00 GMT",
  },
  {
    date: "22",
    month: "OCT",
    title: "Workshop: Implementing the Data Protection Act",
    detail: "NITA Training Hall · 10:00 GMT",
  },
];

function App() {
  const [activeNav, setActiveNav] = useState("Home");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Files (18)");
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [localClock, setLocalClock] = useState(() => new Date());

  useEffect(() => {
    const controller = new AbortController();
    const loadWeather = async () => {
      try {
        const currentWeather = await getAccraWeather(controller.signal);
        setWeather(currentWeather);
        setWeatherError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setWeatherError("Live weather is temporarily unavailable.");
        }
      }
    };

    void loadWeather();
    const refreshInterval = window.setInterval(() => void loadWeather(), 15 * 60 * 1000);
    return () => {
      controller.abort();
      window.clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    const clockInterval = window.setInterval(() => setLocalClock(new Date()), 60 * 1000);
    return () => window.clearInterval(clockInterval);
  }, []);

  const weatherIcon = !weather
    ? Cloud
    : weather.code === 0
      ? weather.isDay
        ? Sun
        : Moon
      : weather.code <= 2
        ? weather.isDay
          ? CloudSun
          : CloudMoon
        : weather.code === 3
          ? Cloud
          : weather.code <= 48
            ? CloudFog
            : weather.code <= 57
              ? CloudDrizzle
              : weather.code <= 67 || (weather.code >= 80 && weather.code <= 82)
                ? CloudRain
                : weather.code <= 86
                  ? CloudSnow
                  : CloudLightning;
  const WeatherIcon = weatherIcon;
  const localTime = weather
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: weather.timezone,
      }).format(localClock)
    : "";

  const visibleDocs = docs.filter((d) =>
    `${d.title} ${d.dept}`.toLowerCase().includes(search.toLowerCase()),
  );
  const toast = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const navItems = [
    "Home",
    "Modules & Services",
    "Workflow Center",
    "Document Hub",
    "Calendar & Events",
    "Agency Directory",
  ];

  return (
    <div className="min-h-screen bg-[#f1f8f3] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-[#dcefe2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-5 px-5 lg:px-9">
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={21} />
          </button>
          <a href="#home" className="flex shrink-0 items-center gap-3">
            <img
              src={Logoo}
              alt="NITA Ghana"
              className="h-10 w-[108px] object-contain object-left"
            />
            <span className="hidden border-l border-slate-200 pl-3 sm:block">
              <span className="block text-[15px] font-bold leading-tight text-slate-900">
                Smart Workplace
              </span>
              <span className="text-[10px] text-slate-500">
                Republic of Ghana · National IT Agency
              </span>
            </span>
          </a>
          <div className="relative ml-auto hidden max-w-[480px] flex-1 md:block">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search approvals, memos, staff, documents, circulars…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-[13px] outline-none transition focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-50"
            />
          </div>
          <button
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-green-50 hover:text-nita"
            onClick={() => toast("You’re all caught up on notifications.")}
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-white bg-rose-500" />
          </button>
          <div className="relative ml-1 border-l border-slate-200 pl-4">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f6ed] text-sm font-bold text-[#21A652]">
                KM
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold text-slate-800">
                  Kow Mensah
                </span>
                <span className="block text-[10px] text-slate-500">
                  Principal IT Officer
                </span>
              </span>
              <ChevronDown
                size={14}
                className="hidden text-slate-400 sm:block"
              />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-14 w-52 rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
                <button
                  onClick={() => toast("Profile settings are ready.")}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50"
                >
                  <UserRound size={16} /> My profile
                </button>
                <button
                  onClick={() => toast("Signed out successfully.")}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
        <nav
          className={`${mobileMenu ? "flex" : "hidden"} border-t border-slate-100 bg-white px-5 py-2 lg:flex`}
        >
          <div className="mx-auto flex max-w-[1440px] flex-wrap gap-1">
            {navItems.map((item, i) => (
              <a
                key={item}
                href={
                  [
                    "#home",
                    "#modules",
                    "#requests",
                    "#documents",
                    "#calendar",
                    "#links",
                  ][i]
                }
                onClick={() => {
                  setActiveNav(item);
                  setMobileMenu(false);
                }}
                className={`rounded-lg px-3.5 py-2 text-[12px] font-medium transition ${activeNav === item ? "bg-[#e5f5ea] text-[#21A652]" : "text-slate-500 hover:bg-[#f1f8f3] hover:text-slate-800"}`}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
        <div className="hidden items-center justify-between bg-[#eaf6ee] px-5 py-2 text-[10px] sm:flex lg:px-9">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 font-semibold text-[#21A652]">
              <span className="h-1.5 w-1.5 rounded-full bg-nita" /> LIVE GOVNET
              GRID
            </span>
            <span className="text-slate-500">
              NITA Service Status:{" "}
              <b className="font-semibold text-slate-700">
                All core systems operational
              </b>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={12} className="text-nita" /> PKI Level-3
              Authenticated Session
            </span>
            <span className="border-l border-slate-200 pl-4">
              <Cloud size={12} className="mr-1 inline text-nita" />
              Accra Data Centre · Tier III
            </span>
          </div>
        </div>
      </header>

      <main
        id="home"
        className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 lg:px-9 lg:pt-8"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dcefe2] bg-white px-5 py-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={Logoo}
              alt="NITA"
              className="hidden h-10 w-[100px] object-contain object-left sm:block"
            />
            <div className="sm:border-l sm:border-slate-200 sm:pl-4">
              <div className="mb-0.5 flex items-center gap-2">
                <span className="rounded bg-[#e8f6ed] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#21A652]">
                  Republic of Ghana
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Office of the Head of Civil Service
                </span>
              </div>
              <h1 className="font-barlow text-lg font-bold tracking-tight text-slate-800">
                Smart Workplace Administrative Workspace
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedRequest("Service Request");
                document
                  .getElementById("requests")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#21A652] px-3.5 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#188844]"
            >
              <span className="text-sm">＋</span> New Service Request
            </button>
            <button
              onClick={() => toast("Standard Operating Procedures opened.")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              <FileText size={13} /> SOP Directives
            </button>
          </div>
        </div>

        <section className="hero relative isolate mb-6 flex min-h-[270px] items-end overflow-hidden rounded-2xl bg-slate-900 px-6 py-7 shadow-md sm:min-h-[300px] sm:px-10 sm:py-9 lg:min-h-[340px] lg:px-12 lg:py-10">
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${HeroImage})` }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#081c17]/80 via-[#081c17]/55 to-[#081c17]/20" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071a15]/40 to-transparent" />
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#21A652]" /> Your
              connected public service
            </span>
            <h2 className="font-barlow text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl">
              NITA Smart
              <br className="hidden sm:block" /> Workplace
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/80 sm:text-[15px]">
              A simpler way to connect with your colleagues, manage daily work
              and get things done across the public service.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  setSelectedRequest("Service Request");
                  document
                    .getElementById("requests")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#21A652] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-[#188844]"
              >
                <span className="text-sm">⊕</span> New Service Request
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("modules")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Grid2X2 size={15} /> Launch Workspace
              </button>
            </div>
          </div>
          <div className="absolute bottom-5 right-6 hidden items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 text-[10px] font-medium text-white/90 backdrop-blur sm:flex">
            <ShieldCheck size={13} className="text-[#21A652]" /> Secure ·
            Connected · Ready
          </div>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Pending Approvals",
              value: "3",
              sub: "Requires action",
              color: "green",
              icon: Clock3,
            },
            {
              label: "Active Workflows",
              value: "7",
              sub: "In progress",
              color: "green",
              icon: Activity,
            },
            {
              label: "Assigned to Me",
              value: "5",
              sub: "Due this week",
              color: "green",
              icon: UserRound,
            },
            {
              label: "Completed (Month)",
              value: "24",
              sub: "Great work",
              color: "green",
              icon: Check,
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`stat-card stat-${s.color} rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[.08em] text-slate-500">
                  {s.label}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e8f6ed] text-[#21A652]">
                  <s.icon size={15} />
                </span>
              </div>
              <div className="mt-1 flex items-end justify-between">
                <strong className="font-barlow text-3xl font-bold leading-none text-slate-800">
                  {s.value}
                </strong>
                <span className="mb-0.5 text-[10px] font-medium text-slate-500">
                  {s.sub}
                </span>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            <section id="modules" className="panel p-4 sm:p-5">
              <div className="section-head">
                <div>
                  <span className="section-kicker text-[#21A652]">YOUR WORKPLACE</span>
                  <h2 className="section-title">
                    <span className="title-dot bg-[#21A652]" /> Corporate
                    Workspace
                  </h2>
                </div>
                <span className="hidden rounded-full bg-[#e8f6ed] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#21A652] sm:block">
                  9 core modules
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {modules.map((m) => (
                  <button
                    onClick={() => toast(`${m.name} is ready to open.`)}
                    key={m.name}
                    className="module-card group flex min-h-[83px] items-center gap-3 rounded-xl border border-[#dcefe2] border-l-2 border-l-[#21A652] bg-[#f3faf5] p-3 text-left transition hover:-translate-y-0.5 hover:border-[#21A652] hover:bg-[#e8f6ed] hover:shadow-sm"
                  >
                    <span className="module-icon border border-[#dcefe2] bg-white text-[#21A652] shadow-sm">
                      <m.icon size={25} strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-1">
                        <b className="text-[13px] font-bold text-slate-800">
                          {m.name}
                        </b>
                        {m.badge && (
                          <span className="truncate rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#21A652]">
                            {m.badge}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                        {m.detail}
                      </span>
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-nita"
                    />
                  </button>
                ))}
              </div>
            </section>

            <section id="requests" className="panel p-4 sm:p-5">
              <div className="section-head">
                <div>
                  <span className="section-kicker">REQUESTS & APPROVALS</span>
                  <h2 className="section-title">
                    <span className="title-dot bg-[#21A652]" /> Service Requests
                    &amp; Approvals
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Start a request or pick up where you left off.
                  </p>
                </div>
                <button
                  onClick={() =>
                    toast("A new service request is ready to start.")
                  }
                  className="hidden items-center gap-1.5 rounded-lg bg-[#21A652] px-3 py-2 text-[10px] font-semibold text-white hover:bg-[#188844] sm:inline-flex"
                >
                  ＋ New Request
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-3">
                {requests.map((r) => (
                  <button
                    onClick={() => {
                      setSelectedRequest(r.name);
                      toast(`${r.name} request selected.`);
                    }}
                    key={r.name}
                    className={`request-card flex items-center gap-2.5 rounded-xl border border-[#e2efe6] bg-[#f5faf6] px-3 py-2.5 text-left transition hover:border-[#21A652] hover:bg-[#eaf6ee] ${selectedRequest === r.name ? "border-[#21A652] bg-[#e8f6ed] ring-2 ring-[#21A652]/15" : ""}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#21A652] shadow-sm">
                      <r.icon size={25} />
                    </span>
                    <span className="min-w-0">
                      <b className="block truncate text-[11px] font-bold text-slate-800">
                        {r.name}
                      </b>
                      <span className="block truncate text-[10px] text-slate-500">
                        {r.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#e8f6ed] px-2.5 py-1 text-[9px] font-semibold text-[#21A652]">
                  ● Awaiting My Action (3)
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
                  Submitted by Me (4)
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
                  Priority Escalations (1)
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  {
                    tag: "URGENT",
                    id: "#NITA/OPS/2025/084",
                    title: "Approval for Cloud Migration Tender Review",
                    sub: "Procurement Entity · Ministry of Communication",
                    color: "rose",
                  },
                  {
                    tag: "PENDING HOD APPROVAL",
                    id: "#REQ-9921",
                    title: "Hardware Provisioning for MDA ICT Desk",
                    sub: "Requested: 24 Secure Thin Clients · Estimated Budget: GHC 68,000",
                    color: "amber",
                  },
                  {
                    tag: "AWAITING ENDORSEMENT",
                    id: "#HR-LV-1029",
                    title: "Annual Leave Request · 14 Working Days",
                    sub: "Scheduled: Nov 03–Nov 21 · Handover Delegate: K. Boateng",
                    color: "green",
                  },
                ].map((r, i) => (
                  <div
                    key={r.id}
                    className="flex flex-col gap-2 rounded-xl border border-[#e2efe6] bg-[#f7fbf8] p-3 sm:flex-row sm:items-center"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${i === 0 ? "bg-rose-50 text-rose-500" : i === 1 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-700"}`}
                    >
                      {i === 0 ? (
                        <MessageSquareText size={15} />
                      ) : i === 1 ? (
                        <ShoppingBag size={15} />
                      ) : (
                        <CalendarDays size={15} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-semibold text-slate-500">
                          {r.id}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${i === 0 ? "bg-rose-100 text-rose-600" : i === 1 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}
                        >
                          {r.tag}
                        </span>
                      </div>
                      <b className="mt-0.5 block truncate text-[11px] text-slate-800">
                        {r.title}
                      </b>
                      <span className="block truncate text-[9px] text-slate-500">
                        {r.sub}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        toast(
                          i === 2
                            ? "Leave request approved."
                            : "Review workspace opened.",
                        )
                      }
                      className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[9px] font-semibold transition ${i === 0 ? "bg-[#21A652] text-white hover:bg-[#188844]" : "bg-[#e8f6ed] text-[#21A652] hover:bg-[#d8efdf]"}`}
                    >
                      {i === 0
                        ? "Review & Sign"
                        : i === 1
                          ? "View Details"
                          : "Approve"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:col-span-4">
            <section className="panel overflow-hidden p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Weather &amp; Environment
                  </h2>
                  <h3 className="mt-1 text-base font-medium text-slate-900">
                    Accra, Ghana
                  </h3>
                </div>
                <span className="mt-1 shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                  Accra HQ
                </span>
              </div>

              <div className="mt-5 flex min-h-[132px] items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="min-w-0">
                  {weather ? (
                    <>
                      <div className="flex items-start gap-1">
                        <span className="font-barlow text-[42px] font-bold leading-none tracking-tight text-slate-950">
                          {weather.temperature}
                        </span>
                        <span className="mt-0.5 text-[23px] leading-none text-slate-500">
                          °C
                        </span>
                      </div>
                      <p className="mt-1.5 text-[15px] text-slate-700">
                        {weather.condition}
                      </p>
                      <p className="mt-1 text-[13px] text-slate-400">
                        Today {weather.high}° / {weather.low}°
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Droplets size={15} />
                          {weather.humidity}%
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Wind size={15} />
                          {weather.windSpeed} km/h
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500" role="status">
                      {weatherError || "Loading live weather…"}
                    </p>
                  )}
                </div>
                <div
                  className={`flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[20px] ${
                    weather?.isDay ? "bg-[#e8f6ed] text-[#21A652]" : "bg-[#eef7f1] text-[#21A652]"
                  }`}
                  aria-hidden="true"
                >
                  <WeatherIcon size={33} strokeWidth={1.8} />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-3 text-[12px] text-slate-500">
                <span>
                  {weather
                    ? `Observed ${weather.observedAt || "recently"} · ${localTime} · Accra local time`
                    : weatherError || "Waiting for current conditions"}
                </span>
                <a
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open-Meteo data
                </a>
              </div>
              {weatherError && weather ? (
                <p className="mt-1 text-[11px] text-amber-700" role="status">
                  {weatherError} Showing the last available reading.
                </p>
              ) : null}
            </section>

            <section id="calendar" className="panel p-4">
              <div className="section-head mb-3">
                <h2 className="section-title text-[15px]">
                  <span className="text-[#21A652]">
                    <CalendarDays size={16} />
                  </span>{" "}
                  Upcoming Activities
                </h2>
                <span className="text-[9px] font-medium text-slate-400">
                  Civil Service Calendar
                </span>
              </div>
              <div className="space-y-2">
                {activities.map((a) => (
                  <article
                    key={a.date}
                    className="flex gap-2.5 rounded-lg bg-[#f2f9f4] p-2.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-[#21A652]">
                      <span className="text-[8px] font-bold">{a.month}</span>
                      <b className="font-barlow text-lg leading-none">
                        {a.date}
                      </b>
                    </div>
                    <div className="min-w-0">
                      <b className="block text-[10px] font-bold leading-snug text-slate-800">
                        {a.title}
                      </b>
                      <p className="mt-0.5 truncate text-[9px] text-slate-500">
                        {a.detail}
                      </p>
                      <button
                        onClick={() =>
                          toast(`Added “${a.title}” to your calendar.`)
                        }
                        className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold text-[#21A652] hover:underline"
                      >
                        <CalendarDays size={10} /> Add to Calendar (.ics)
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <button
                onClick={() => toast("Government calendar opened.")}
                className="mt-2 w-full rounded-lg bg-[#f2f9f4] py-2 text-[10px] font-semibold text-slate-600 hover:bg-[#e8f6ed]"
              >
                View Full Government Calendar{" "}
                <ArrowRight size={11} className="ml-1 inline" />
              </button>
            </section>

            <section id="links" className="panel p-4">
              <div className="section-head mb-3">
                <h2 className="section-title text-[15px]">
                  <span className="text-[#21A652]">
                    <Grid2X2 size={16} />
                  </span>{" "}
                  Statutory Quick Links
                </h2>
                <span className="text-[9px] text-slate-400">
                  External gateways
                </span>
              </div>
              <div className="space-y-0.5">
                {links.map((l) => (
                  <a
                    key={l}
                    href="#links"
                    onClick={(e) => {
                      e.preventDefault();
                      toast(`${l} selected.`);
                    }}
                    className="group flex items-center justify-between rounded-lg px-2 py-2 text-[10px] font-medium text-slate-600 transition hover:bg-[#eaf6ee] hover:text-[#21A652]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#21A652]" />
                      {l}
                    </span>
                    <ChevronRight
                      size={12}
                      className="text-slate-300 group-hover:text-[#21A652]"
                    />
                  </a>
                ))}
              </div>
            </section>

            <section id="documents" className="panel p-4">
              <div className="section-head mb-3">
                <div>
                  <h2 className="section-title text-[15px]">
                    <span className="text-[#21A652]">
                      <FileText size={16} />
                    </span>{" "}
                    Recent Documents
                  </h2>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Recently updated workplace files.
                  </p>
                </div>
                <button
                  onClick={() => toast("Showing all shared documents.")}
                  className="text-[9px] font-semibold text-[#21A652] hover:underline"
                >
                  Browse all
                </button>
              </div>
              <label className="relative mb-2 block">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents…"
                  className="w-full rounded-lg border border-[#e2efe6] bg-[#f7fbf8] py-2 pl-9 pr-3 text-[10px] outline-none focus:border-[#21A652] focus:ring-2 focus:ring-[#21A652]/10"
                />
              </label>
              <div className="space-y-1.5">
                {visibleDocs.map((d) => (
                  <button
                    key={d.title}
                    onClick={() => toast(`Opening ${d.title}`)}
                    className="flex w-full items-center gap-2 rounded-lg bg-[#f7fbf8] p-2.5 text-left transition hover:bg-[#eaf6ee]"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${d.tone === "red" ? "bg-rose-50 text-rose-500" : "bg-green-50 text-green-700"}`}
                    >
                      <FileText size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="line-clamp-2 text-[10px] font-semibold leading-snug text-slate-700">
                        {d.title}
                      </b>
                      <span className="mt-0.5 block truncate text-[9px] text-slate-400">
                        {d.meta} · {d.time}
                      </span>
                    </span>
                  </button>
                ))}
                {visibleDocs.length === 0 && (
                  <p className="py-3 text-center text-[10px] text-slate-500">
                    No matching documents.
                  </p>
                )}
              </div>
              <button
                onClick={() => toast("Document upload is ready.")}
                className="mt-2 w-full rounded-lg bg-[#21A652] py-2 text-[10px] font-semibold text-white hover:bg-[#188844]"
              >
                ＋ Upload a document
              </button>
            </section>
          </aside>
        </div>
        <section className="panel mt-5 p-4 sm:p-5">
          <div className="section-head mb-3">
            <div>
              <span className="section-kicker">FROM ACROSS GOVERNMENT</span>
              <h2 className="section-title">
                <span className="title-dot bg-[#21A652]" /> News &amp;
                Government Bulletins
              </h2>
            </div>
            <button
              onClick={() => toast("All circulars opened.")}
              className="text-[10px] font-semibold text-[#21A652]"
            >
              All circulars <ArrowRight size={12} className="ml-1 inline" />
            </button>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {[
              {
                tag: "MOCDT DISPATCH",
                title:
                  "Ministry of Communication & Digital Tech Commissions High-Capacity Data Link",
                body: "Regional office connectivity expands across public service offices.",
              },
              {
                tag: "TECHNICAL DIRECTIVE",
                title:
                  "NITA Introduces Standardized Enterprise Email Protocol for all MDAs",
                body: "Updated guidance supports secure, consistent government email.",
              },
              {
                tag: "INTERNATIONAL INDEX",
                title:
                  "Ghana Ranked Among Top Tier Digital Governance Innovators",
                body: "New survey recognizes progress in digital public services.",
              },
            ].map((n) => (
              <article
                key={n.tag}
                className="flex min-h-[128px] flex-col rounded-xl border border-[#e2efe6] bg-[#f2f9f4] p-3.5"
              >
                <span className="text-[8px] font-bold tracking-widest text-[#21A652]">
                  {n.tag}
                </span>
                <h3 className="mt-2 font-barlow text-sm font-bold leading-snug text-slate-800">
                  {n.title}
                </h3>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                  {n.body}
                </p>
                <span className="mt-auto pt-3 text-[9px] font-medium text-slate-400">
                  Oct 08, 2025{" "}
                  <ArrowRight
                    size={11}
                    className="ml-1 inline text-[#21A652]"
                  />
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:px-9">
          <div>
            <img
              src={Logoo}
              alt="NITA Ghana"
              className="mb-2 h-9 w-28 object-contain object-left"
            />
            <p className="max-w-xs text-[10px] leading-relaxed text-slate-500">
              National Information Technology Agency under the Ministry of
              Communication, Digital Technology and Innovations, Republic of
              Ghana.
            </p>
          </div>
          <div>
            <h3 className="footer-title">Compliance &amp; Governance</h3>
            <ul className="footer-list">
              <li>Data Protection Act, 2012</li>
              <li>Electronic Transactions Act</li>
              <li>National Cyber Security Policy</li>
              <li>Civil Service Digital Standard</li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title">Emergency Contacts</h3>
            <ul className="footer-list">
              <li>
                <b>National CERT:</b> 992 (Toll Free)
              </li>
              <li>
                <b>NITA Dispatch Desk:</b> +233 (0)30 266 1770
              </li>
              <li>
                <b>GovNet NOC:</b> noc@nita.gov.gh
              </li>
              <li>
                <b>Police Cybercrime:</b> 18555
              </li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title">Institutional Links</h3>
            <ul className="footer-list">
              <li>Ministry of Communication &amp; Digital Tech</li>
              <li>Cyber Security Authority</li>
              <li>Data Protection Commission</li>
              <li>Ghana.gov Portal</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-2 border-t border-slate-100 px-5 py-3 text-[9px] text-slate-500 lg:px-9">
          <span>
            © 2025 National Information Technology Agency (NITA), Republic of
            Ghana. All rights reserved.
          </span>
          <span className="flex gap-4">
            <a href="#home" className="hover:text-nita">
              Data Privacy Policy
            </a>
            <a href="#home" className="hover:text-nita">
              Terms of Service
            </a>
            <a href="#home" className="hover:text-nita">
              Security Disclosure
            </a>
          </span>
        </div>
      </footer>
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#13251b] px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          <Check size={16} className="text-[#62dc8b]" />
          {notice}
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className="ml-2 rounded p-0.5 text-white/60 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
