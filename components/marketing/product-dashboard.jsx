"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  LayoutDashboard, ShoppingCart, ReceiptText, Package, Users, BookOpen,
  FileCheck2, BarChart3, TrendingUp, TrendingDown, Wallet, AlertTriangle,
  Clock, CircleDollarSign, ArrowUpRight, ArrowDownRight, Info, Menu, ExternalLink,
} from "lucide-react"
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, LineChart, Line,
} from "recharts"
import { useTheme } from "@/components/theme-provider"
import { buildDemoData, DEMO_NAV, VERTICALS, DATE_RANGES, DEMO_DISCLAIMER } from "@/lib/content/demo-data"
import { cn } from "@/lib/utils"

const navIcons = {
  dashboard: LayoutDashboard,
  pos: ShoppingCart,
  bills: ReceiptText,
  inventory: Package,
  staff: Users,
  accounting: BookOpen,
  ird: FileCheck2,
  reports: BarChart3,
}

// Chart palette — orange-led to stay inside the AADHAR identity, with enough
// hue separation that series remain distinguishable in both themes.
const SERIES = ["#f97316", "#f59e0b", "#38bdf8", "#a78bfa", "#34d399"]

const rs = (n) => `Rs ${Math.round(n).toLocaleString("en-US")}`
const rsShort = (n) =>
  n >= 100000 ? `Rs ${(n / 100000).toFixed(1)}L` : n >= 1000 ? `Rs ${(n / 1000).toFixed(0)}k` : `Rs ${n}`

/* ═══════════════════════ shell ═══════════════════════ */

export default function ProductDashboard({ compact = false }) {
  const [vertical, setVertical] = useState("restaurant")
  const [range, setRange] = useState("today")
  const [tab, setTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inView, setInView] = useState(false)
  const rootRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const data = useMemo(() => buildDemoData(vertical, range), [vertical, range])

  // Charts animate only once the window scrolls into view.
  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const animate = inView && !reduceMotion
  const activeNav = DEMO_NAV.find((n) => n.id === tab)

  return (
    <div ref={rootRef} className="w-full">
      {/* Controls above the window frame */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Choose an industry" className="flex flex-wrap gap-1.5">
          {VERTICALS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVertical(v.id)}
              aria-pressed={vertical === v.id}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
                vertical === v.id
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                  : "border border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div role="group" aria-label="Choose a date range" className="flex flex-wrap gap-1 rounded-full border border-gray-200 bg-gray-100 p-1 dark:border-slate-800 dark:bg-slate-900">
          {DATE_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              aria-pressed={range === r.id}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                range === r.id
                  ? "bg-white text-orange-600 shadow-sm dark:bg-slate-800 dark:text-orange-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop application window ── */}
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl shadow-black/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/50 sm:rounded-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-100 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950 sm:px-4">
          <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-expanded={sidebarOpen}
            aria-label="Toggle demo navigation"
            className="rounded-md p-1 text-gray-500 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/LOGO_Icon_only.png" alt="" className="h-5 w-5 shrink-0 object-contain" />
            <span className="truncate text-xs font-semibold text-gray-700 dark:text-slate-200 sm:text-sm">
              AADHAR POS — {data.branch}
            </span>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:text-[11px]">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Demo Active
          </span>
        </div>

        <div className="flex min-h-[540px] lg:min-h-[640px]">
          {/* Sidebar */}
          <nav
            aria-label="Demo sections"
            className={cn(
              "shrink-0 border-r border-gray-200 bg-gray-50 p-2 dark:border-slate-800 dark:bg-slate-950/60",
              "hidden lg:block lg:w-56",
              sidebarOpen && "!block absolute z-20 h-auto w-56 shadow-2xl lg:relative lg:shadow-none"
            )}
          >
            <ul className="space-y-0.5">
              {DEMO_NAV.map((item) => {
                const Icon = navIcons[item.icon]
                const active = tab === item.id
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setTab(item.id)
                        setSidebarOpen(false)
                      }}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                        active
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                          : "text-gray-600 hover:bg-gray-200/70 dark:text-slate-400 dark:hover:bg-slate-800/70"
                      )}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block leading-tight">{item.label}</span>
                        {item.status && (
                          <span className="mt-1 inline-block rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide text-amber-600 dark:text-amber-400">
                            {item.status}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Content pane */}
          <div className="min-w-0 flex-1 overflow-hidden bg-gray-50/50 dark:bg-slate-900">
            {/* Mobile section switcher */}
            <div className="border-b border-gray-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40 lg:hidden">
              <label htmlFor="demo-section" className="sr-only">
                Demo section
              </label>
              <select
                id="demo-section"
                value={tab}
                onChange={(e) => setTab(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {DEMO_NAV.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                    {n.status ? ` — ${n.status}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <motion.div
              key={`${tab}-${vertical}-${range}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="max-h-[70vh] overflow-y-auto overscroll-contain p-3 sm:p-5 lg:max-h-none"
            >
              <PaneHeader title={activeNav?.label} status={activeNav?.status} range={data.rangeLabel} />
              <Pane tab={tab} data={data} animate={animate} isDark={isDark} compact={compact} />
            </motion.div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-100 px-3 py-2 text-[11px] text-gray-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500 sm:px-4">
          <span className="inline-flex items-center gap-1.5">
            <Info className="h-3 w-3" aria-hidden="true" />
            {DEMO_DISCLAIMER}
          </span>
          <span>Business day: {data.businessDay.status} · {data.businessDay.billsIssued} bills</span>
        </div>
      </div>

      <p className="mt-3 text-center text-xs leading-relaxed text-gray-500 dark:text-slate-500">
        Figures shown are synthetic sample data for demonstration. This preview is not connected to any
        client database and does not display live business data.
      </p>
    </div>
  )
}

function PaneHeader({ title, status, range }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white sm:text-lg">
        {title}
        {status && (
          <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            {status}
          </span>
        )}
      </h3>
      <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:bg-slate-800 dark:text-slate-400">
        {range}
      </span>
    </div>
  )
}

/* ═══════════════════════ panes ═══════════════════════ */

function Pane({ tab, data, animate, isDark, compact }) {
  switch (tab) {
    case "dashboard":
      return <DashboardPane data={data} animate={animate} isDark={isDark} compact={compact} />
    case "pos":
      return <PosPane data={data} />
    case "bills":
      return <BillsPane data={data} />
    case "inventory":
      return <InventoryPane data={data} animate={animate} isDark={isDark} />
    case "staff":
      return <StaffPane data={data} />
    case "accounting":
      return <AccountingPane data={data} />
    case "ird":
      return <IrdPane data={data} />
    case "reports":
      return <ReportsPane data={data} animate={animate} isDark={isDark} />
    default:
      return null
  }
}

/* ── shared bits ── */

function Kpi({ label, value, sub, trend, tone = "default", icon: Icon }) {
  const tones = {
    default: "text-gray-900 dark:text-white",
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-red-600 dark:text-red-400",
    accent: "text-orange-600 dark:text-orange-400",
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3.5 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="truncate text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-slate-500">
          {label}
        </span>
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-slate-600" aria-hidden="true" />}
      </div>
      <p className={cn("text-lg font-bold tabular-nums sm:text-xl", tones[tone])}>{value}</p>
      {(sub || trend) && (
        <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-500">
          {trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-500" aria-hidden="true" />}
          {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" aria-hidden="true" />}
          {sub}
        </p>
      )}
    </div>
  )
}

function Panel({ title, children, action, className }) {
  return (
    <section className={cn("rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-[13px] font-bold text-gray-800 dark:text-slate-200">{title}</h4>
        {action}
      </div>
      {children}
    </section>
  )
}

function chartTheme(isDark) {
  return {
    grid: isDark ? "#1e293b" : "#e5e7eb",
    axis: isDark ? "#64748b" : "#9ca3af",
    tooltipBg: isDark ? "#0f172a" : "#ffffff",
    tooltipBorder: isDark ? "#334155" : "#e5e7eb",
    tooltipText: isDark ? "#e2e8f0" : "#111827",
  }
}

function TooltipBox({ isDark }) {
  const t = chartTheme(isDark)
  return {
    contentStyle: {
      background: t.tooltipBg,
      border: `1px solid ${t.tooltipBorder}`,
      borderRadius: 10,
      fontSize: 12,
      color: t.tooltipText,
      boxShadow: "0 8px 24px rgba(0,0,0,.12)",
    },
    labelStyle: { color: t.tooltipText, fontWeight: 700, marginBottom: 4 },
    itemStyle: { color: t.tooltipText },
  }
}

/* ── Dashboard ── */

function DashboardPane({ data, animate, isDark }) {
  const t = chartTheme(isDark)
  const tip = TooltipBox(isDark)
  const { kpis, terms } = data

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <Kpi label="Gross sales" value={rs(kpis.grossSales)} sub={data.rangeLabel} trend="up" icon={TrendingUp} />
        <Kpi label="Expenses" value={rs(kpis.expenses)} sub="Operating costs" tone="negative" icon={TrendingDown} />
        <Kpi label="Gross profit" value={rs(kpis.grossProfit)} sub={`After ${rsShort(kpis.cogs)} cost of sales`} tone="positive" icon={CircleDollarSign} />
        <Kpi label="Net profit" value={rs(kpis.netProfit)} sub={`${kpis.margin.toFixed(1)}% margin`} tone="accent" icon={Wallet} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <Kpi label="Opening balance" value={rs(kpis.openingBalance)} sub={`Opened ${data.businessDay.openedAt}`} />
        <Kpi label="Expected cash" value={rs(kpis.expectedCash)} sub="In drawer at close" />
        <Kpi label={`${terms.customerWord} receivables`} value={rs(data.receivables.total)} sub={`${data.receivables.count} accounts · ${rsShort(data.receivables.overdue)} overdue`} tone="negative" />
        <Kpi label="Supplier payables" value={rs(data.payables.total)} sub={`${data.payables.count} suppliers · ${rsShort(data.payables.dueThisWeek)} due`} tone="negative" />
      </div>

      {/* Sales trend + payment split */}
      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Sales and profit" className="lg:col-span-2">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesTrend} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: t.axis }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: t.axis }} tickLine={false} axisLine={false} tickFormatter={(v) => rsShort(v)} width={52} />
                <RTooltip {...tip} formatter={(v, n) => [rs(v), n === "sales" ? "Sales" : "Profit"]} />
                <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} fill="url(#gSales)" isAnimationActive={animate} animationDuration={900} />
                <Area type="monotone" dataKey="profit" stroke="#34d399" strokeWidth={2} fill="url(#gProfit)" isAnimationActive={animate} animationDuration={1100} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Payment methods">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.paymentSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="82%"
                  paddingAngle={2}
                  isAnimationActive={animate}
                  animationDuration={900}
                  stroke="none"
                >
                  {data.paymentSplit.map((_, i) => (
                    <Cell key={i} fill={SERIES[i % SERIES.length]} />
                  ))}
                </Pie>
                <RTooltip {...tip} formatter={(v, n) => [rs(v), n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {data.paymentSplit.map((p, i) => (
              <li key={p.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ background: SERIES[i % SERIES.length] }} aria-hidden="true" />
                  {p.name}
                </span>
                <span className="font-semibold tabular-nums text-gray-800 dark:text-slate-200">{rs(p.value)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Order types + categories */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title={terms.orderTypesLabel}>
          <ul className="space-y-3">
            {data.orderTypes.map((o, i) => (
              <li key={o.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-slate-300">{o.name}</span>
                  <span className="tabular-nums text-gray-500 dark:text-slate-500">
                    {rs(o.amount)} · {o.value}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{ width: animate ? `${o.value}%` : "0%", background: SERIES[i % SERIES.length] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Sales by category">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categories} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.axis }} tickLine={false} axisLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: t.axis }} tickLine={false} axisLine={false} tickFormatter={rsShort} width={52} />
                <RTooltip {...tip} cursor={{ fill: isDark ? "#1e293b55" : "#f3f4f688" }} formatter={(v) => [rs(v), "Sales"]} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={animate} animationDuration={900}>
                  {data.categories.map((_, i) => (
                    <Cell key={i} fill={SERIES[i % SERIES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Top items + consumption */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title={`Top-selling ${terms.itemsWord.toLowerCase()}`}>
          <ul className="space-y-2">
            {data.topItems.map((item, i) => (
              <li key={item.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-500/10 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-gray-700 dark:text-slate-300">{item.name}</span>
                <span className="shrink-0 text-[11px] tabular-nums text-gray-500 dark:text-slate-500">{item.qty} sold</span>
                <span className="w-20 shrink-0 text-right text-xs font-semibold tabular-nums text-gray-800 dark:text-slate-200">
                  {rsShort(item.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={terms.consumptionLabel}>
          <ul className="space-y-2.5">
            {data.consumption.map((c, i) => {
              const max = Math.max(...data.consumption.map((x) => x.used))
              return (
                <li key={c.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-700 dark:text-slate-300">{c.name}</span>
                    <span className="tabular-nums text-gray-500 dark:text-slate-500">
                      {c.used} {c.unit}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-[width] duration-700 ease-out"
                      style={{ width: animate ? `${(c.used / max) * 100}%` : "0%", transitionDelay: `${i * 60}ms` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>

      {/* Alerts row */}
      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Low-stock alerts">
          <ul className="space-y-2">
            {data.lowStock.map((s) => (
              <li key={s.name} className="flex items-center gap-2 rounded-lg bg-red-500/[0.07] px-2.5 py-2">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-xs text-gray-700 dark:text-slate-300">{s.name}</span>
                <span className="shrink-0 text-[11px] font-semibold tabular-nums text-red-600 dark:text-red-400">
                  {s.left} {s.unit} left
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Wastage and spoilage">
          <ul className="space-y-2">
            {data.wastage.map((w) => (
              <li key={w.name} className="flex items-center justify-between text-xs">
                <span className="text-gray-700 dark:text-slate-300">{w.name}</span>
                <span className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">{rs(w.value)}</span>
              </li>
            ))}
            <li className="mt-1 flex items-center justify-between border-t border-gray-200 pt-2 text-xs font-bold dark:border-slate-800">
              <span className="text-gray-800 dark:text-slate-200">Total</span>
              <span className="tabular-nums text-gray-900 dark:text-white">
                {rs(data.wastage.reduce((s, w) => s + w.value, 0))}
              </span>
            </li>
          </ul>
        </Panel>

        <Panel title={data.terms.prepLabel}>
          <div className="mb-2 flex items-baseline gap-2">
            <Clock className="h-4 w-4 text-orange-500" aria-hidden="true" />
            <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{data.prep.average}</span>
            <span className="text-xs text-gray-500 dark:text-slate-500">min average</span>
          </div>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.prep.trend} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: t.axis }} tickLine={false} axisLine={false} />
                <YAxis tick={false} axisLine={false} tickLine={false} width={30} />
                <RTooltip {...tip} formatter={(v) => [`${v} min`, "Average"]} />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={animate} animationDuration={900} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Transactions + audit */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Recent transactions">
          <ul className="divide-y divide-gray-100 dark:divide-slate-800">
            {data.transactions.map((tx) => (
              <li key={tx.ref} className="flex items-center gap-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-800 dark:text-slate-200">{tx.label}</p>
                  <p className="text-[10px] text-gray-500 dark:text-slate-500">
                    {tx.ref} · {tx.ago}
                  </p>
                </div>
                <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-400">
                  {tx.method}
                </span>
                <span className="w-16 shrink-0 text-right text-xs font-bold tabular-nums text-gray-900 dark:text-white">
                  {rsShort(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Audit alerts">
          <ul className="space-y-2">
            {data.auditAlerts.map((a, i) => (
              <li
                key={i}
                className={cn(
                  "rounded-lg px-3 py-2",
                  a.level === "warning" ? "bg-amber-500/[0.08]" : "bg-sky-500/[0.08]"
                )}
              >
                <p className="text-xs font-medium text-gray-800 dark:text-slate-200">{a.text}</p>
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-slate-500">{a.meta}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-[11px] text-gray-600 dark:text-slate-400">
              Business day <strong className="text-emerald-600 dark:text-emerald-400">{data.businessDay.status}</strong> since{" "}
              {data.businessDay.openedAt} · opened by {data.businessDay.openedBy}
            </p>
          </div>
        </Panel>
      </div>
    </div>
  )
}

/* ── POS ── */

function PosPane({ data }) {
  const { terms } = data
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <Panel title={terms.catalogue} className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.topItems.map((item, i) => (
            <div
              key={item.name}
              className="rounded-lg border border-gray-200 bg-gray-50 p-2.5 transition-colors hover:border-orange-400 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <p className="truncate text-xs font-semibold text-gray-800 dark:text-slate-200">{item.name}</p>
              <p className="mt-1 text-sm font-bold text-orange-600 dark:text-orange-400">
                {rs(Math.round(item.revenue / Math.max(item.qty, 1)))}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-slate-500">In stock · {40 + i * 7}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title={`Current ${terms.billWord.toLowerCase()}`}>
        <ul className="space-y-2 text-xs">
          {data.topItems.slice(0, 3).map((item) => {
            const unit = Math.round(item.revenue / Math.max(item.qty, 1))
            return (
              <li key={item.name} className="flex items-center justify-between gap-2">
                <span className="min-w-0 flex-1 truncate text-gray-700 dark:text-slate-300">{item.name}</span>
                <span className="shrink-0 text-gray-500 dark:text-slate-500">×2</span>
                <span className="w-16 shrink-0 text-right font-semibold tabular-nums text-gray-800 dark:text-slate-200">
                  {rs(unit * 2)}
                </span>
              </li>
            )
          })}
        </ul>
        <dl className="mt-3 space-y-1.5 border-t border-gray-200 pt-3 text-xs dark:border-slate-800">
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-slate-500">Subtotal</dt>
            <dd className="tabular-nums text-gray-700 dark:text-slate-300">{rs(2460)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-slate-500">VAT 13%</dt>
            <dd className="tabular-nums text-gray-700 dark:text-slate-300">{rs(319.8)}</dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1.5 text-sm font-bold dark:border-slate-800">
            <dt className="text-gray-900 dark:text-white">Total</dt>
            <dd className="tabular-nums text-orange-600 dark:text-orange-400">{rs(2779.8)}</dd>
          </div>
        </dl>
        <p className="mt-3 rounded-lg bg-gray-100 px-2.5 py-2 text-[10px] leading-relaxed text-gray-500 dark:bg-slate-900 dark:text-slate-500">
          The live billing screen is fully interactive in the product. This preview shows layout and
          totals only.
        </p>
      </Panel>
    </div>
  )
}

/* ── Bills ── */

function BillsPane({ data }) {
  return (
    <Panel title={`${data.terms.billWord} register`}>
      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wide text-gray-500 dark:border-slate-800 dark:text-slate-500">
              <th scope="col" className="py-2 pr-3 font-semibold">Reference</th>
              <th scope="col" className="py-2 pr-3 font-semibold">Detail</th>
              <th scope="col" className="py-2 pr-3 font-semibold">Method</th>
              <th scope="col" className="py-2 pr-3 font-semibold">Time</th>
              <th scope="col" className="py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {data.transactions.map((tx) => (
              <tr key={tx.ref}>
                <td className="py-2.5 pr-3 font-mono text-[11px] text-gray-600 dark:text-slate-400">{tx.ref}</td>
                <td className="py-2.5 pr-3 text-gray-800 dark:text-slate-200">{tx.label}</td>
                <td className="py-2.5 pr-3">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-400">
                    {tx.method}
                  </span>
                </td>
                <td className="py-2.5 pr-3 text-gray-500 dark:text-slate-500">{tx.ago}</td>
                <td className="py-2.5 text-right font-bold tabular-nums text-gray-900 dark:text-white">{rs(tx.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* ── Inventory ── */

function InventoryPane({ data, animate, isDark }) {
  const t = chartTheme(isDark)
  const tip = TooltipBox(isDark)
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Kpi label="Tracked items" value={String(data.consumption.length * 24)} sub="Across all categories" />
        <Kpi label="Low stock" value={String(data.lowStock.length)} sub="Below reorder level" tone="negative" />
        <Kpi label="Wastage value" value={rs(data.wastage.reduce((s, w) => s + w.value, 0))} sub={data.rangeLabel} tone="negative" />
        <Kpi label="Supplier payables" value={rs(data.payables.total)} sub={`${data.payables.count} suppliers`} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title={data.terms.consumptionLabel}>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.consumption} layout="vertical" margin={{ top: 0, right: 12, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: t.axis }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: t.axis }} tickLine={false} axisLine={false} width={92} />
                <RTooltip {...tip} cursor={{ fill: isDark ? "#1e293b55" : "#f3f4f688" }} />
                <Bar dataKey="used" radius={[0, 4, 4, 0]} fill="#f97316" isAnimationActive={animate} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Reorder list">
          <ul className="space-y-2">
            {data.lowStock.map((s) => (
              <li key={s.name} className="rounded-lg border border-red-500/25 bg-red-500/[0.06] px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">{s.name}</span>
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
                    {s.left} {s.unit}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-red-500 transition-[width] duration-700"
                    style={{ width: animate ? `${Math.min((s.left / s.reorder) * 100, 100)}%` : "0%" }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-500 dark:text-slate-500">
                  Reorder level: {s.reorder} {s.unit}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}

/* ── Staff ── */

function StaffPane({ data }) {
  const staff = [
    { name: "Bishal Adhikari", role: "Manager", shift: "09:00 – 18:00", bills: 0, salary: 32000 },
    { name: "Sunita Karki", role: data.terms.staffRole, shift: "10:00 – 19:00", bills: 42, salary: 21000 },
    { name: "Prakash Rai", role: data.terms.staffRole, shift: "12:00 – 21:00", bills: 38, salary: 20000 },
    { name: "Anita Shrestha", role: "Cashier", shift: "09:00 – 18:00", bills: 51, salary: 22000 },
  ]
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Kpi label="Active staff" value={String(staff.length)} sub="On today's roster" />
        <Kpi label="Monthly payroll" value={rs(staff.reduce((s, m) => s + m.salary, 0))} sub="Gross, before deductions" />
        <Kpi label="Advances outstanding" value={rs(8500)} sub="2 employees" tone="negative" />
        <Kpi label="Bills handled" value={String(staff.reduce((s, m) => s + m.bills, 0))} sub={data.rangeLabel} />
      </div>
      <Panel title="Roster and payroll">
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wide text-gray-500 dark:border-slate-800 dark:text-slate-500">
                <th scope="col" className="py-2 pr-3 font-semibold">Name</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Role</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Shift</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Bills</th>
                <th scope="col" className="py-2 text-right font-semibold">Monthly salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {staff.map((m) => (
                <tr key={m.name}>
                  <td className="py-2.5 pr-3 font-semibold text-gray-800 dark:text-slate-200">{m.name}</td>
                  <td className="py-2.5 pr-3 text-gray-600 dark:text-slate-400">{m.role}</td>
                  <td className="py-2.5 pr-3 tabular-nums text-gray-600 dark:text-slate-400">{m.shift}</td>
                  <td className="py-2.5 pr-3 tabular-nums text-gray-600 dark:text-slate-400">{m.bills || "—"}</td>
                  <td className="py-2.5 text-right font-bold tabular-nums text-gray-900 dark:text-white">{rs(m.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

/* ── Accounting ── */

function AccountingPane({ data }) {
  const { kpis } = data
  const rows = [
    { label: "Gross sales", value: kpis.grossSales, tone: "positive" },
    { label: "Cost of sales", value: -kpis.cogs, tone: "negative" },
    { label: "Gross profit", value: kpis.grossProfit, tone: "positive", strong: true },
    { label: "Operating expenses", value: -kpis.expenses, tone: "negative" },
    { label: "Net profit", value: kpis.netProfit, tone: "accent", strong: true },
  ]
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Panel title="Profit and loss">
        <ul className="divide-y divide-gray-100 dark:divide-slate-800">
          {rows.map((r) => (
            <li key={r.label} className={cn("flex items-center justify-between py-2.5 text-xs", r.strong && "font-bold")}>
              <span className={r.strong ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-slate-400"}>
                {r.label}
              </span>
              <span
                className={cn(
                  "tabular-nums",
                  r.tone === "negative" && "text-red-600 dark:text-red-400",
                  r.tone === "positive" && "text-gray-800 dark:text-slate-200",
                  r.tone === "accent" && "text-orange-600 dark:text-orange-400"
                )}
              >
                {r.value < 0 ? `(${rs(Math.abs(r.value))})` : rs(r.value)}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Cash and bank position">
        <ul className="space-y-2.5 text-xs">
          <li className="flex justify-between">
            <span className="text-gray-600 dark:text-slate-400">Opening balance</span>
            <span className="tabular-nums text-gray-800 dark:text-slate-200">{rs(kpis.openingBalance)}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600 dark:text-slate-400">Cash collected</span>
            <span className="tabular-nums text-emerald-600 dark:text-emerald-400">
              +{rs(data.paymentSplit[0].value)}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600 dark:text-slate-400">Cash expenses</span>
            <span className="tabular-nums text-red-600 dark:text-red-400">-{rs(kpis.expenses * 0.6)}</span>
          </li>
          <li className="flex justify-between border-t border-gray-200 pt-2.5 font-bold dark:border-slate-800">
            <span className="text-gray-900 dark:text-white">Expected cash in drawer</span>
            <span className="tabular-nums text-orange-600 dark:text-orange-400">{rs(kpis.expectedCash)}</span>
          </li>
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-lg bg-red-500/[0.07] p-2.5">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-slate-500">Receivable</p>
            <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-white">{rs(data.receivables.total)}</p>
          </div>
          <div className="rounded-lg bg-amber-500/[0.07] p-2.5">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-slate-500">Payable</p>
            <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-white">{rs(data.payables.total)}</p>
          </div>
        </div>
      </Panel>
    </div>
  )
}

/* ── IRD ── */

function IrdPane() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              IRD Billing — Verification Pending
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-700 dark:text-slate-300">
              IRD and CBMS integration is offered as a quotation-only add-on and is subject to technical
              verification and the applicable approval process. Until that process is complete for a
              business, AADHAR does not claim verified real-time IRD validation.
            </p>
          </div>
        </div>
      </div>

      <Panel title="Capabilities in scope once approved">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            "PAN/VAT configuration",
            "Controlled invoice numbering",
            "Credit-note workflow",
            "CBMS submission",
            "Synchronization status",
            "Audit history",
            "Tax reports",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-700 dark:bg-slate-900/60 dark:text-slate-300">
              <FileCheck2 className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-slate-600" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-gray-500 dark:text-slate-500">
          The base packages record VAT-inclusive billing and produce tax reports. Full CBMS submission is
          activated per business after verification.
        </p>
      </Panel>
    </div>
  )
}

/* ── Reports ── */

function ReportsPane({ data, animate, isDark }) {
  const t = chartTheme(isDark)
  const tip = TooltipBox(isDark)
  return (
    <div className="space-y-3">
      <Panel title="Sales trend">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.salesTrend} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: t.axis }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: t.axis }} tickLine={false} axisLine={false} tickFormatter={rsShort} width={52} />
              <RTooltip {...tip} cursor={{ fill: isDark ? "#1e293b55" : "#f3f4f688" }} formatter={(v, n) => [rs(v), n === "sales" ? "Sales" : "Profit"]} />
              <Bar dataKey="sales" radius={[4, 4, 0, 0]} fill="#f97316" isAnimationActive={animate} animationDuration={900} />
              <Bar dataKey="profit" radius={[4, 4, 0, 0]} fill="#34d399" isAnimationActive={animate} animationDuration={1100} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Sales report", desc: "By day, category, item and staff" },
          { label: "Profit report", desc: "Gross and net with cost of sales" },
          { label: "Stock report", desc: "Movement, wastage and valuation" },
          { label: "Receivables report", desc: "Customer balances and ageing" },
        ].map((r) => (
          <div key={r.label} className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="mb-1.5 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{r.label}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-500 dark:text-slate-500">{r.desc}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 dark:text-slate-600">
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              Available in product
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
