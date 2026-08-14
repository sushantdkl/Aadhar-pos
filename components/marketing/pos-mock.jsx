"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, Minus, Trash2, ShoppingCart, User, Check, Package,
  LayoutGrid, BarChart3, Settings, Users, Printer, Pause,
  Percent, Wifi, Battery, Signal
} from "lucide-react"

// Demonstration data only — a representative Nepali restaurant menu.
// This mock is never connected to a client database.
const products = [
  { id: 1, name: "Chicken Momo (10 pcs)", price: 220, category: "Momo", stock: 60, emoji: "🥟" },
  { id: 2, name: "Buff Momo (10 pcs)", price: 190, category: "Momo", stock: 48, emoji: "🥟" },
  { id: 3, name: "Veg Momo (10 pcs)", price: 160, category: "Momo", stock: 55, emoji: "🥟" },
  { id: 4, name: "Chicken Chowmein", price: 200, category: "Noodles", stock: 40, emoji: "🍜" },
  { id: 5, name: "Thukpa", price: 230, category: "Noodles", stock: 32, emoji: "🍲" },
  { id: 6, name: "Veg Khana Set", price: 280, category: "Khana Set", stock: 25, emoji: "🍛" },
  { id: 7, name: "Chicken Khana Set", price: 380, category: "Khana Set", stock: 22, emoji: "🍛" },
  { id: 8, name: "Chicken Sekuwa", price: 350, category: "Snacks", stock: 18, emoji: "🍢" },
  { id: 9, name: "Aloo Chop (6 pcs)", price: 120, category: "Snacks", stock: 44, emoji: "🥔" },
  { id: 10, name: "Milk Tea", price: 40, category: "Beverage", stock: 200, emoji: "🍵" },
  { id: 11, name: "Lemon Soda", price: 90, category: "Beverage", stock: 85, emoji: "🥤" },
  { id: 12, name: "Mineral Water 1L", price: 35, category: "Beverage", stock: 150, emoji: "💧" },
]

const categories = ["All", "Momo", "Noodles", "Khana Set", "Snacks", "Beverage"]

// ──────────────────────────────────────────────
// INTERACTIVE POS SCREEN
// ──────────────────────────────────────────────
function POSScreen({ isMobile, scrollable = false }) {
  const [cart, setCart] = useState([
    { ...products[0], qty: 2 },
    { ...products[2], qty: 1 },
    { ...products[5], qty: 3 },
  ])
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [animatingProduct, setAnimatingProduct] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [showPaymentDone, setShowPaymentDone] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [heldBills, setHeldBills] = useState(1)
  const cartRef = useRef(null)

  const addToCart = (product) => {
    setAnimatingProduct(product.id)
    setTimeout(() => setAnimatingProduct(null), 500)
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p)
      return [...prev, { ...product, qty: 1 }]
    })
    setTimeout(() => {
      if (cartRef.current) cartRef.current.scrollTop = cartRef.current.scrollHeight
    }, 100)
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id))

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id !== id) return p
      const nq = p.qty + delta
      return nq > 0 ? { ...p, qty: nq } : p
    }))
  }

  const filteredProducts = products.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    (searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const subtotal = cart.reduce((s, p) => s + p.price * p.qty, 0)
  const discountAmt = discount
  const vat = (subtotal - discountAmt) * 0.13
  const total = subtotal - discountAmt + vat
  const itemCount = cart.reduce((s, p) => s + p.qty, 0)

  const completeSale = () => {
    setShowPaymentDone(true)
    setTimeout(() => {
      setShowPaymentDone(false)
      setCart([])
      setDiscount(0)
    }, 1500)
  }

  // ────── MOBILE ──────
  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-[#f8f9fa] text-[#1a1a2e] overflow-hidden select-none" style={{ fontSize: '9px', colorScheme: 'light' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-1 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <Package className="w-2 h-2 text-white" />
            </div>
            <span className="font-bold text-[8px] text-gray-800">Aadhar POS</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[6px] px-1 py-0.5 bg-green-50 text-green-600 rounded font-medium">●</span>
            <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-2.5 h-2.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-2 py-1 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
            <Search className="w-2.5 h-2.5 text-gray-400" />
            <span className="text-gray-400 text-[7px]">Search menu...</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-1 px-2 py-1 bg-white border-b border-gray-100 shrink-0 overflow-x-auto">
          {["All", "Momo", "Noodles"].map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`text-[7px] px-1.5 py-0.5 rounded-full whitespace-nowrap transition-all ${
                activeCategory === c ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >{c}</button>
          ))}
        </div>

        {/* Products */}
        <div className="flex-1 overflow-auto px-2 py-1">
          <div className="grid grid-cols-2 gap-1">
            {filteredProducts.slice(0, 4).map(p => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(p)}
                className={`bg-white border rounded p-1 text-left transition-all ${
                  animatingProduct === p.id ? 'border-green-400 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-[10px]">{p.emoji}</span>
                  <p className="font-semibold text-[7px] text-gray-800 truncate">{p.name}</p>
                </div>
                <p className="text-[8px] font-bold text-gray-600 mt-0.5">Rs {p.price}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white border-t border-gray-200 shrink-0">
          <div className="px-2 py-1 space-y-0.5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-[8px] flex items-center gap-0.5">
                <ShoppingCart className="w-2.5 h-2.5" /> Cart ({itemCount})
              </span>
              <span className="text-[8px] font-bold text-gray-800">Rs {total.toFixed(0)}</span>
            </div>
            {cart.slice(0, 2).map(item => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded px-1 py-0.5">
                <span className="text-[7px] font-medium truncate flex-1">{item.name}</span>
                <span className="text-[7px] font-bold shrink-0 ml-1">×{item.qty} Rs {item.price * item.qty}</span>
              </div>
            ))}
            {cart.length > 2 && <p className="text-[6px] text-gray-400 text-center">+{cart.length - 2} more items</p>}
          </div>
          <button onClick={completeSale} className="w-full bg-green-600 text-white font-bold text-[8px] py-1.5 flex items-center justify-center gap-0.5">
            <Check className="w-2.5 h-2.5" /> Complete Sale
          </button>
        </div>

        {/* Payment done overlay */}
        <AnimatePresence>
          {showPaymentDone && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-green-600/90 flex flex-col items-center justify-center z-50 text-white"
            >
              <Check className="w-6 h-6 mb-1" />
              <p className="font-bold text-[10px]">Payment Done!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ────── DESKTOP / LAPTOP ──────
  return (
    <div className="h-full flex flex-col bg-[#f5f6f8] text-[#1a1a2e] overflow-hidden select-none" style={{ fontSize: '10px', colorScheme: 'light' }}>
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-sm">
              <Package className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-[11px] text-gray-800">Aadhar POS</span>
          </div>
          {/* Nav tabs */}
          <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
            {[
              { icon: LayoutGrid, label: "Billing", active: true },
              { icon: BarChart3, label: "Reports" },
              { icon: Users, label: "Customers" },
              { icon: Settings, label: "Settings" },
            ].map(tab => (
              <div
                key={tab.label}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[8px] font-medium cursor-default transition-all ${
                  tab.active ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon className="w-2.5 h-2.5" />
                {tab.label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {heldBills > 0 && (
            <div className="flex items-center gap-1 text-[8px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200 font-medium cursor-default">
              <Pause className="w-2.5 h-2.5" /> {heldBills} Held
            </div>
          )}
          <span className="text-[8px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded font-medium border border-green-200 flex items-center gap-0.5">
            <span className="w-1 h-1 rounded-full bg-green-500" />Online
          </span>
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ─── LEFT: Products ─── */}
        <div className="flex-[3] flex flex-col border-r border-gray-200 overflow-hidden">
          {/* Search + Category */}
          <div className="p-2 bg-white border-b border-gray-100 space-y-1.5 shrink-0">
            <div
              className={`flex items-center gap-1.5 border-2 rounded-lg px-2.5 py-1 transition-all ${
                searchFocused ? 'border-gray-400 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            >
              <Search className="w-3 h-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search or scan barcode..."
                className="bg-transparent outline-none text-[9px] text-gray-700 placeholder:text-gray-400 flex-1 w-0"
              />
              <span className="text-[7px] text-gray-300 border border-gray-200 rounded px-1 py-0.5 font-mono shrink-0">⌘K</span>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-0.5">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`text-[8px] px-2 py-0.5 rounded-full whitespace-nowrap transition-all font-medium ${
                    activeCategory === c
                      ? 'bg-gray-800 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                  }`}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">
                {activeCategory === "All" ? "All Products" : activeCategory} ({filteredProducts.length})
              </p>
              <p className="text-[7px] text-gray-400">Click to add</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {filteredProducts.map(p => (
                <motion.button
                  key={p.id}
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => addToCart(p)}
                  className={`bg-white border rounded-lg p-2 text-left transition-all group hover:shadow-md hover:border-gray-300 relative ${
                    animatingProduct === p.id
                      ? 'border-green-400 bg-green-50 shadow-md ring-1 ring-green-300'
                      : 'border-gray-200'
                  }`}
                >
                  <AnimatePresence>
                    {animatingProduct === p.id && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-2 h-2 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex items-start justify-between">
                    <span className="text-sm leading-none">{p.emoji}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-2.5 h-2.5 text-gray-400" />
                    </span>
                  </div>
                  <p className="font-semibold text-[9px] text-gray-800 leading-tight mt-1 line-clamp-1">{p.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[9px] font-bold text-gray-700">Rs {p.price}</p>
                    <p className="text-[7px] text-gray-400">{p.stock} pcs</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Cart & Payment ─── */}
        <div className="flex-[2] flex flex-col bg-white overflow-hidden">
          {/* Cart Header */}
          <div className="px-2.5 py-1.5 border-b border-gray-100 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-[10px] flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" />
              Current Bill
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">{itemCount} items</span>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-[7px] text-red-400 hover:text-red-600 font-medium transition-colors">Clear</button>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="px-2.5 py-1 border-b border-gray-100 flex items-center gap-1.5 shrink-0 bg-gray-50/80">
            <User className="w-3 h-3 text-gray-400" />
            <span className="text-[8px] text-gray-400">Guest Customer</span>
            <button className="ml-auto text-[7px] text-gray-500 hover:text-gray-700 font-medium bg-white border border-gray-200 rounded px-1.5 py-0.5 transition-colors">+ Add</button>
          </div>

          {/* Cart Items */}
          <div ref={cartRef} className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0 bg-[#fafafa]">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-gray-300">
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  <p className="text-[9px]">No items yet</p>
                  <p className="text-[7px]">Add products from the left</p>
                </motion.div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, padding: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="bg-white border border-gray-200 rounded-lg p-1.5 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="text-xs shrink-0">{item.emoji}</span>
                        <p className="font-semibold text-[9px] text-gray-800 truncate">{item.name}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors ml-1 p-0.5">
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => updateQty(item.id, -1)} className="w-4 h-4 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                          <Minus className="w-2 h-2" />
                        </button>
                        <span className="w-5 text-center font-bold text-[9px]">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-4 h-4 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                          <Plus className="w-2 h-2" />
                        </button>
                        <span className="text-[7px] text-gray-400 ml-1">@Rs {item.price}</span>
                      </div>
                      <p className="font-bold text-[9px] text-gray-800">Rs {(item.price * item.qty).toFixed(0)}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Payment section */}
          <div className="border-t border-gray-200 bg-white shrink-0">
            {/* Payment method */}
            <div className="px-2.5 py-1.5 border-b border-gray-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-gray-500 font-medium">Payment Method</span>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] text-gray-500 font-medium flex items-center gap-0.5">
                    <Percent className="w-2 h-2" /> Discount
                  </span>
                  <input
                    type="number"
                    value={discount || ""}
                    onChange={e => setDiscount(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-10 text-[8px] text-right border border-gray-200 rounded px-1 py-0.5 bg-gray-50 outline-none focus:border-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-0.5">
                {["Cash", "Card", "Online", "Credit"].map(m => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`flex-1 text-[7px] py-0.5 rounded font-medium transition-all ${
                      paymentMethod === m
                        ? 'bg-gray-800 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >{m}</button>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="px-2.5 py-1.5 space-y-0.5">
              <div className="flex justify-between text-[8px]">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-600">Rs {subtotal.toFixed(0)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-[8px]">
                  <span className="text-green-500">Discount</span>
                  <span className="font-medium text-green-600">-Rs {discountAmt}</span>
                </div>
              )}
              <div className="flex justify-between text-[8px]">
                <span className="text-gray-400">VAT (13%)</span>
                <span className="font-medium text-gray-600">Rs {vat.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold border-t border-gray-100 pt-1 mt-0.5">
                <span className="text-gray-800">Total</span>
                <motion.span
                  key={total.toFixed(0)}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-gray-900"
                >Rs {total.toFixed(0)}</motion.span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-2.5 pb-2 pt-0.5 flex gap-1">
              <button
                onClick={() => { setHeldBills(h => h + 1); setCart([]); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-[8px] py-1.5 rounded-lg flex items-center justify-center gap-0.5 transition-colors"
              >
                <Pause className="w-2.5 h-2.5" /> Hold
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={completeSale}
                disabled={cart.length === 0}
                className="flex-[2] bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-[9px] py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm"
              >
                <Check className="w-3 h-3" />
                Complete Sale
              </motion.button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-[8px] py-1.5 rounded-lg flex items-center justify-center gap-0.5 transition-colors">
                <Printer className="w-2.5 h-2.5" /> Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {showPaymentDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-600/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-white"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2"
            >
              <Check className="w-6 h-6" />
            </motion.div>
            <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="font-bold text-sm">Payment Successful!</motion.p>
            <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-[10px] text-white/80 mt-0.5">Rs {total.toFixed(0)} via {paymentMethod}</motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ──────────────────────────────────────────────
// LAPTOP DEVICE FRAME - realistic MacBook style
// ──────────────────────────────────────────────
function LaptopFrame({ children }) {
  return (
    <div className="w-full">
      {/* Screen assembly */}
      <div className="relative">
        {/* Outer bezel */}
        <div className="bg-[#1a1a1a] dark:bg-[#e4e4e7] rounded-t-[12px] pt-[8px] px-[8px] pb-0 shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_20px_60px_-10px_rgba(0,0,0,0.4)] dark:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_20px_60px_-10px_rgba(0,0,0,0.15)]">
          {/* Camera area */}
          <div className="flex items-center justify-center pb-[6px]">
            <div className="w-[5px] h-[5px] rounded-full bg-[#0d0d0d] dark:bg-[#ccc] ring-1 ring-[#333] dark:ring-[#bbb]">
              <div className="w-[2px] h-[2px] rounded-full bg-[#1a3a4a] dark:bg-[#aaa] mt-[1.5px] ml-[1.5px]" />
            </div>
          </div>
          {/* Screen */}
          <div className="bg-white rounded-[2px] overflow-hidden relative" style={{ aspectRatio: '16 / 10' }}>
            {children}
            {/* Screen reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
        {/* Bottom lip */}
        <div className="h-[5px] bg-[#1a1a1a] dark:bg-[#e4e4e7] rounded-b-[2px] mx-[1px]" />
      </div>

      {/* Hinge / connector */}
      <div className="flex justify-center">
        <div className="w-[25%] h-[4px] bg-gradient-to-b from-[#2a2a2a] to-[#3a3a3a] dark:from-[#d0d0d3] dark:to-[#c0c0c3] rounded-b-sm" />
      </div>

      {/* Keyboard base */}
      <div className="relative mx-[-4%]">
        {/* Main base surface */}
        <div className="bg-gradient-to-b from-[#c8c8ca] via-[#b8b8bb] to-[#a8a8ab] dark:from-[#e8e8eb] dark:via-[#dddde0] dark:to-[#d0d0d3] h-[14px] rounded-b-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }}
        >
          {/* Trackpad indent */}
          <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[20%] h-[1.5px] bg-[#999] dark:bg-[#bbb] rounded-full opacity-50" />
        </div>
        {/* Bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8a8a8d] dark:bg-[#c5c5c8] rounded-b-xl"
          style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }}
        />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// PHONE DEVICE FRAME
// ──────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div className="inline-block">
      <div className="bg-[#1a1a1a] dark:bg-[#e4e4e7] rounded-[20px] p-[3px] shadow-[0_10px_40px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-5px_rgba(0,0,0,0.15)] ring-1 ring-white/5 dark:ring-black/10">
        {/* Side buttons */}
        <div className="absolute -left-[1px] top-[25%] w-[1.5px] h-[8px] bg-[#333] dark:bg-[#ccc] rounded-l-sm" />
        <div className="absolute -left-[1px] top-[35%] w-[1.5px] h-[12px] bg-[#333] dark:bg-[#ccc] rounded-l-sm" />
        <div className="absolute -left-[1px] top-[42%] w-[1.5px] h-[12px] bg-[#333] dark:bg-[#ccc] rounded-l-sm" />
        <div className="absolute -right-[1px] top-[30%] w-[1.5px] h-[14px] bg-[#333] dark:bg-[#ccc] rounded-r-sm" />

        <div className="relative">
          <div className="bg-black dark:bg-[#d0d0d3] rounded-[17px] overflow-hidden" style={{ width: '140px', aspectRatio: '9 / 19.5' }}>
            {/* Status bar */}
            <div className="flex items-center justify-between px-3 pt-1 pb-0 bg-[#f8f9fa] relative">
              <span className="text-[6px] font-semibold text-gray-800">9:41</span>
              {/* Dynamic island */}
              <div className="w-10 h-[7px] bg-black dark:bg-[#c0c0c3] rounded-full absolute left-1/2 -translate-x-1/2 top-[2px]" />
              <div className="flex items-center gap-[2px]">
                <Signal className="w-[6px] h-[6px] text-gray-700" />
                <Wifi className="w-[6px] h-[6px] text-gray-700" />
                <Battery className="w-[8px] h-[5px] text-gray-700" />
              </div>
            </div>
            {/* Content */}
            <div className="h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// MAIN EXPORT
// ──────────────────────────────────────────────
export default function POSMock() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Desktop view: Laptop + floating phone */}
      <div className="hidden md:block w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-[680px] mx-auto"
        >
          <LaptopFrame>
            <POSScreen isMobile={false} scrollable />
          </LaptopFrame>
        </motion.div>

        {/* Floating phone - smaller, positioned nicely */}
        <motion.div
          className="absolute -bottom-2 -right-3 lg:right-0 z-10"
          initial={{ opacity: 0, y: 50, x: 30 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
        >
          <div className="drop-shadow-2xl">
            <PhoneFrame>
              <POSScreen isMobile />
            </PhoneFrame>
          </div>
        </motion.div>

        {/* Shadow beneath laptop */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-black/[0.06] dark:bg-black/30 rounded-[50%] blur-xl" />
      </div>

      {/* Mobile site view: show phone only */}
      <div className="md:hidden flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="drop-shadow-2xl"
        >
          <div style={{ transform: 'scale(1.3)' }}>
            <PhoneFrame>
              <POSScreen isMobile />
            </PhoneFrame>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
