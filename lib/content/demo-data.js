/**
 * Demonstration data for the interactive product preview.
 *
 * IMPORTANT: this is synthetic sample data used purely to show what the product
 * looks like. It is generated deterministically from a seed so figures stay
 * stable between server and client render (no hydration mismatch) while still
 * changing when the visitor switches vertical or date range.
 *
 * This module must never read from, or connect to, a client database.
 */

export const DEMO_DISCLAIMER = "Interactive product preview with demonstration data."

export const VERTICALS = [
  { id: "restaurant", label: "Restaurant", branch: "Kathmandu Branch" },
  { id: "retail", label: "Retail", branch: "Kathmandu Store" },
  { id: "salon", label: "Salon", branch: "Kathmandu Studio" },
]

export const DATE_RANGES = [
  { id: "today", label: "Today", multiplier: 1, days: 1 },
  { id: "week", label: "This Week", multiplier: 6.4, days: 7 },
  { id: "month", label: "This Month", multiplier: 27.5, days: 30 },
  { id: "quarter", label: "This Quarter", multiplier: 82, days: 90 },
]

/** Sidebar sections. `status` renders a badge instead of a plain label. */
export const DEMO_NAV = [
  { id: "dashboard", label: "Visual Dashboard", icon: "dashboard" },
  { id: "pos", label: "POS", icon: "pos" },
  { id: "bills", label: "Bills", icon: "bills" },
  { id: "inventory", label: "Inventory", icon: "inventory" },
  { id: "staff", label: "Staff & Payroll", icon: "staff" },
  { id: "accounting", label: "Accounting", icon: "accounting" },
  { id: "ird", label: "IRD Billing", icon: "ird", status: "Verification Pending" },
  { id: "reports", label: "Reports", icon: "reports" },
]

/** Terminology that changes with the vertical. */
const TERMS = {
  restaurant: {
    itemWord: "Menu item",
    itemsWord: "Menu items",
    catalogue: "Menu",
    orderTypesLabel: "Sales by order type",
    consumptionLabel: "Ingredient consumption",
    prepLabel: "KOT preparation time",
    customerWord: "Guest",
    posLabel: "Restaurant POS",
    billWord: "Bill",
    staffRole: "Waiter",
  },
  retail: {
    itemWord: "Product",
    itemsWord: "Products",
    catalogue: "Catalogue",
    orderTypesLabel: "Sales by channel",
    consumptionLabel: "Stock consumption",
    prepLabel: "Average billing time",
    customerWord: "Customer",
    posLabel: "Retail POS",
    billWord: "Invoice",
    staffRole: "Cashier",
  },
  salon: {
    itemWord: "Service",
    itemsWord: "Services",
    catalogue: "Service list",
    orderTypesLabel: "Sales by service type",
    consumptionLabel: "Product consumption",
    prepLabel: "Average service time",
    customerWord: "Client",
    posLabel: "Salon POS",
    billWord: "Bill",
    staffRole: "Stylist",
  },
}

const BASE = {
  restaurant: {
    grossSales: 84500,
    expenses: 21300,
    cogsRate: 0.34,
    openingBalance: 12000,
    orderTypes: [
      { name: "Dine-in", value: 52 },
      { name: "Takeaway", value: 29 },
      { name: "Delivery", value: 19 },
    ],
    categories: [
      { name: "Momo", value: 26400 },
      { name: "Khana Set", value: 21800 },
      { name: "Noodles", value: 15200 },
      { name: "Snacks", value: 12300 },
      { name: "Beverage", value: 8800 },
    ],
    topItems: [
      { name: "Chicken Momo (10 pcs)", qty: 128, revenue: 28160 },
      { name: "Chicken Khana Set", qty: 62, revenue: 23560 },
      { name: "Chicken Chowmein", qty: 71, revenue: 14200 },
      { name: "Chicken Sekuwa", qty: 34, revenue: 11900 },
      { name: "Milk Tea", qty: 186, revenue: 7440 },
    ],
    consumption: [
      { name: "Chicken", used: 34.5, unit: "kg" },
      { name: "Flour", used: 28.0, unit: "kg" },
      { name: "Onion", used: 19.2, unit: "kg" },
      { name: "Cooking oil", used: 11.4, unit: "L" },
      { name: "Tomato", used: 9.8, unit: "kg" },
    ],
    lowStock: [
      { name: "Chicken", left: 4.2, unit: "kg", reorder: 15 },
      { name: "Cooking oil", left: 3.0, unit: "L", reorder: 10 },
      { name: "Paneer", left: 1.5, unit: "kg", reorder: 5 },
    ],
    wastage: [
      { name: "Vegetables", value: 1250 },
      { name: "Prepared food", value: 860 },
      { name: "Dairy", value: 420 },
    ],
    prepMinutes: 11.4,
    prepTrend: [
      { label: "11am", value: 9.2 },
      { label: "12pm", value: 10.4 },
      { label: "1pm", value: 14.8 },
      { label: "2pm", value: 12.1 },
      { label: "6pm", value: 11.0 },
      { label: "7pm", value: 15.6 },
      { label: "8pm", value: 13.2 },
    ],
    transactions: [
      { ref: "BILL-2291", label: "Table 7 · Dine-in", amount: 2340, method: "Cash", ago: "2 min ago" },
      { ref: "BILL-2290", label: "Takeaway · Counter", amount: 690, method: "QR", ago: "9 min ago" },
      { ref: "BILL-2289", label: "Table 3 · Dine-in", amount: 4185, method: "Card", ago: "14 min ago" },
      { ref: "BILL-2288", label: "Delivery · Order #114", amount: 1120, method: "QR", ago: "22 min ago" },
      { ref: "BILL-2287", label: "Table 11 · Dine-in", amount: 3260, method: "Credit", ago: "31 min ago" },
    ],
  },
  retail: {
    grossSales: 96200,
    expenses: 18400,
    cogsRate: 0.62,
    openingBalance: 15000,
    orderTypes: [
      { name: "Counter", value: 71 },
      { name: "Wholesale", value: 21 },
      { name: "Online request", value: 8 },
    ],
    categories: [
      { name: "Groceries", value: 34200 },
      { name: "Personal care", value: 22100 },
      { name: "Household", value: 17600 },
      { name: "Stationery", value: 13200 },
      { name: "Beverage", value: 9100 },
    ],
    topItems: [
      { name: "Rice 25kg sack", qty: 22, revenue: 42900 },
      { name: "Cooking oil 5L", qty: 31, revenue: 24800 },
      { name: "Detergent 1kg", qty: 48, revenue: 12000 },
      { name: "Sugar 1kg", qty: 96, revenue: 11520 },
      { name: "Tea 500g", qty: 37, revenue: 9250 },
    ],
    consumption: [
      { name: "Rice 25kg sack", used: 22, unit: "units" },
      { name: "Cooking oil 5L", used: 31, unit: "units" },
      { name: "Sugar 1kg", used: 96, unit: "units" },
      { name: "Detergent 1kg", used: 48, unit: "units" },
      { name: "Tea 500g", used: 37, unit: "units" },
    ],
    lowStock: [
      { name: "Cooking oil 5L", left: 6, unit: "units", reorder: 24 },
      { name: "Sugar 1kg", left: 11, unit: "units", reorder: 50 },
      { name: "Toothpaste 100g", left: 4, unit: "units", reorder: 20 },
    ],
    wastage: [
      { name: "Damaged goods", value: 940 },
      { name: "Expired stock", value: 610 },
      { name: "Breakage", value: 280 },
    ],
    prepMinutes: 1.8,
    prepTrend: [
      { label: "9am", value: 1.4 },
      { label: "11am", value: 1.6 },
      { label: "1pm", value: 2.3 },
      { label: "3pm", value: 1.9 },
      { label: "5pm", value: 2.6 },
      { label: "7pm", value: 2.1 },
      { label: "8pm", value: 1.5 },
    ],
    transactions: [
      { ref: "INV-8842", label: "Counter sale", amount: 1840, method: "Cash", ago: "3 min ago" },
      { ref: "INV-8841", label: "Counter sale", amount: 420, method: "QR", ago: "8 min ago" },
      { ref: "INV-8840", label: "Wholesale · Sharma Traders", amount: 18600, method: "Bank", ago: "26 min ago" },
      { ref: "INV-8839", label: "Counter sale", amount: 2250, method: "Cash", ago: "38 min ago" },
      { ref: "INV-8838", label: "Counter sale · Credit", amount: 3100, method: "Credit", ago: "51 min ago" },
    ],
  },
  salon: {
    grossSales: 42800,
    expenses: 13600,
    cogsRate: 0.22,
    openingBalance: 8000,
    orderTypes: [
      { name: "Walk-in", value: 58 },
      { name: "Appointment", value: 33 },
      { name: "Package", value: 9 },
    ],
    categories: [
      { name: "Hair", value: 18400 },
      { name: "Skin", value: 9600 },
      { name: "Spa", value: 7300 },
      { name: "Nails", value: 4200 },
      { name: "Products", value: 3300 },
    ],
    topItems: [
      { name: "Hair cut & style", qty: 64, revenue: 12800 },
      { name: "Hair colour", qty: 18, revenue: 10800 },
      { name: "Facial (classic)", qty: 22, revenue: 8800 },
      { name: "Head massage", qty: 29, revenue: 5800 },
      { name: "Manicure", qty: 16, revenue: 4200 },
    ],
    consumption: [
      { name: "Hair colour tube", used: 18, unit: "units" },
      { name: "Shampoo", used: 4.2, unit: "L" },
      { name: "Facial kit", used: 22, unit: "units" },
      { name: "Conditioner", used: 3.1, unit: "L" },
      { name: "Nail polish", used: 9, unit: "units" },
    ],
    lowStock: [
      { name: "Hair colour tube", left: 5, unit: "units", reorder: 24 },
      { name: "Facial kit", left: 3, unit: "units", reorder: 15 },
      { name: "Shampoo", left: 1.2, unit: "L", reorder: 5 },
    ],
    wastage: [
      { name: "Expired product", value: 520 },
      { name: "Spillage", value: 240 },
      { name: "Damaged stock", value: 160 },
    ],
    prepMinutes: 38.5,
    prepTrend: [
      { label: "10am", value: 32 },
      { label: "12pm", value: 41 },
      { label: "2pm", value: 36 },
      { label: "4pm", value: 44 },
      { label: "6pm", value: 39 },
      { label: "7pm", value: 47 },
      { label: "8pm", value: 33 },
    ],
    transactions: [
      { ref: "BILL-1187", label: "Token 24 · Hair cut", amount: 600, method: "QR", ago: "5 min ago" },
      { ref: "BILL-1186", label: "Token 23 · Hair colour", amount: 3400, method: "Card", ago: "18 min ago" },
      { ref: "BILL-1185", label: "Appointment · Facial", amount: 1800, method: "Cash", ago: "34 min ago" },
      { ref: "BILL-1184", label: "Token 21 · Head massage", amount: 900, method: "Cash", ago: "47 min ago" },
      { ref: "BILL-1183", label: "Package · Bridal (advance)", amount: 8000, method: "Bank", ago: "1 hr ago" },
    ],
  },
}

/** Deterministic 0–1 value from a string seed — keeps SSR and client identical. */
function seededUnit(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

/** ±`spread` deterministic jitter so filtered views look organic, not linear. */
function vary(value, seed, spread = 0.08) {
  const factor = 1 + (seededUnit(seed) - 0.5) * 2 * spread
  return value * factor
}

const round = (n) => Math.round(n)

/**
 * Builds the full demo dataset for a vertical + date range.
 * @param {"restaurant"|"retail"|"salon"} vertical
 * @param {"today"|"week"|"month"|"quarter"} rangeId
 */
export function buildDemoData(vertical, rangeId) {
  const base = BASE[vertical] || BASE.restaurant
  const range = DATE_RANGES.find((r) => r.id === rangeId) || DATE_RANGES[0]
  const m = range.multiplier
  const seed = `${vertical}:${rangeId}`
  const terms = TERMS[vertical]

  const grossSales = round(vary(base.grossSales * m, `${seed}:gs`))
  const expenses = round(vary(base.expenses * m, `${seed}:ex`))
  const cogs = round(grossSales * base.cogsRate)
  const grossProfit = grossSales - cogs
  const netProfit = grossProfit - expenses
  const openingBalance = round(base.openingBalance * (range.days === 1 ? 1 : 1.4))

  const paymentSplit = [
    { name: "Cash", value: round(grossSales * vary(0.42, `${seed}:cash`, 0.12)) },
    { name: "QR / Fonepay", value: round(grossSales * vary(0.34, `${seed}:qr`, 0.12)) },
    { name: "Card", value: round(grossSales * vary(0.14, `${seed}:card`, 0.15)) },
    { name: "Credit", value: round(grossSales * vary(0.1, `${seed}:credit`, 0.2)) },
  ]
  const cashCollected = paymentSplit[0].value
  const expectedCash = openingBalance + cashCollected - round(expenses * 0.6)

  const salesTrend = Array.from({ length: range.days === 1 ? 8 : Math.min(range.days, 12) }, (_, i) => {
    const label =
      range.days === 1
        ? `${9 + i * 2}${9 + i * 2 >= 12 ? "pm" : "am"}`
        : range.days === 7
          ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i % 7]
          : `D${i + 1}`
    const slice = grossSales / (range.days === 1 ? 8 : Math.min(range.days, 12))
    return {
      label,
      sales: round(vary(slice, `${seed}:t${i}`, 0.35)),
      profit: round(vary(slice * (grossProfit / grossSales), `${seed}:p${i}`, 0.4)),
    }
  })

  return {
    vertical,
    terms,
    branch: VERTICALS.find((v) => v.id === vertical)?.branch || "Kathmandu Branch",
    rangeLabel: range.label,
    kpis: {
      grossSales,
      expenses,
      cogs,
      grossProfit,
      netProfit,
      openingBalance,
      expectedCash,
      margin: grossSales ? (netProfit / grossSales) * 100 : 0,
    },
    salesTrend,
    paymentSplit,
    orderTypes: base.orderTypes.map((o) => ({
      ...o,
      amount: round(grossSales * (o.value / 100)),
    })),
    categories: base.categories.map((c, i) => ({
      ...c,
      value: round(vary(c.value * m, `${seed}:c${i}`, 0.1)),
    })),
    topItems: base.topItems.map((t, i) => ({
      ...t,
      qty: round(vary(t.qty * m, `${seed}:q${i}`, 0.1)),
      revenue: round(vary(t.revenue * m, `${seed}:r${i}`, 0.1)),
    })),
    consumption: base.consumption.map((c, i) => ({
      ...c,
      used: Number(vary(c.used * m, `${seed}:u${i}`, 0.1).toFixed(1)),
    })),
    lowStock: base.lowStock,
    wastage: base.wastage.map((w, i) => ({ ...w, value: round(vary(w.value * m, `${seed}:w${i}`, 0.15)) })),
    prep: { average: base.prepMinutes, trend: base.prepTrend },
    receivables: {
      total: round(vary(grossSales * 0.11, `${seed}:ar`, 0.2)),
      overdue: round(vary(grossSales * 0.03, `${seed}:aro`, 0.3)),
      count: Math.max(3, round(vary(9 * Math.sqrt(m), `${seed}:arc`, 0.25))),
    },
    payables: {
      total: round(vary(grossSales * 0.16, `${seed}:ap`, 0.2)),
      dueThisWeek: round(vary(grossSales * 0.06, `${seed}:apd`, 0.3)),
      count: Math.max(2, round(vary(6 * Math.sqrt(m), `${seed}:apc`, 0.25))),
    },
    businessDay: {
      status: "Open",
      openedAt: "09:12 AM",
      openedBy: "Bishal (Manager)",
      billsIssued: Math.max(8, round(vary(64 * m, `${seed}:bc`, 0.12))),
    },
    transactions: base.transactions,
    auditAlerts: [
      { level: "warning", text: `3 ${terms.billWord.toLowerCase()}s edited after printing`, meta: "Requires manager review" },
      { level: "info", text: "Discount above 15% applied twice", meta: "Approved by Manager" },
      { level: "warning", text: "1 void after payment recorded", meta: "Reason logged" },
    ],
  }
}
