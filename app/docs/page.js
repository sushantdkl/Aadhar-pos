"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/marketing/navbar"
import Footer from "@/components/marketing/footer"
import Link from "next/link"
import { 
  Store, Package, ShoppingCart, BarChart3, Users, Settings, 
  Database, Shield, Smartphone, Cloud, Zap, Clock, 
  FileText, CreditCard, Tag, Search, Camera, TrendingUp,
  CheckCircle, AlertCircle, Code, Terminal, Home, Book,
  Wifi, WifiOff, RefreshCw, Lock, Download, Upload,
  Globe, Printer, Bell, DollarSign, PieChart, Activity,
  ChevronRight, Monitor, Tablet, Cpu, HardDrive, Network,
  Layers, Key, Server, GitBranch, Box, Receipt, ArrowRight,
  PlayCircle, Calculator, Percent, Send, Image, Trash2,
  Edit3, Eye, RotateCcw, Archive, Filter, SortAsc, Copy,
  ExternalLink, MessageSquare, Star, Gift, Award, Sparkles,
  Target, Brain, LineChart, Briefcase, CreditCard as Card
} from "lucide-react"

export default function DocsPage() {
  // SEO: Set page title and meta dynamically
  useEffect(() => {
    document.title = "Aadhar POS Documentation | Complete Guide for Nepal's Best POS System"
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Complete documentation for AADHAR POS - business software built for Nepali businesses. Learn how to manage inventory, process sales, track profits and run your business day to day.')
    }
  }, [])
  const [activeCategory, setActiveCategory] = useState("user")
  const [expandedSections, setExpandedSections] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSubSection, setActiveSubSection] = useState(null)

  useEffect(() => {
    // Auto-expand first section on load
    setExpandedSections({ "getting-started": true })
  }, [])

  const toggleSection = (docId) => {
    setExpandedSections(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }))
  }

  const categories = [
    { id: "user", label: "📘 User Guide", description: "For shop owners & staff", icon: Book, color: "from-orange-400 to-blue-500" },
    { id: "admin", label: "🔧 Admin Docs", description: "System architecture", icon: Shield, color: "from-purple-400 to-pink-500" },
    { id: "api", label: "👨‍💻 Developer API", description: "Integration & APIs", icon: Code, color: "from-amber-400 to-red-500" }
  ]

  // Render function for markdown-style content
  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('###')) {
        return <h4 key={i} className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">{line.replace('###', '').trim()}</h4>
      }
      if (line.startsWith('##')) {
        return <h3 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">{line.replace('##', '').trim()}</h3>
      }
      // Bold
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={i} className="text-gray-700 dark:text-slate-300 mb-2">
            {parts.map((part, j) => 
              j % 2 === 1 ? <strong key={j} className="text-gray-900 dark:text-white font-semibold">{part}</strong> : part
            )}
          </p>
        )
      }
      // Bullets
      if (line.startsWith('•') || line.startsWith('-')) {
        return <li key={i} className="text-gray-700 dark:text-slate-300 ml-4">{line.substring(1).trim()}</li>
      }
      // Code blocks
      if (line.startsWith('```')) {
        return null // Skip code block markers
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2"></div>
      }
      return <p key={i} className="text-gray-700 dark:text-slate-300 mb-2">{line}</p>
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-400/10 border border-orange-400/20 rounded-full mb-6">
            <Book className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-semibold">Complete Documentation • 1000+ Pages • SEO Optimized</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Aadhar POS
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Documentation Hub</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Everything you need to run AADHAR day to day — from first setup through advanced features and integrations.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search documentation... (e.g., 'how to add products', 'barcode scanner setup', 'offline mode')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-700 dark:text-slate-300 text-sm hover:border-orange-400 transition-colors cursor-pointer">
              🚀 Getting Started
            </span>
            <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-700 dark:text-slate-300 text-sm hover:border-orange-400 transition-colors cursor-pointer">
              📦 Product Management
            </span>
            <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-700 dark:text-slate-300 text-sm hover:border-orange-400 transition-colors cursor-pointer">
              🛒 Billing Guide
            </span>
            <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-700 dark:text-slate-300 text-sm hover:border-orange-400 transition-colors cursor-pointer">
              📊 Business Insights
            </span>
            <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-700 dark:text-slate-300 text-sm hover:border-orange-400 transition-colors cursor-pointer">
              🔄 Offline Mode
            </span>
            <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-700 dark:text-slate-300 text-sm hover:border-orange-400 transition-colors cursor-pointer">
              👨‍💻 API Reference
            </span>
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative p-8 rounded-2xl border-2 transition-all text-left ${
                    isActive 
                      ? 'border-orange-400 bg-gray-50 dark:bg-slate-900' 
                      : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{cat.label}</h3>
                  <p className="text-gray-600 dark:text-slate-400">{cat.description}</p>
                  {isActive && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-orange-400" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8">
                {activeCategory === 'user' && 'Complete guide for shop owners, managers, and staff members'}
                {activeCategory === 'admin' && 'Technical documentation for system administrators and developers'}
                {activeCategory === 'api' && 'REST API reference for developers building integrations'}
              </p>

              {/* User Documentation */}
              {activeCategory === 'user' && (
                <UserDocumentation 
                  expandedSections={expandedSections} 
                  toggleSection={toggleSection}
                  searchQuery={searchQuery}
                />
              )}

              {/* Admin Documentation */}
              {activeCategory === 'admin' && (
                <div className="text-center py-20">
                  <Shield className="w-24 h-24 text-purple-400 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Admin Documentation</h3>
                  <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                    System architecture, database schemas, deployment guides, and advanced configuration for system administrators.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-400/10 border border-purple-400/20 rounded-lg text-purple-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm">Coming in next update</span>
                  </div>
                </div>
              )}

              {/* API Documentation */}
              {activeCategory === 'api' && (
                <div className="text-center py-20">
                  <Code className="w-24 h-24 text-amber-400 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Developer API Documentation</h3>
                  <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                    Complete REST API reference with authentication, endpoints, request/response examples, and SDKs.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/20 rounded-lg text-amber-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm">Coming in next update</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Complete User Documentation Component
function UserDocumentation({ expandedSections, toggleSection, searchQuery }) {
  const userDocs = [
    {
      id: "getting-started",
      title: "🚀 Getting Started with Aadhar POS",
      description: "Everything you need to start using AADHAR POS",
      icon: Zap,
      content: `# Introduction to Aadhar POS

Aadhar POS is business management software built for Nepali businesses. Whether you run a small shop, a restaurant, a salon or a growing multi-outlet operation, the system is configured around how your business actually works.

## What Makes Aadhar POS Special?

**⚠️ Connectivity**
The hosted system requires an internet connection to bill. Verified offline billing with later synchronization is planned and is not currently available. For locations with unreliable connectivity we will discuss a backup connection during onboarding.

**✅ Business Insights and Reporting**
Our exclusive Business Intelligence engine analyzes your sales patterns, predicts trends, identifies fast-moving and dead stock, and suggests optimal reorder points. Make data-driven decisions every day.

**✅ Built for Nepal**
• Supports Nepali language
• Nepal-specific tax calculations (13% VAT)
• Local currency (NPR)
• Optimized for Nepal's retail ecosystem
• Works with local hardware

**✅ Lightning Fast Performance**
Process transactions in under 3 seconds. Scan barcodes instantly. Generate reports in real-time. Built with cutting-edge technology for maximum speed.

## Perfect For Every Business Type

• **Kirana/General Stores:** Manage thousands of SKUs with ease
• **Pharmacies:** Track batches, expiry dates, and medicine schedules
• **Mobile & Electronics:** Handle serial numbers, warranties, IMEI tracking
• **Cosmetics & Beauty:** Manage product variants (colors, sizes)
• **Hardware Stores:** Track lumber, cement, tools by measurement units
• **Restaurants & Cafes:** Table management, kitchen orders, quick billing
• **Liquor Shops:** Age verification, permit tracking, license compliance
• **Wholesale Businesses:** Bulk pricing, credit management, dealer networks

## System Requirements

### Minimum Requirements
• **Operating System:** Windows 10/11, macOS 10.15+, Linux (Ubuntu 20+)
• **Processor:** Intel i3 or equivalent (2.0 GHz)
• **RAM:** 4GB minimum (8GB highly recommended)
• **Storage:** 500MB for app + space for database (grows with data)
• **Display:** 1366x768 resolution minimum (1920x1080 recommended)
• **Internet:** OPTIONAL - needed only for cloud sync and updates
• **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended Hardware
• **Barcode Scanner:** USB/Bluetooth 1D/2D scanner (Rs 2,000 - Rs 15,000)
• **Receipt Printer:** 58mm or 80mm thermal printer (Rs 8,000 - Rs 25,000)
• **Cash Drawer:** RJ11/RJ12 compatible (Rs 5,000 - Rs 12,000)
• **Touch Screen Monitor:** 15.6" - 21.5" capacitive touch (optional)
• **Weighing Scale:** For shops selling by weight (optional)
• **Label Printer:** For price tags and product labels (optional)

### Mobile Compatibility
• **Android:** Version 8.0+ (phones and tablets)
• **iOS:** Version 12.0+ (iPhone and iPad)
• **Screen Size:** 5" minimum (7"+ tablets recommended for billing)

## Installation Guide

### Windows Installation (Recommended)
1. Download **Aadhar-POS-Setup.exe** from https://aadhar.com.np/download
2. Run installer as Administrator (right-click → Run as administrator)
3. Choose installation directory (default: C:\\Program Files\\Aadhar POS)
4. Wait for installation (2-3 minutes)
5. Launch from desktop shortcut
6. Complete first-time setup wizard (5 steps)

### macOS Installation
1. Download **Aadhar-POS.dmg** file
2. Open DMG file (double-click)
3. Drag Aadhar POS icon to Applications folder
4. Open Finder → Applications → Right-click Aadhar POS → Open
5. Click "Open" on security warning (first time only)
6. Complete setup wizard

### Linux Installation
**Option 1: APT Repository (Ubuntu/Debian)**
\`\`\`bash
sudo add-apt-repository ppa:Aadhar-POS/stable
sudo apt update
sudo apt install Aadhar-POS
Aadhar-POS
\`\`\`

**Option 2: AppImage (Universal)**
\`\`\`bash
wget https://aadhar.com.np/downloads/Aadhar-POS.AppImage
chmod +x Aadhar-POS.AppImage
./Aadhar-POS.AppImage
\`\`\`

### Web Version (No Installation)
Simply visit: **https://app.aadhar.com.np**
Works in any modern browser. No download needed.

### Mobile PWA Setup
**Android/iOS:**
1. Open Chrome/Safari browser
2. Go to: https://app.aadhar.com.np
3. Tap menu (⋮) → "Add to Home Screen"
4. Name it "Aadhar POS"
5. Tap "Add"
6. Icon appears on home screen
7. Launch like a native app

## Creating Your Shop Account

### First-Time Setup Wizard (5 Steps)

**Step 1: Shop Information**
• Shop Name: Your business name (e.g., "Ram General Store")
• Owner Name: Your full name
• Phone Number: Active mobile number (for OTP verification)
• Email: Optional but recommended for backup
• Business Type: Select category (Kirana/Pharmacy/Mobile Shop etc.)
• Address: Full address with area

**Step 2: Tax & Financial Settings**
• Enable VAT Collection: Yes/No (13% in Nepal)
• Tax Registration Number: Your PAN number
• Currency: NPR (Nepali Rupee)
• Financial Year: Choose fiscal year
• Opening Balance: Starting cash in drawer

**Step 3: Security Setup**
• Username: Choose unique username (3-20 characters)
• Password: Strong password (min 8 characters)
• PIN: 4-6 digit quick login PIN
• Security Question: For account recovery

**Step 4: Printer & Hardware**
• Detect Receipt Printer (optional - can skip)
• Select Paper Size: 58mm or 80mm
• Test Print
• Configure Barcode Scanner (optional)

**Step 5: Data Import (Optional)**
• Import existing products from Excel
• Download sample template
• Upload your file
• Map columns
• OR skip and add products manually later

Click "Complete Setup" → You're ready!

## Connecting Devices

### Barcode Scanner Setup

**USB Wired Scanner**
1. Plug scanner USB into computer
2. Windows auto-installs drivers (wait 30 seconds)
3. Open Aadhar POS → Settings → Devices → Barcode Scanner
4. Click "Detect Scanner"
5. Scanner name appears (e.g., "Honeywell 1900")
6. Test: Scan any product barcode
7. Should beep and show product code
8. Click "Save Configuration"

**Bluetooth Wireless Scanner**
1. Turn ON scanner (hold power button 3 seconds)
2. Enable Bluetooth on PC (Settings → Bluetooth)
3. Pair device (PIN usually: 0000 or 1234)
4. In AADHAR: Settings → Devices → Add Bluetooth Scanner
5. Select scanner from list
6. Test scan
7. Adjust scan mode (trigger/continuous) if needed

**Scanner Settings:**
• Scan Mode: Single/Continuous
• Beep Volume: Low/Medium/High
• LED Indicator: On/Off
• Auto-detect product: Yes/No

**Supported Barcode Formats:**
✅ EAN-13 (most common in Nepal)
✅ EAN-8
✅ UPC-A / UPC-E
✅ Code 128
✅ Code 39
✅ QR Codes
✅ Data Matrix

### Receipt Printer Setup

**Thermal Printer Connection**
1. Connect printer USB cable
2. Install manufacturer drivers (CD or website)
3. Turn printer ON
4. Aadhar → Settings → Printer Settings
5. Click "Auto-Detect Printers"
6. Select your printer model
7. Configure settings:
   - Paper width: 58mm or 80mm
   - Characters per line: Auto or Manual
   - Logo position: Top/None
   - Font size: Small/Medium/Large
8. Upload shop logo (optional - PNG/JPG, max 200KB)
9. Print Test Receipt
10. Adjust settings if needed

**Popular Printer Models Tested:**
• TVS RP 3160 Star (Rs 8,500)
• Epson TM-T82 (Rs 18,000)
• Xprinter XP-58 (Rs 3,500)
• Citizen CT-S310II (Rs 15,000)
• Posiflex PP-6900 (Rs 12,000)

**Receipt Customization:**
• Header text
• Shop logo
• Tax registration display
• Footer message ("Thank you!" etc.)
• Include/exclude: SKU, barcode, category
• Alignment: Left/Center/Right

### Cash Drawer Connection
Most thermal printers have built-in cash drawer port (RJ11/RJ12)

1. Connect cash drawer cable to printer's "DK" or "Cash Drawer" port
2. In AADHAR: Settings → Cash Drawer
3. Enable "Open Drawer After Sale"
4. Test: Click "Open Drawer" button
5. Should open with "click" sound

**Settings:**
• Auto-open on sale completion: Yes/No
• Opening signal duration: 50ms - 500ms
• Sound feedback: On/Off

### Camera Scanner (Built-in)
No setup needed! Just allow camera permission when prompted.

**Usage:**
1. In billing screen, click Camera icon
2. Point at barcode
3. Red scanning line appears
4. Auto-detects and adds product
5. Works with both webcam and phone camera

**Tips for Best Results:**
• Ensure good lighting
• Hold steady for 2-3 seconds
• 4-8 inches distance from barcode
• Avoid reflections on glossy packages
• Clean camera lens if blurry

## Multi-Device Setup

### Primary Device (First Installation)
Complete full setup as described above. This becomes your master device.

### Additional Devices (Same Shop)
1. Install Aadhar POS on second device
2. **Instead of "Create New Shop"**, click **"Login to Existing Shop"**
3. Enter your shop username and password
4. System fetches all data from cloud
5. Wait for initial sync (2-5 minutes depending on data size)
6. All products, sales, customers automatically downloaded
7. Both devices stay in sync in real-time

**How Multi-Device Sync Works:**
• Device A makes a sale → Syncs to cloud → Device B receives update
• Conflicts resolved automatically (timestamp-based)
• Works even if devices offline (syncs when back online)
• Supports unlimited devices per shop

## First Steps After Setup

### 1. Add Your First Products (5 minutes)
Start with 10-20 most-sold items:
• Products → Add New Product
• Scan barcode or enter manually
• Set selling price and opening stock
• Click Save

### 2. Configure Tax & Pricing (3 minutes)
• Settings → Tax Settings
• Enable 13% VAT
• Choose: Prices include tax OR exclude tax
• Set rounding rules

### 3. Add Your First Customer (2 minutes)
• Customers → Add New
• Enter name and phone
• Set loyalty points settings
• Save

### 4. Make Your First Sale! (1 minute)
• Click Billing in sidebar
• Scan or search product
• Adjust quantity
• Select payment method
• Complete sale
• Print receipt

## Getting Help

**In-App Help:**
• Click ? icon next to any feature
• Contextual help tooltips
• Video tutorials in Help menu

**Support Channels:**
• **Phone:** 01-4234567 (9 AM - 7 PM)
• **WhatsApp:** +977-9812345678
• **Email:** support@aadhar.com.np
• **Live Chat:** Available in app (bottom-right)

**Training:**
• Free 1-hour onboarding call
• Video tutorial library
• Weekly webinars (Fridays 5 PM)

Ready to transform your business? Let's dive deeper into each feature! →`
    },
    {
      id: "dashboard",
      title: "📊 Dashboard Overview",
      description: "Your business command center - understand every metric",
      icon: Home,
      content: `# Dashboard - Your Business Command Center

The Dashboard is the first screen you see after logging in. It provides a real-time snapshot of your business performance, alerts, and key metrics.

## Dashboard Layout

The dashboard is divided into 6 main sections:

### 1. Today's Sales Card
**Large card at top-left showing:**

**Sales Amount (Big Number)**
• Total revenue from all completed bills today
• Updates in real-time with each sale
• Shown in NPR with comma separators (e.g., Rs. 45,650)

**Comparison Indicator:**
🟢 **+15% from yesterday** (green arrow up) = Doing better
🔴 **-8% from yesterday** (red arrow down) = Lower than yesterday
⚪ **Same as yesterday** (gray horizontal line) = No change

**Mini Stats Below:**
• **Bills**: Count of transactions (e.g., 127 bills)
• **Avg Bill**: Total sales ÷ bill count (e.g., Rs. 359 avg)
• **Items Sold**: Total quantity of all products sold

**Click Action:** View detailed sales list for today

### 2. Profit Summary Card
**Shows your earnings after costs:**

**Net Profit Amount**
• Calculation: Total Sales - Cost of Goods - Expenses
• Real profit in your pocket
• Color-coded: Green if positive, Red if negative

**Gross Profit**
• Sales minus cost of goods only
• Before deducting expenses

**Profit Margin %**
• Formula: (Net Profit ÷ Sales) × 100
• Industry benchmarks:
  - >30% = Excellent
  - 15-30% = Good  
  - <15% = Review pricing

**Visual Graph**
• 7-day trend line showing daily profit
• Hover on any point for exact amount
• Click to see full profit report

### 3. Inventory Status Card
**Stock health at a glance:**

**Total Products**: Count of unique items in catalog
**Total Stock Value**: Sum of (Quantity × Cost Price) for all products
**Low Stock Items**: Products below minimum threshold (clickable)
**Out of Stock**: Zero quantity products (clickable)

**Stock Velocity Indicator:**
• Fast Moving: Products selling <7 days
• Slow Moving: 30-90 days
• Dead Stock: >90 days (requires action!)

**Quick Actions:**
• "Add Stock" button
• "View All Products" link
• "Purchase Orders" shortcut

### 4. Fast-Selling Items Panel
**Your bestsellers today/this week:**

Shows top 5 products in a sortable table:

**Columns:**
• **Rank**: #1 to #5
• **Product Name**: With thumbnail image
• **Qty Sold**: Units moved today
• **Revenue**: Money earned from this product
• **Stock Left**: Current inventory (color-coded)
• **Trend**: ↑ Trending up, ↓ Slowing, → Steady

**Why This Matters:**
✅ Identify what customers want most
✅ Ensure popular items never run out
✅ Plan bulk purchases of hot items
✅ Spot seasonal trends early
✅ Optimize shelf placement

**Actions:**
• Click product → See full details and history
• "Restock" button → Quick purchase entry
• "View Full Report" → Detailed analytics

### 5. Low Stock Alerts Panel
**Critical inventory warnings:**

**Alert Levels:**
🔴 **CRITICAL (0-5 units)**
• Immediate restock needed
• Risk of lost sales
• Customer disappointment
• Action: Order TODAY

🟡 **LOW (6-10 units)**
• Order within 2-3 days
• Monitor closely
• Check lead time from supplier

🟠 **WARNING (11-20 units)**
• Plan restock for next week
• Not urgent but noted

**Information Shown:**
• Product name and image
• **Current Stock**: How many units left
• **Minimum Level**: Your set threshold
• **Daily Avg Sale**: How many sell per day
• **Days Until Out**: Auto-calculated stockout date
• **Supplier**: Who to order from

**Quick Actions:**
• "Order Now" → Creates purchase order instantly
• "Call Supplier" → Shows supplier contact
• "Adjust Minimum" → Change threshold if wrong
• "Snooze 3 Days" → Temporarily hide alert

**Smart Predictions:**
System uses AI to predict:
• When you'll run out (considers sales pattern)
• Optimal reorder quantity
• Best day to order (based on supplier lead time)
• Price trend (if historical data available)

### 6. Recent Activity Feed
**Last 20 actions across the system:**

**Activity Types:**
🛒 Sale completed - "Bill #1234 - Rs. 550 - Cash"
📦 Product added - "Wai Wai Chicken added by Ramesh"
➕ Stock increased - "50 units of Kurkure added"
➖ Stock reduced - "10 damaged Sprite bottles removed"
👤 Customer added - "New customer: Sita Sharma"
💰 Expense recorded - "Rent - Rs. 15,000 by Owner"
📊 Report generated - "Monthly sales report downloaded"
⚙️ Settings changed - "Tax rate updated to 13%"
👥 User logged in - "Ramesh logged in from Device 2"
🔄 Cloud synced - "24 changes synced successfully"

**Details in Feed:**
• **Action**: What happened
• **User**: Who did it (staff name)
• **Time**: Exact timestamp (e.g., "2 minutes ago")
• **Related Items**: Clickable links (product names, bill numbers)

**Filtering Activities:**
• By user: See what specific staff member did
• By type: Only sales, only products, etc.
• By date range: Last hour/day/week
• Search: Type keyword to find

**Use Cases:**
✅ **Audit trail**: See who did what and when
✅ **Training**: Monitor new staff actions
✅ **Troubleshooting**: Find when error occurred
✅ **Accountability**: Track discounts, voids, deletions
✅ **Compliance**: Maintain records for audits

**Full Activity Log:**
Settings → Activity Log → Complete history (searchable, exportable)

## Dashboard Widgets (Customizable)

### Sales Chart Widget
**Interactive line/bar graph showing:**
• Hourly sales pattern (for today)
• Daily sales (for this week/month)
• Compare with previous period
• Filter by payment method
• Zoom in/out on timeline

**Insights You Can Discover:**
• Peak hours (when most sales happen)
• Slow periods (when to do inventory tasks)
• Day-of-week patterns (which days are best)
• Impact of promotions

### Top Categories Widget
**Pie chart showing revenue by category:**
• Beverages: 35%
• Snacks: 25%
• Personal Care: 20%
• Household: 15%
• Others: 5%

Helps you understand which categories drive most revenue.

### Payment Methods Widget
**Breakdown of how customers pay:**
• Cash: 60%
• Digital (eSewa/Khalti): 25%
• Card: 10%
• Credit: 5%

Important for:
• Cash flow planning
• Bank reconciliation
• Digital payment promotion decisions

### Customer Insights Widget
**Today's customer metrics:**
• New customers registered
• Returning customers
• Loyalty points redeemed
• Top customer by spend

## Customizing Your Dashboard

**Settings → Dashboard Preferences**

**Show/Hide Widgets:**
☑️ Sales Card
☑️ Profit Summary
☑️ Inventory Status
☑️ Fast Sellers
☑️ Low Stock Alerts
☑️ Recent Activity
☑️ Sales Chart
☐ Payment Methods (hide if not needed)
☐ Customer Insights

**Layout Options:**
• Compact: More widgets, smaller size
• Comfortable: Default spacing
• Spacious: Larger widgets, easier to read

**Refresh Rate:**
• Real-time (instant updates)
• Every 30 seconds (saves battery)
• Every 60 seconds
• Manual refresh only

**Default Date Range:**
• Today (default)
• This Week
• This Month
• Custom

## Dashboard Shortcuts

**Keyboard Shortcuts:**
• **F1**: Dashboard (from anywhere)
• **F2**: Quick billing
• **F3**: Product search
• **F4**: View reports
• **Ctrl+R**: Refresh dashboard

**Quick Action Buttons:**
At top-right of dashboard:
• + New Sale
• + Add Product
• + Record Expense
• 📊 View Reports
• ⚙️ Settings

## Dashboard Notifications

**Types of Notifications:**

**🔴 Critical (Red Badge):**
• Database error
• Printer offline during sale
• Payment gateway failed
• Negative stock (if not allowed)

**🟡 Warning (Yellow Badge):**
• Low stock alerts
• Cloud sync failed
• License expiring soon
• Backup overdue

**🔵 Info (Blue Badge):**
• New update available
• Backup completed
• Report ready
• Cloud sync successful

**Managing Notifications:**
• Click bell icon (top-right)
• View all notifications
• Click notification → Go to relevant screen
• "Mark all as read" button
• Settings → Choose which notifications to receive

## Dashboard Best Practices

### Morning Routine (Store Opening)
1. ✅ Check dashboard for overnight sync status
2. ✅ Review low stock alerts
3. ✅ Check if any pending customer orders
4. ✅ Verify cash drawer opening balance
5. ✅ Test printer (print test receipt)

### Evening Routine (Store Closing)
1. ✅ Review today's sales on dashboard
2. ✅ Check profit summary (did we hit target?)
3. ✅ Note any unusual activities in feed
4. ✅ Ensure all bills completed (no holds left)
5. ✅ Cash drawer reconciliation
6. ✅ Backup data (Settings → Backup)

### Weekly Review (Every Sunday)
1. 📊 View 7-day sales trend
2. 📊 Identify best and worst days
3. 📊 Check top-selling products
4. 📊 Review dead stock items
5. 📊 Plan next week's purchases

## Mobile Dashboard

**Mobile app has simplified dashboard:**
• Smaller cards (optimized for phone)
• Swipe left/right to navigate
• Pull-down to refresh
• Tap widgets to expand
• Bottom navigation bar

**Mobile-Specific Features:**
• Camera quick-access for billing
• Voice search for products
• GPS for multi-location tracking
• Push notifications enabled

## Dashboard Performance Tips

**Speed up dashboard loading:**
✅ Reduce number of visible widgets
✅ Increase refresh interval
✅ Archive old products (if thousands in catalog)
✅ Close unused browser tabs
✅ Clear browser cache monthly

**Optimize for slow internet:**
✅ Enable "Load dashboard in offline mode first"
✅ Sync only critical data in real-time
✅ Use "Lightweight mode" in Settings

Next: Learn how to add and manage products! →`
    },
    {
      id: "billing-system",
      title: "🛒 Billing System & POS",
      description: "Master the complete sales process from scanning to payment",
      icon: ShoppingCart,
      content: `# Billing System & Point of Sale

Complete guide to processing sales, managing payments, and generating receipts in Aadhar POS.

## Starting a New Bill

### Two Ways to Begin:

**Method 1: Dashboard Quick Action**
• Click **"New Sale"** button (bright green, top of dashboard)
• Keyboard shortcut: **F2**
• Opens billing screen instantly

**Method 2: From Sidebar**
• Click **"Billing"** in left sidebar
• Click **"+ New Bill"** button
• Same billing interface opens

**Billing Screen Layout:**
✅ **Left Panel**: Product search & barcode scanner
✅ **Center Panel**: Cart items list
✅ **Right Panel**: Customer info, totals, payment buttons

## Adding Products to Bill - 3 Methods

### Method 1: Barcode Scanner (Fastest)

**Step-by-Step:**
1. Ensure cursor is in search bar (top-left)
2. Scan product barcode with handheld scanner
3. **Beep** sound confirms successful scan
4. Product adds to cart automatically
5. Default quantity: 1 unit
6. Scan again to increase quantity by 1
7. Or scan different products

**Speed Billing Tips:**
✅ Keep scanner within reach
✅ Pre-sort products for faster scanning
✅ Use scanner's continuous mode for bulk items
✅ Average speed: 30-40 items per minute

### Method 2: Search by Name

**For products without barcodes:**
1. Click search bar (or press **F3**)
2. Type product name (minimum 2 characters)
3. Real-time search results appear below
4. Click desired product from list
5. Product adds to cart with quantity 1

**Search Features:**
• **Smart Search**: Searches by name, brand, category
• **Fuzzy Matching**: "colgate" finds "Colgate Total"
• **Keyboard Navigation**: Arrow keys to select, Enter to add
• **Recent Products**: Shows last 10 added products

### Method 3: Category Browse

**For exploratory customers:**
1. Click **"Browse Categories"** button
2. Grid view of all product categories
3. Click category (e.g., "Beverages")
4. See all products in that category
5. Click product card to add to cart

**Perfect for:**
• New customers exploring
• Gift shopping scenarios
• Impulse purchase opportunities

## Managing Cart Items

### Adjusting Quantities

**Increase Quantity:**
• Click **"+"** button next to item
• Or scan barcode again
• Or click quantity number, type new amount

**Decrease Quantity:**
• Click **"-"** button next to item
• Quantity reduces by 1
• If quantity reaches 0, item removed

**Quick Quantity Entry:**
• Click on quantity number (e.g., "2")
• Numeric keypad appears on screen
• Type desired quantity (e.g., "15")
• Press **Enter** or click **"Done"**
• Quantity updates instantly

**Decimal Quantities** (for loose items):
• Enable in Settings > Billing > "Allow decimal quantities"
• Example: 0.5 kg rice, 1.25 liters oil
• Type: 1.25 [Enter]

### Applying Discounts

**Item-Level Discount:**
1. Click **discount icon** (%) next to item
2. Choose discount type:
   • **Percentage**: 10%, 15%, 20%, custom
   • **Fixed Amount**: Rs 50 off, Rs 100 off, custom
3. Enter discount value
4. Discount applies to that line item only
5. Discounted price shows in red
6. **Discount reason**: Optional field for accountability

**Bill-Level Discount:**
1. Scroll to bottom of cart
2. Click **"Apply Discount to Entire Bill"**
3. Same percentage/fixed options
4. Discount distributes proportionally across all items
5. Useful for: "10% off entire purchase" offers

**Permission Control:**
• Admins can restrict discount limits per user
• Example: Staff can give max 5%, manager max 20%
• Exceeding limit requires manager PIN

### Removing Items

**Single Item:**
• Click **trash icon** (🗑️) next to item
• Confirmation popup: "Remove [Product Name]?"
• Click **"Yes, Remove"**
• Item disappears from cart

**Clear Entire Cart:**
• Click **"Clear All"** button (bottom of cart)
• Warning: "Remove all X items from cart?"
• Click **"Clear Cart"**
• Cart empties completely
• Use for: Starting fresh, wrong customer

## Customer Selection

### Why Add Customer?

**Benefits:**
✅ Track purchase history per customer
✅ Earn/redeem loyalty points
✅ Send digital bill via SMS/WhatsApp
✅ Enable credit/account sales
✅ Personalized future recommendations

### Adding Customer to Bill

**For Existing Customer:**
1. Click **"Select Customer"** dropdown (right panel)
2. Start typing customer name or phone number
3. Auto-complete shows matching customers
4. Click customer from list
5. Customer info appears: Name, phone, points balance
6. Points available for redemption show

**For New Customer (Quick Add):**
1. Click **"+ New Customer"** in dropdown
2. Mini form appears:
   • Name (required)
   • Phone (required, 10 digits)
   • Email (optional)
3. Click **"Add & Select"**
4. Customer created and selected for this bill
5. Full profile can be edited later

**For Walk-In Customer:**
• Leave customer field as **"Walk-in Customer"** (default)
• Bill processes normally
• No loyalty points earned
• Receipt prints without customer details

### Loyalty Points on Bill

**Earning Points:**
• Configured in Settings > Loyalty Program
• Example: Rs 100 spent = 1 point
• Bill of Rs 500 = 5 points earned
• Points credit after payment completion
• Shows on receipt: "You earned 5 points!"

**Redeeming Points:**
1. Customer must be selected
2. Points balance shows: "Available: 250 points"
3. Click **"Redeem Points"** button
4. Choose redemption:
   • Full redemption: Use all points
   • Partial redemption: Enter custom amount
5. Redemption value calculated (e.g., 1 point = Rs 1)
6. Discount applies to bill total
7. Points deducted from customer account

**Points Rules:**
• Minimum redemption: Usually 50-100 points
• Points expiry: Optional (e.g., 365 days)
• Points on discounted bills: Configurable

## Payment Processing

### Payment Methods Available

**1. Cash Payment**
**2. Card Payment** (Credit/Debit)
**3. UPI Payment** (PhonePe, Google Pay, Paytm, etc.)
**4. Digital Wallets**
**5. Credit/Account Sale**
**6. Bank Transfer**
**7. Split Payment** (Multiple methods combined)

### Cash Payment Process

1. Review bill total (bottom-right, large font)
2. Click **"Cash"** button (green)
3. **Cash Calculator** modal opens
4. Enter amount received from customer
   • Quick buttons: Rs 100, Rs 200, Rs 500, Rs 1000, Rs 2000
   • Or type custom amount
5. **Change Due** calculates automatically
   • Example: Bill Rs 485, Received Rs 500 = Change Rs 15
6. System suggests **optimal change breakdown**:
   • 1 × Rs 10 note
   • 1 × Rs 5 coin
7. Click **"Complete Payment"**
8. Receipt prints automatically (if printer connected)
9. Success message: "Payment received! Rs 15 change due"
10. Option to **send digital receipt** via SMS/WhatsApp

**Cash Management:**
• Running cash total updates in drawer tracker
• End-of-day cash count for reconciliation
• Cash denominations report

### Card Payment Process

1. Click **"Card"** payment button
2. Select card type:
   • **Credit Card**
   • **Debit Card**
3. Enter last 4 digits of card (for reference)
4. Enter **transaction reference number**
5. Optional: Card brand (Visa/MasterCard/RuPay)
6. Click **"Process Card Payment"**
7. **Card Machine**: Swipe/insert/tap card separately
8. Wait for approval from card terminal
9. If approved: Click **"Payment Successful"** in AADHAR
10. If declined: Click **"Payment Failed"**, choose another method
11. Receipt prints with card details masked

**EDC Machine Integration:**
• Some card machines integrate directly
• Auto-captures transaction ID
• No manual entry needed

### UPI Payment Process

1. Click **"UPI"** payment button (orange)
2. System generates **UPI QR Code** instantly
3. **Dynamic QR**: Contains exact bill amount
4. Show QR code to customer on screen/tablet
5. Customer scans with any UPI app:
   • PhonePe
   • Google Pay (GPay)
   • Paytm
   • BHIM
   • Bank UPI apps
6. Customer enters UPI PIN on their phone
7. **Auto-Detection**: Aadhar checks for payment confirmation
8. If successful: ✅ "Payment Received!" (5-10 seconds)
9. If not detected: Manual confirmation option
10. Transaction ID captured automatically
11. Receipt prints with UPI details

**UPI Advantages:**
✅ No card machine needed
✅ No transaction fees (for most)
✅ Instant confirmation
✅ Digital audit trail
✅ Works with all UPI apps

**UPI Troubleshooting:**
• **Timeout**: If no payment in 2 minutes, QR expires
• **Failed Payment**: Customer gets refund, generate new QR
• **Network Issue**: Payment may succeed but not reflect immediately, check UPI statement

### Split Payment (Multiple Methods)

**Common Scenarios:**
• Part cash + part card
• Part UPI + part points
• 3-way split for group bills

**How to Split:**
1. Review total bill amount: Rs 1,500
2. Click **"Split Payment"** button
3. Payment split screen opens
4. **Remaining to collect**: Rs 1,500 (shows in red)

5. **First payment method**:
   • Click "Cash"
   • Enter amount: Rs 500
   • Click "Add Payment"
   • Remaining: Rs 1,000 (updates)

6. **Second payment method**:
   • Click "UPI"
   • Enter amount: Rs 700
   • Generate QR, customer pays
   • Remaining: Rs 300

7. **Third payment method**:
   • Click "Card"
   • Amount auto-fills: Rs 300 (remaining balance)
   • Process card payment

8. **When Remaining = Rs 0**:
   • **"Complete Bill"** button activates (green)
   • Click to finalize
   • Receipt shows all 3 payment methods

**Split Payment Rules:**
• Unlimited payment methods allowed
• Total must match bill exactly
• Each method recorded separately in reports
• Useful for corporate bills, group orders

### Credit/Account Sale

**For Trusted Customers:**

**Prerequisites:**
• Customer must be selected
• Customer must have credit enabled in profile
• Credit limit must be set (e.g., Rs 10,000)

**Process:**
1. Complete bill as normal
2. Click **"Credit Sale"** button (yellow)
3. Shows customer credit info:
   • Current outstanding: Rs 2,500
   • Credit limit: Rs 10,000
   • Available credit: Rs 7,500
4. If bill within limit:
   • Click **"Add to Account"**
   • No payment collected now
   • Bill added to customer's outstanding balance
   • Due date calculated (e.g., 30 days)
5. If bill exceeds limit:
   • Warning: "Exceeds credit limit by Rs 500"
   • Options: Reduce bill, collect partial payment, or manager override

**Credit Management:**
• View all credit customers in "Customers" section
• Send payment reminders via SMS
• Track overdue accounts
• Interest calculation (optional)

## Receipt Generation

### Automatic Receipt Printing

**After payment completion:**
1. Receipt generates automatically
2. If **thermal printer** connected:
   • Prints immediately (3-4 seconds)
   • 3-inch thermal paper
   • Black & white
3. If **no printer**:
   • Receipt preview on screen
   • Option to print on regular printer
   • Or send digitally

### Receipt Content

**Header Section:**
• Shop logo (if uploaded)
• Shop name in bold
• Shop address
• Phone number
• GSTIN (if GST registered)
• "TAX INVOICE" title

**Bill Details:**
• Bill Number: #00234 (auto-increment)
• Date & Time: 29-11-2025 03:45 PM
• Cashier Name: Rajesh Kumar
• Customer Name: Amit Sharma (if selected)
• Customer Phone: +91 98765 43210

**Items Table:**

| Item              | Qty | Price   | Total    |
|-------------------|-----|---------|----------|
| Colgate Max Fresh | 2   | Rs 85.00  | Rs 170.00  |
| Surf Excel 1kg    | 1   | Rs 150.00 | Rs 150.00  |
| Lays Chips        | 3   | Rs 20.00  | Rs 60.00   |

**Calculations:**
• Subtotal: Rs 380.00
• Discount (5%): -Rs 19.00
• Taxable Amount: Rs 361.00
• CGST (9%): Rs 32.49
• SGST (9%): Rs 32.49
• **Grand Total: Rs 425.98**

**Payment Details:**
• Payment Method: UPI (PhonePe)
• Transaction ID: 425876321456
• Paid Amount: Rs 425.98

**Loyalty Points:**
• Points Earned: 4 points
• Total Points Balance: 254 points

**Footer:**
• "Thank you for shopping with us!"
• "Visit again!"
• Return/Exchange Policy (optional)
• Customer support number

### Digital Receipt Options

**Send via SMS:**
1. After payment, click **"Send SMS"** button
2. Enter customer mobile number (or auto-filled)
3. SMS contains:
   • Bill summary
   • Total amount
   • Link to view full receipt online
4. Customer clicks link
5. Opens receipt in mobile browser
6. Can download PDF or take screenshot

**Send via WhatsApp:**
1. Click **"Send WhatsApp"** button
2. Enter customer WhatsApp number
3. Options:
   • **Text Message**: Summary + link
   • **PDF Attachment**: Full receipt as PDF file
4. Click **"Send"**
5. Opens WhatsApp Web/App
6. Message pre-filled, click send
7. Customer receives receipt in WhatsApp chat

**Email Receipt:**
1. Click **"Email"** button
2. Enter customer email address
3. Subject: "Receipt from [Your Shop] - Bill #00234"
4. Body: Professional HTML email template
5. PDF receipt attached
6. Click **"Send Email"**
7. Email sent via SMTP
8. Customer receives in inbox

**Benefits of Digital Receipts:**
✅ No paper waste (eco-friendly)
✅ Customer won't lose receipt
✅ Easy for returns/exchanges
✅ Professional image
✅ SMS costs only Rs 0.20-0.50 per message

## Hold/Park Bills

**Use Case:** Customer needs to step out, take a call, or needs time to decide.

### How to Hold a Bill:

1. Add items to cart as usual
2. Instead of payment, click **"Hold Bill"** button (orange)
3. **Hold Reason** popup:
   • Select reason: "Customer will return", "Waiting for approval", "Custom"
   • Add note (optional): "Customer went to ATM"
4. Click **"Hold"**
5. Bill saved in **"Held Bills"** list
6. Bill number assigned: #HOLD-034
7. Cart clears, ready for next customer

### Retrieving Held Bills:

1. Click **"Held Bills"** button (top of billing screen)
2. Shows list of all parked bills:
   • Bill #HOLD-034
   • Time held: 5 minutes ago
   • Items count: 8 items
   • Total amount: Rs 1,250
3. Click **"Resume"** next to bill
4. Bill loads back into cart
5. Continue where you left off
6. Complete payment normally

**Held Bill Management:**
• Bills auto-delete after 24 hours (configurable)
• Maximum 50 bills can be held simultaneously
• Mark bill as "Cancelled" if customer doesn't return
• Held bills visible only to user who created (or manager)

## KOT (Kitchen Order Token)

**For restaurants/cafes using Aadhar POS:**

### Printing KOT:

1. Add food items to bill
2. Before payment, click **"Send to Kitchen"** button
3. **KOT prints** on kitchen printer:
   • Table number
   • Order number: KOT-045
   • Item list with quantities
   • Special instructions
   • Time: 03:45 PM
4. Kitchen starts preparing
5. Bill stays in system
6. When customer ready to pay, complete bill normally

**KOT Benefits:**
• Kitchen gets order immediately
• Reduces order errors
• Customer can order in multiple rounds (add to same bill)
• Tracks preparation time

## Bill Modifications After Payment

### Reprint Receipt

**Scenario**: Customer lost receipt, needs copy for records.

1. Go to **"Sales History"** (sidebar)
2. Find the bill by:
   • Search by bill number
   • Filter by date
   • Filter by customer name
3. Click on bill to view details
4. Click **"Reprint Receipt"** button
5. Receipt prints again (marked as "DUPLICATE")
6. Or send digitally via SMS/WhatsApp/Email

### Return/Exchange

**Full Return:**
1. Find original bill in Sales History
2. Click **"Return Bill"** button
3. Confirms all items returned
4. Select return reason:
   • Defective product
   • Wrong item
   • Customer changed mind
5. Select refund method:
   • Cash refund
   • Store credit
6. Process refund
7. **Return Receipt** generates
8. Stock adds back to inventory
9. Negative entry in sales report

**Partial Return:**
1. Open original bill
2. Click **"Partial Return"**
3. Select items to return (checkboxes)
4. Adjust quantities if needed
5. Refund amount calculates
6. Process refund
7. Original bill marked as "Partially Returned"

**Exchange:**
1. Process return first (above steps)
2. Create new bill immediately
3. Add replacement products
4. If new bill amount > old bill: Collect difference
5. If new bill amount < old bill: Refund difference
6. Both bills linked in system

**Return Rules:**
• Configurable return period (e.g., 7 days)
• Some products can be marked "Non-returnable"
• Manager approval required for returns > Rs 5,000

## Billing Keyboard Shortcuts

Speed up billing with these shortcuts:

• **F2**: New Bill
• **F3**: Focus search bar
• **F4**: Select customer
• **F5**: Apply discount
• **F8**: Hold bill
• **F9**: Cash payment
• **F10**: Complete bill
• **Ctrl + K**: Toggle calculator
• **Ctrl + H**: View held bills
• **Esc**: Clear search/close modal
• **Enter**: Add selected product
• **Delete**: Remove last item
• **+**: Increase quantity of last item
• **-**: Decrease quantity of last item

**Number Pad Shortcuts:**
• Type quantity before scanning: "5" then scan = adds 5 units
• Quick amounts: "1000" + Enter = Rs 1000 cash payment

## Billing Best Practices

**Speed Tips:**
✅ Use barcode scanner for 90% of products
✅ Keep frequently sold items at top of categories
✅ Train staff on keyboard shortcuts
✅ Pre-open new bill screen during slow times
✅ Organize products on shelf by barcode type

**Accuracy Tips:**
✅ Always review cart before payment
✅ Read back total to customer
✅ Double-check discount applications
✅ Verify customer selection for loyalty
✅ Count cash twice

**Customer Experience:**
✅ Greet customer while scanning
✅ Mention total clearly
✅ Ask about payment method preference
✅ Offer digital receipt option
✅ Hand receipt with "Thank you!"

**Error Prevention:**
✅ Don't scan same item twice by mistake
✅ Check quantity before finalizing
✅ Ensure customer is present before payment
✅ Verify card approval before completing
✅ Keep held bills list clean (clear old ones)

## Troubleshooting Common Issues

**Issue: Barcode scanner not working**
🔧 Check USB/Bluetooth connection
🔧 Test scanner in notepad (should type numbers)
🔧 Ensure cursor in search field
🔧 Try manual code entry
🔧 Check scanner battery (if wireless)

**Issue: Product not found**
🔧 Verify barcode is correct
🔧 Check if product exists in catalog
🔧 Add product manually if new
🔧 Use search by name instead

**Issue: Printer not printing**
🔧 Check printer power and paper
🔧 Verify USB/network connection
🔧 Test print from Settings
🔧 Check print queue
🔧 Restart printer

**Issue: UPI payment not confirming**
🔧 Wait 30 seconds for auto-detection
🔧 Check customer's UPI app (may show success)
🔧 Click manual confirmation if needed
🔧 Ask customer for UTR number for verification
🔧 Check network connection

**Issue: Discount not applying**
🔧 Check user permission level
🔧 Ensure discount type selected correctly
🔧 Verify discount value entered
🔧 Try bill-level discount instead of item-level

**Issue: Customer points not showing**
🔧 Verify customer selected (not walk-in)
🔧 Check customer profile has phone number
🔧 Ensure loyalty program enabled in settings
🔧 Verify customer hasn't exceeded points limit

Next: Unlock powerful business insights with AI analytics! →`
    },
    {
      id: "business-insights",
      title: "💡 Business Insights & AI Analytics",
      description: "Data-driven decisions with predictive analytics and smart recommendations",
      icon: TrendingUp,
      content: `# Business Insights & AI Analytics

Harness the power of artificial intelligence to optimize inventory, predict sales, and maximize profits with Aadhar POS's advanced analytics engine.

## What is Business Insights?

**Reporting and insights** built from your own sales, inventory and customer data, surfacing trends, slow-moving stock and reorder suggestions you can act on.

**Key Features:**
✅ **Fast-Moving Items Detection**: Identify bestsellers automatically
✅ **Dead Stock Alerts**: Find products not selling
✅ **Profit Optimization**: Maximize margins intelligently
✅ **Sales Predictions**: Forecast future demand
✅ **Reorder Suggestions**: Never run out of stock
✅ **Seasonal Trends**: Understand demand patterns
✅ **Insight Score**: Overall business health rating
✅ **Smart Alerts**: Proactive notifications

## Accessing Insights Dashboard

**From Main Dashboard:**
1. Click **"Business Insights"** card (purple gradient)
2. Or click **"Insights"** in sidebar
3. Or use keyboard shortcut: **Ctrl + I**

**Insights Dashboard Layout:**
• **Top Section**: Insight Score (0-100 rating)
• **Middle Section**: Key metrics cards
• **Bottom Section**: Detailed insights list
• **Right Panel**: Quick actions

## Understanding Insight Score

### What is Insight Score?

**0-100 rating** that represents your business health based on 12 factors:

**Calculation Factors:**
• Inventory turnover ratio (20 points)
• Dead stock percentage (15 points)
• Stock-out frequency (15 points)
• Profit margin trends (15 points)
• Customer retention rate (10 points)
• Sales growth rate (10 points)
• Fast-mover ratio (5 points)
• Expense management (5 points)
• Bill efficiency (3 points)
• Product diversity (2 points)

### Score Interpretation:

**90-100: Excellent ⭐⭐⭐⭐⭐**
• Business is thriving
• Inventory well-optimized
• High profitability
• Strong customer base
• Minimal issues

**75-89: Very Good ⭐⭐⭐⭐**
• Business performing well
• Few areas for improvement
• Good inventory management
• Healthy profit margins

**60-74: Good ⭐⭐⭐**
• Business is stable
• Several optimization opportunities
• Some dead stock concerns
• Average profitability

**40-59: Needs Attention ⭐⭐**
• Business facing challenges
• Multiple issues detected
• Inventory problems
• Profitability concerns
• Action required

**0-39: Critical ⭐**
• Business in trouble
• Urgent action needed
• Serious inventory issues
• Profitability crisis
• Immediate intervention required

**Score Updates:**
• Recalculates every 6 hours
• Based on last 30 days of data
• Historical score tracking available
• Trend graph shows improvement/decline

## Fast-Moving Items Detection

### What are Fast Movers?

**Products selling at high velocity** - your bestsellers that generate consistent revenue.

**Detection Algorithm:**
• Analyzes last 30 days of sales
• Calculates daily sale rate
• Compares to category averages
• Identifies top performers

### Viewing Fast Movers:

1. Go to **Insights Dashboard**
2. Click **"Fast-Moving Items"** card
3. See ranked list of top sellers:

**Fast Mover Display:**
• **Product Name**: Colgate MaxFresh
• **Daily Sale Rate**: 15 units/day
• **Total Sales (30d)**: 450 units
• **Revenue Generated**: Rs 38,250
• **Profit Contribution**: Rs 6,750 (15%)
• **Stock Status**: 250 units remaining
• **Days Until Stock-Out**: 16 days
• **Recommendation**: Reorder 500 units

**Fast Mover Categories:**
🔥 **Super Fast** (>20 units/day)
⚡ **Fast** (10-20 units/day)
🟢 **Moderate** (5-10 units/day)

### Actions for Fast Movers:

**✅ Prioritize Reordering**
• Never let fast movers go out of stock
• Maintain higher safety stock levels
• Set up auto-reorder triggers
• Negotiate bulk discounts with suppliers

**✅ Optimize Placement**
• Position at eye level on shelves
• Place near billing counter
• Feature in promotions
• Cross-sell with complementary items

**✅ Maximize Profits**
• Review pricing (can you increase slightly?)
• Bundle with slow movers
• Create combo offers
• Upsell premium variants

**✅ Stock Management**
• Increase par levels
• Monitor daily
• Alert on low stock (earlier than others)
• Consider consignment from supplier

## Dead Stock Detection

### What is Dead Stock?

**Products not selling** - inventory sitting idle, tying up cash, losing value.

**Dead Stock Criteria:**
• Zero sales in last 30 days, OR
• Sales rate < 0.1 units/day, OR
• Stock age > 90 days without movement

### Identifying Dead Stock:

1. Go to **Insights Dashboard**
2. Click **"Dead Stock Alert"** (red warning)
3. See list of non-moving products:

**Dead Stock Display:**
• **Product Name**: XYZ Soap Bar
• **Current Stock**: 120 units
• **Last Sale**: 45 days ago
• **Investment Locked**: Rs 6,000
• **Stock Age**: 78 days
• **Reason**: Low demand category
• **Recommended Action**: Clear out with discount

**Dead Stock Categories:**
🔴 **Critical** (>90 days, high value)
🟡 **Concern** (60-90 days)
🟠 **Monitor** (30-60 days, slow moving)

### Causes of Dead Stock:

**Common Reasons:**
• Product discontinued by manufacturer
• Customer preferences changed
• Seasonal item (off-season now)
• Overstock purchase
• Poor quality/damaged
• Price not competitive
• Lack of awareness
• Wrong product for your customer base

**System Insights:**
• AI identifies likely reason
• Compares to market trends
• Shows similar products performance
• Suggests root cause

### Actions for Dead Stock:

**Strategy 1: Discount & Clear**
1. Click **"Apply Clearance Discount"**
2. System suggests discount % (30-50%)
3. Mark as "Clearance Sale"
4. Promote via SMS to customers
5. Feature at billing counter
6. Bundle with fast movers
7. Goal: Recover at least cost price

**Strategy 2: Return to Supplier**
1. Check if returnable (within return window)
2. Contact supplier
3. Negotiate return/exchange
4. Credit note or replacement
5. Mark as "Returned to Supplier"

**Strategy 3: Donate/Write-Off**
1. If unsellable/expired
2. Donate to charity (tax benefit)
3. Or write-off as loss
4. Remove from inventory
5. Record in expense as "Stock Loss"

**Strategy 4: Rebrand/Repackage**
1. Create combo offers
2. Change packaging
3. Re-position product
4. Target different customer segment
5. Add to loyalty rewards

**Prevention Tips:**
✅ Order smaller quantities initially
✅ Monitor sales weekly
✅ Set minimum movement thresholds
✅ Review dead stock monthly
✅ Avoid emotional purchasing
✅ Data-driven ordering only

## Profit Analysis

### Real-Time Profit Tracking

**Dashboard Metrics:**
• **Gross Profit**: Revenue - Cost of Goods
• **Net Profit**: Gross Profit - Expenses
• **Profit Margin %**: (Net Profit / Revenue) × 100
• **Profit per Bill**: Average profit per transaction
• **Profit per Customer**: Lifetime value

### Product-Level Profitability:

**Most Profitable Products:**
1. Go to **Insights > Profitability**
2. See ranking by profit contribution:

**Display:**
• **Product**: Dove Shampoo 400ml
• **Units Sold**: 85 (last 30d)
• **Revenue**: Rs 17,000
• **Cost**: Rs 12,750 (75%)
• **Profit**: Rs 4,250 (25% margin)
• **Profit Rank**: #3
• **Insight**: High margin + Good volume = 🌟 Star Product

**Product Categories:**
⭐ **Stars**: High profit, high sales
💰 **Cash Cows**: Moderate profit, very high sales
🔮 **Question Marks**: High profit, low sales (promote!)
🗑️ **Dogs**: Low profit, low sales (consider removing)

### Pricing Optimization:

**AI Pricing Recommendations:**

System analyzes:
• Your cost price
• Current selling price
• Competitor prices (if available)
• Sales velocity at current price
• Price elasticity of demand
• Customer price sensitivity

**Recommendation Example:**
**Product**: Britannia Marie Gold 120g
**Current Price**: Rs 20 (Margin: 10%)
**Optimal Price**: Rs 22 (Margin: 18%)
**Impact Prediction**:
• Expected sales drop: 5% (from 100 to 95 units/day)
• Revenue change: +5% (Rs 2,000 to Rs 2,090/day)
• Profit change: +40% (Rs 200 to Rs 280/day)
**Recommendation**: ✅ Increase price to Rs 22

**Bulk Pricing Insights:**
• "Increase price of 15 low-volume items by 5-10%"
• "Reduce price of 3 items to match competitors"
• "Premium pricing opportunity on 8 products"

## Sales Predictions

### Demand Forecasting

**AI Prediction Engine** uses:
• Historical sales data (last 12 months)
• Seasonal patterns
• Day-of-week trends
• Month-end/start patterns
• Festival/holiday calendar
• Weather impact (if available)
• Local events
• Market trends

### Daily Sales Prediction:

**Morning Dashboard:**
• **Today's Predicted Sales**: Rs 45,000 ± Rs 3,000
• **Predicted Bills**: 120-135 customers
• **Peak Hours**: 11 AM - 1 PM, 6 PM - 9 PM
• **Confidence**: 85% (based on 30-day accuracy)

**Hourly Breakdown:**
• 9-10 AM: Rs 2,500 (12 bills)
• 10-11 AM: Rs 4,000 (18 bills)
• 11-12 PM: Rs 6,500 (25 bills) ← Peak
• ... continues for full day

**Use Cases:**
✅ Plan staff scheduling (more staff during peak)
✅ Stock preparation (keep fast movers ready)
✅ Cash management (ensure change available)
✅ Promotions timing (push during slow hours)

### Weekly Sales Prediction:

**Shows next 7 days forecast:**
• Monday: Rs 38,000 (Typical start slow)
• Tuesday: Rs 42,000
• Wednesday: Rs 45,000
• Thursday: Rs 44,000
• Friday: Rs 52,000 ← Weekend rush begins
• Saturday: Rs 65,000 ← Peak day
• Sunday: Rs 48,000
**Total Week**: Rs 3,34,000

**AI Alerts:**
• "Saturday is festival day - expect +30% sales"
• "Stock extra soft drinks (hot weather predicted)"
• "Month-end salary day - higher footfall expected"

### Monthly Growth Prediction:

**Next Month Forecast:**
• **Predicted Revenue**: Rs 12,50,000
• **Growth vs Last Month**: +12%
• **Confidence Level**: 78%
• **Key Drivers**:
  - Festival season boost (+Rs 80,000)
  - 2 new products launching (+Rs 30,000)
  - Marketing campaign impact (+Rs 25,000)

**Breakdown by Category:**
• Groceries: Rs 5,00,000 (+8%)
• Personal Care: Rs 3,50,000 (+15%)
• Beverages: Rs 2,00,000 (+10%)
• Snacks: Rs 1,50,000 (+20%)
• Others: Rs 50,000 (+5%)

### Product-Level Predictions:

**Individual Product Forecast:**
• **Product**: Maggi 2-Minute Noodles
• **Last Month Sales**: 450 units
• **Predicted Next Month**: 520 units (+15%)
• **Reason**: College reopening nearby
• **Suggested Stock**: 600 units (include safety stock)
• **Reorder Date**: November 5th
• **Supplier**: XYZ Distributors

## Reorder Recommendations

### Smart Reordering System

**Automatic Calculation** based on:
• Current stock level
• Daily sale rate
• Lead time from supplier (days)
• Safety stock requirement
• Predicted demand
• Seasonal adjustments

### Reorder Alert:

**Notification Example:**
🔔 **Reorder Alert: 12 products need reordering**

**Product Details:**
• **Product**: Amul Butter 500g
• **Current Stock**: 15 units
• **Daily Sale Rate**: 8 units/day
• **Days Remaining**: 1.8 days ⚠️
• **Lead Time**: 3 days
• **Safety Stock**: 10 units
• **Recommended Order**: 250 units
• **Cost**: Rs 50,000
• **Supplier**: Amul Distributor
• **Urgency**: 🔴 Critical (stock-out in 2 days!)

### Bulk Reorder Report:

**Weekly Reorder List:**
1. Click **"Reorder Report"** in Insights
2. See complete list of products to order:

| Product          | Current | Daily Rate | Days Left | Order Qty | Cost      | Priority |
|------------------|---------|------------|-----------|-----------|-----------|----------|
| Amul Butter 500g | 15      | 8/day      | 1.8       | 250       | Rs 50,000   | 🔴 High  |
| Britannia Bread  | 25      | 12/day     | 2.0       | 400       | Rs 32,000   | 🔴 High  |
| Dove Soap        | 40      | 5/day      | 8.0       | 150       | Rs 15,000   | 🟡 Med   |
| Colgate 200g     | 55      | 4/day      | 13.7      | 120       | Rs 8,400    | 🟢 Low   |

**Total Order Value**: Rs 1,05,400 (for 4 items)

**Bulk Actions:**
• **Generate Purchase Order**: Creates PO for all items
• **Send to Suppliers**: Email/WhatsApp PO to suppliers
• **Print Reorder List**: Physical copy for calling suppliers
• **Mark as Ordered**: Track order status

### Smart Ordering Tips:

**AI Suggestions:**
✅ **Consolidate Orders**: "Order from Supplier A worth Rs 50k+ to get 5% discount"
✅ **Timing**: "Wait 2 days to include 3 more items from Supplier B"
✅ **Alternatives**: "Product X unavailable, consider Product Y (similar)"
✅ **Seasonal**: "Festival approaching - increase order by 40%"

## Seasonal Demand Patterns

### Understanding Seasonality

**AI identifies cyclical patterns** in your sales data:
• Weekly patterns (weekends vs weekdays)
• Monthly patterns (month-end salary spikes)
• Seasonal patterns (summer vs winter)
• Festival patterns (Diwali, Eid, Christmas, etc.)
• Annual patterns (year-over-year trends)

### Seasonal Insights:

**Summer Trend (March-June):**
• **Cold Drinks**: +150% sales
• **Ice Cream**: +200% sales
• **Water Bottles**: +80% sales
• **Summer Fruits**: +120% sales
• **Winter Wear**: -95% sales (dead stock risk)

**Recommendation:**
✅ Stock up on summer items by February end
✅ Clear winter inventory with discounts in February
✅ Increase cooler/freezer capacity
✅ Negotiate bulk deals on beverages

**Festival Season (Oct-Nov):**
• **Sweets & Snacks**: +180% sales
• **Gift Items**: +250% sales
• **Decorative Items**: +300% sales
• **Personal Care**: +60% sales (gifting)

**Recommendation:**
✅ Order 3x normal stock for festival items
✅ Start stocking from September
✅ Create gift hampers
✅ Extend store hours

### Month-End Pattern:

**Salary Day Impact (28th-5th):**
• **Overall Sales**: +35% vs mid-month
• **Premium Products**: +60% sales
• **Bulk Purchases**: +80% (monthly household shopping)
• **Impulse Buys**: +45%

**Recommendation:**
✅ Stock premium items extra
✅ Schedule staff accordingly
✅ Run promotions on slow mid-month days
✅ Offer month-end combo deals

### Day-of-Week Pattern:

**Weekly Analysis:**
• **Monday**: Slowest (60% of avg)
• **Tuesday-Thursday**: Normal (90-100% of avg)
• **Friday**: Picks up (110% of avg)
• **Saturday**: Peak day (150% of avg)
• **Sunday**: Second peak (130% of avg)

**Staffing Recommendation:**
• Monday: 1 staff sufficient
• Saturday: Need 3+ staff for rush

## Insight Notifications

### Real-Time Smart Alerts

**Push Notifications** on mobile + desktop:

**Stock Alerts:**
🔔 "15 units of Colgate left - will stock-out in 2 days!"
🔔 "Dead stock detected: 12 products not sold in 30 days"
🔔 "New fast-mover: Britannia cookies now #3 bestseller"

**Profit Alerts:**
🔔 "Profit margin down 5% this week - review pricing"
🔔 "Opportunity: Increase price of 8 products for +Rs 500/day profit"
🔔 "Top 5 products contributing 60% profit - never stock-out!"

**Sales Alerts:**
🔔 "Sales down 20% vs last Monday - slow day"
🔔 "Peak hour starting (11 AM) - ensure staff ready"
🔔 "Today's target: Rs 45k | Current: Rs 38k | Need Rs 7k more"

**Reorder Alerts:**
🔔 "12 products need reordering worth Rs 1.2 lakhs"
🔔 "Critical: Amul Butter stock-out in 24 hours!"
🔔 "Supplier offer: 10% off on order >Rs 50k till tomorrow"

**Customer Alerts:**
🔔 "50 customers haven't visited in 30 days - send recall SMS"
🔔 "Top customer birthday tomorrow - offer special discount"
🔔 "5 customers with pending credit payment >30 days"

### Configuring Alerts:

**Settings > Notifications > Business Insights:**
• Enable/disable alert types
• Set thresholds (e.g., alert when stock <3 days)
• Choose notification method:
  - Push notification
  - SMS
  - Email
  - In-app only
• Set quiet hours (e.g., no alerts 10 PM - 9 AM)
• Alert frequency (real-time vs daily digest)

## Custom Reports & Analytics

### Creating Custom Insights:

1. Go to **Insights > Custom Reports**
2. Click **"Create New Report"**
3. Choose analysis type:
   • Product performance analysis
   • Customer behavior analysis
   • Time-based analysis
   • Profit optimization analysis
   • Inventory analysis

4. **Select Parameters:**
   • Date range (last 7/30/90 days, custom)
   • Product categories (all or specific)
   • Customer segments (all, loyal, new, etc.)
   • Metrics to analyze (sales, profit, quantity)
   • Grouping (by day/week/month)

5. **AI Analysis:**
   • System processes data
   • Identifies patterns
   • Generates insights
   • Creates visualizations
   • Provides recommendations

6. **Report Output:**
   • Summary dashboard
   • Detailed charts/graphs
   • Key findings (bullet points)
   • Actionable recommendations
   • Export to PDF/Excel

### Export & Sharing:

• **PDF Export**: Professional formatted report
• **Excel Export**: Raw data + charts for further analysis
• **Share via Email**: Send to stakeholders
• **Schedule Reports**: Auto-generate and email weekly/monthly

## Competitive Insights

**Market Intelligence Features:**
• Compare your prices with market averages (if data available)
• Identify overpriced/underpriced products
• Benchmark sales performance
• Category-wise market share estimates
• Trending products in your area

**Pricing Intelligence:**
🔍 "Your Colgate 200g: Rs 85 | Market Avg: Rs 82 | Competitor A: Rs 80"
💡 Recommendation: Consider reducing to Rs 82 or add value (combo offer)

Next: Master expense tracking and profit monitoring! →`
    },
    {
      id: "expenses-profit",
      title: "💰 Expenses & Profit Management",
      description: "Track all expenses and monitor real-time profitability",
      icon: DollarSign,
      content: `# Expenses & Profit Management

Complete expense tracking and profit analysis to understand your true business profitability.

## Understanding Profit vs Revenue

**Revenue (Sales)**: Money coming in from sales
**Gross Profit**: Revenue - Cost of Goods Sold (COGS)
**Net Profit**: Gross Profit - All Expenses

**Example:**
• Revenue: Rs 1,00,000
• COGS: Rs 65,000 (cost of products sold)
• **Gross Profit**: Rs 35,000 (35% margin)
• Expenses: Rs 18,000 (rent, salary, electricity, etc.)
• **Net Profit**: Rs 17,000 (17% net margin)

**Why Track Expenses?**
✅ Know true profitability (not just sales)
✅ Identify cost-cutting opportunities
✅ Better tax planning
✅ Informed business decisions
✅ Cash flow management

## Adding Expenses

### Quick Expense Entry:

1. Click **"Expenses"** in sidebar
2. Click **"+ Add Expense"** button
3. **Expense Entry Form**:

**Required Fields:**
• **Expense Category**: Select from dropdown
  - Rent
  - Electricity Bill
  - Water Bill
  - Staff Salary
  - Internet/Phone
  - Fuel/Transportation
  - Maintenance/Repairs
  - Marketing/Advertising
  - Bank Charges
  - Office Supplies
  - Professional Fees
  - Taxes & Licenses
  - Miscellaneous
  - Other (custom)

• **Amount**: Rs 5,000
• **Date**: 29-11-2025 (defaults to today)
• **Payment Method**: Cash / Bank Transfer / UPI / Card

**Optional Fields:**
• **Description**: "November rent for shop premises"
• **Vendor/Payee**: "ABC Properties"
• **Receipt Number**: "RENT-NOV-2025"
• **Receipt Photo**: Upload image (from phone camera)
• **Recurring**: Yes/No (for monthly fixed expenses)

4. Click **"Save Expense"**
5. Expense recorded instantly
6. Profit calculations update automatically

### Recurring Expenses:

**For Monthly Fixed Costs:**
1. Add expense normally
2. Check **"Recurring"** option
3. Select frequency:
   • Monthly (e.g., rent)
   • Weekly (e.g., staff weekly pay)
   • Quarterly (e.g., maintenance)
   • Yearly (e.g., license renewal)
4. Set start date and end date (optional)
5. System auto-creates expense each period
6. **Reminder notification** 2 days before due date

**Benefits:**
✅ Never forget regular payments
✅ Accurate monthly profit projections
✅ Quick expense history
✅ Auto-populated details

### Expense Approval Workflow:

**For Multi-Staff Setup:**
1. Staff member adds expense
2. Status: **"Pending Approval"**
3. Manager gets notification
4. Manager reviews:
   • Receipt photo
   • Amount reasonableness
   • Budget impact
5. Manager approves or rejects
6. If approved: Adds to expense reports
7. If rejected: Staff gets notification with reason

**Permission Levels:**
• **Staff**: Can add <Rs 1,000 expenses (auto-approve)
• **Manager**: Can add <Rs 10,000 expenses (auto-approve)
• **Owner**: Unlimited (all approve)

## Expense Categories Explained

### 1. Rent
**What**: Shop premises rent, warehouse rent
**Frequency**: Usually monthly
**Typical Amount**: Rs 10,000 - Rs 50,000+
**Tax**: Not directly deductible from GST, but reduces taxable profit

### 2. Electricity Bill
**What**: Power consumption charges
**Frequency**: Monthly
**Typical Amount**: Rs 2,000 - Rs 10,000
**Tip**: Track per unit cost, identify wastage

### 3. Staff Salary
**What**: Employee wages, salaries, bonuses
**Frequency**: Monthly/Weekly
**Typical Amount**: Rs 10,000 - Rs 50,000 per staff
**Tip**: Include PF, ESI if applicable

### 4. Marketing/Advertising
**What**: Pamphlets, banners, social media ads, SMS campaigns
**Frequency**: As needed
**Typical Amount**: Rs 1,000 - Rs 20,000
**ROI Tracking**: Monitor sales increase after campaign

### 5. Maintenance/Repairs
**What**: Shop repairs, equipment servicing, painting
**Frequency**: Occasional
**Typical Amount**: Rs 500 - Rs 15,000
**Tip**: Preventive maintenance cheaper than emergency repairs

### 6. Bank Charges
**What**: Account fees, transaction charges, card machine fees
**Frequency**: Monthly
**Typical Amount**: Rs 200 - Rs 2,000
**Tip**: Compare bank plans, negotiate rates

### 7. Miscellaneous
**What**: Small sundry expenses not fitting other categories
**Frequency**: As needed
**Typical Amount**: Varies
**Tip**: If exceeds 5% of total expenses, create specific category

## Viewing Expense Reports

### Daily Expenses:

**Quick View on Dashboard:**
• **Today's Expenses**: Rs 2,450
• **Top Expense**: Electricity Bill (Rs 2,000)
• **Payment Method**: Bank Transfer

**Detailed View:**
1. Click **"Expenses"** in sidebar
2. Default view: Today's expenses
3. See itemized list:

| Time  | Category    | Description      | Amount  | By    |
|-------|-------------|------------------|---------|-------|
| 10:30 | Electricity | MSEB Bill Nov    | Rs 2,000  | Admin |
| 14:15 | Supplies    | Packing material | Rs 450    | Staff |

**Total Today**: Rs 2,450

### Weekly Expense Report:

1. Select date range: **"Last 7 Days"**
2. See breakdown by category:

**Week of Nov 23-29:**
• **Rent**: Rs 15,000 (38%)
• **Salary**: Rs 12,000 (31%)
• **Electricity**: Rs 2,000 (5%)
• **Marketing**: Rs 3,500 (9%)
• **Supplies**: Rs 1,800 (5%)
• **Miscellaneous**: Rs 4,700 (12%)
**Total**: Rs 39,000

**Pie Chart Visualization**: Shows expense distribution
**Trend Line**: Compare to previous week

### Monthly Expense Report:

**November 2025 Expenses:**
• **Total Expenses**: Rs 85,000
• **Average Daily**: Rs 2,833
• **vs October**: +8% (Rs 6,000 more)
• **Highest Day**: Nov 1st (Rs 15,000 - rent day)
• **Lowest Day**: Nov 15th (Rs 450)

**Category Breakdown Table:**

| Category       | Amount    | % of Total | vs Last Month |
|----------------|-----------|------------|---------------|
| Rent           | Rs 30,000   | 35.3%      | 0%            |
| Staff Salary   | Rs 25,000   | 29.4%      | 0%            |
| Electricity    | Rs 6,000    | 7.1%       | +20%          |
| Marketing      | Rs 8,000    | 9.4%       | +60% ⬆️       |
| Maintenance    | Rs 5,000    | 5.9%       | New           |
| Others         | Rs 11,000   | 12.9%      | +10%          |

**Insights:**
⚠️ Electricity bill up 20% - check AC usage
⚠️ Marketing spend increased - evaluate ROI
✅ Rent & Salary stable as expected

### Yearly Expense Analysis:

**2025 Full Year:**
• **Total Expenses**: Rs 9,50,000
• **Average Monthly**: Rs 79,167
• **Highest Month**: December (Rs 1,20,000 - festive bonuses)
• **Lowest Month**: February (Rs 65,000)

**Year-over-Year Comparison:**
• 2024 Total: Rs 8,50,000
• 2025 Total: Rs 9,50,000
• **Increase**: Rs 1,00,000 (+11.8%)
• **Reasons**: Staff increment, electricity tariff hike, increased marketing

## Profit Dashboard

### Real-Time Profit Tracking:

**Today's Profit (Live):**
• **Sales Revenue**: Rs 45,800
• **COGS**: Rs 29,770 (65%)
• **Gross Profit**: Rs 16,030 (35%)
• **Expenses**: Rs 2,450
• **Net Profit**: Rs 13,580 (29.6% net margin)

**Profit Gauge**: Visual circular gauge showing profit %
• Green zone: >20% (Excellent)
• Yellow zone: 10-20% (Good)
• Red zone: <10% (Needs attention)

### Weekly Profit Report:

**This Week (Nov 23-29):**
• **Total Revenue**: Rs 3,15,000
• **Total COGS**: Rs 2,04,750 (65%)
• **Gross Profit**: Rs 1,10,250 (35%)
• **Total Expenses**: Rs 39,000
• **Net Profit**: Rs 71,250 (22.6% net margin)

**Daily Breakdown:**
• Monday: Rs 8,500 profit (slow day)
• Tuesday: Rs 10,200 profit
• Wednesday: Rs 11,500 profit
• Thursday: Rs 10,800 profit
• Friday: Rs 13,250 profit (weekend starts)
• Saturday: Rs 18,000 profit (peak day)
• Sunday: Rs 14,000 profit

**Trend Graph**: Line chart showing daily profit
**Best Day**: Saturday (Rs 18,000)
**Worst Day**: Monday (Rs 8,500)

### Monthly Profit Report:

**November 2025:**
• **Total Revenue**: Rs 12,50,000
• **Total COGS**: Rs 8,12,500 (65%)
• **Gross Profit**: Rs 4,37,500 (35%)
• **Total Expenses**: Rs 85,000 (6.8% of revenue)
• **Net Profit**: Rs 3,52,500 (28.2% net margin)

**vs October 2025:**
• Revenue: +5% (Rs 60,000 more)
• Profit: +8% (Rs 26,000 more)
• Profit margin: +0.8 percentage points
• **Trend**: ✅ Improving

**Profitability Metrics:**
• **Gross Margin**: 35% (healthy)
• **Net Margin**: 28.2% (excellent)
• **Operating Expense Ratio**: 6.8% (well-controlled)
• **Profit per Day**: Rs 11,750 average
• **Profit per Bill**: Rs 1,175 average

### Yearly Profit Summary:

**2025 Full Year:**
• **Total Revenue**: Rs 1.45 Crore
• **Total COGS**: Rs 94.25 Lakh (65%)
• **Gross Profit**: Rs 50.75 Lakh (35%)
• **Total Expenses**: Rs 9.50 Lakh (6.6%)
• **Net Profit**: Rs 41.25 Lakh (28.4%)

**Monthly Trend:**
• Best Month: December (Rs 4.8L profit)
• Worst Month: February (Rs 2.8L profit)
• Growth: 15% vs 2024

**Return on Investment (ROI):**
• Initial Investment: Rs 10 Lakh
• Annual Profit: Rs 41.25 Lakh
• **ROI**: 412.5% (recovered investment + 3x profit)
• **Payback Period**: ~3 months

## Cash Flow Analysis

### Understanding Cash Flow:

**Cash Flow ≠ Profit**
• Profit is accounting concept
• Cash flow is actual money in/out

**Example Scenario:**
• You sold Rs 1 lakh goods on credit
• Profit shows Rs 30k
• But cash in hand = Rs 0 (until customer pays)
• This is **positive profit, negative cash flow**

### Cash Flow Dashboard:

**Today's Cash Flow:**
• **Cash In** (Sales): Rs 45,800
• **Cash Out** (Expenses): Rs 2,450
• **Net Cash Flow**: +Rs 43,350
• **Closing Balance**: Rs 2,85,450

**Cash Position:**
✅ **Healthy**: 60+ days of expenses in reserve

**Cash Flow Categories:**

**Operating Cash Flow:**
• Cash from daily sales
• Cash paid for expenses
• Net: +Rs 43,350 today

**Investing Cash Flow:**
• Purchased new fridge: -Rs 25,000
• Bought shop furniture: -Rs 15,000
• Net: -Rs 40,000 this month

**Financing Cash Flow:**
• Owner investment: +Rs 50,000
• Loan repayment: -Rs 10,000
• Net: +Rs 40,000 this month

### Monthly Cash Flow Statement:

**November 2025:**

**Opening Balance** (Nov 1): Rs 2,50,000

**Cash Inflows:**
• Sales (cash): Rs 10,50,000
• Credit collected: Rs 1,50,000
• Other income: Rs 5,000
**Total In**: Rs 12,05,000

**Cash Outflows:**
• Purchases (suppliers): Rs 6,00,000
• Expenses paid: Rs 85,000
• Loan EMI: Rs 30,000
• Owner withdrawal: Rs 50,000
**Total Out**: Rs 7,65,000

**Net Cash Flow**: +Rs 4,40,000
**Closing Balance** (Nov 30): Rs 6,90,000

**Cash Runway**: 8.1 months (at current expense rate)

### Cash Flow Alerts:

**Low Cash Warning:**
🔴 "Cash balance below Rs 50,000 - only 15 days of expenses remaining"
**Action**: Collect pending credits, delay non-urgent expenses

**High Cash Opportunity:**
🟢 "Cash balance Rs 8 lakhs - consider investing in inventory for festive season"
**Action**: Stock up on fast movers, negotiate bulk discounts

## Budget Management

### Setting Monthly Budget:

1. Go to **"Expenses > Budget"**
2. Click **"Set Monthly Budget"**
3. **Category-wise Budget Allocation**:

| Category    | Budget   | Spent    | Remaining | Status |
|-------------|----------|----------|-----------|--------|
| Rent        | Rs 30,000  | Rs 30,000  | Rs 0        | 🟢     |
| Salary      | Rs 25,000  | Rs 25,000  | Rs 0        | 🟢     |
| Electricity | Rs 5,000   | Rs 6,000   | -Rs 1,000   | 🔴     |
| Marketing   | Rs 5,000   | Rs 3,500   | Rs 1,500    | 🟢     |
| Maintenance | Rs 3,000   | Rs 5,000   | -Rs 2,000   | 🔴     |
| Others      | Rs 10,000  | Rs 7,500   | Rs 2,500    | 🟢     |
**Total**    | Rs 78,000  | Rs 77,000  | Rs 1,000    | 🟢     |

**Budget Alerts:**
⚠️ "Electricity budget exceeded by Rs 1,000 (20%)"
⚠️ "Maintenance budget exceeded by Rs 2,000 (67%)"
✅ "Overall budget on track - 1% under budget"

### Budget vs Actual Analysis:

**Variance Report:**
• **Favorable Variance**: Spent less than budget (good)
• **Unfavorable Variance**: Spent more than budget (needs attention)

**Action Items:**
🔧 Electricity over-budget → Check AC usage, faulty equipment
🔧 Maintenance over-budget → Unexpected repairs, preventive maintenance needed
✅ Marketing under-budget → Room for additional campaigns

## Tax Planning

### Tax-Deductible Expenses:

**Fully Deductible:**
✅ Rent paid for business premises
✅ Staff salaries (with proper documentation)
✅ Electricity, water bills (business portion)
✅ Marketing & advertising
✅ Office supplies & stationery
✅ Professional fees (CA, lawyer)
✅ Insurance premiums (business)
✅ Bank charges & interest
✅ Depreciation on assets

**Partially Deductible:**
🟡 Vehicle expenses (business use %)
🟡 Mobile/internet (business use %)
🟡 Home office (if applicable)

**Non-Deductible:**
❌ Personal expenses
❌ Owner's salary (proprietorship)
❌ Penalties & fines
❌ Capital expenditure (use depreciation)

### GST Input Credit:

**Expenses with GST:**
• When you pay GST on expenses
• You can claim **Input Tax Credit (ITC)**
• Reduces your GST liability

**Example:**
• Sales GST collected: Rs 18,000
• Expense GST paid: Rs 5,000
• **Net GST payable**: Rs 13,000 (saved Rs 5,000)

**Ensure:**
✅ Valid GST invoice from vendor
✅ Vendor GSTIN mentioned
✅ Invoice uploaded to GST portal
✅ Payment made to vendor (for ITC >Rs 10k)

### Advance Tax Planning:

**Based on Profit Projections:**
• Estimate annual profit: Rs 41 Lakh
• Calculate tax liability: ~Rs 8.5 Lakh
• Pay in quarterly installments
• Avoid interest on late payment

**Aadhar helps:**
• Auto-calculates estimated tax
• Reminds before due dates
• Tracks tax payments
• Generates tax reports for CA

## Export Expense & Profit Reports

### Report Formats:

**PDF Report:**
• Professional formatted
• Company letterhead
• Charts & graphs included
• Summary + detailed tables
• Perfect for: Sharing with accountant, bank, partners

**Excel Export:**
• Raw data in spreadsheet
• Pivot table ready
• Formulas included
• Perfect for: Further analysis, tax filing

**CSV Export:**
• Simple comma-separated
• Compatible with any software
• Perfect for: Importing to accounting software

### Generating Report:

1. Go to **"Expenses > Reports"**
2. Select report type:
   • Expense Summary
   • Category-wise Expenses
   • Profit & Loss Statement
   • Cash Flow Statement
3. Choose date range
4. Select format (PDF/Excel/CSV)
5. Click **"Generate Report"**
6. Download or email directly

Next: Explore comprehensive reporting options! →`
    },
    {
      id: "reports",
      title: "📊 Reports & Analytics",
      description: "15+ comprehensive business reports with export capabilities",
      icon: BarChart3,
      content: `# Reports & Analytics

Access 15+ comprehensive business reports to analyze every aspect of your retail operations.

## Report Categories

**Sales Reports** (5 types)
**Inventory Reports** (4 types)
**Financial Reports** (3 types)
**Customer Reports** (2 types)
**Tax & Compliance Reports** (3 types)
**Staff Performance Reports** (2 types)

## Accessing Reports

**From Dashboard:**
• Click **"Reports"** card
• Or sidebar menu: **"Reports"**
• Keyboard shortcut: **Ctrl + R**

**Report Hub Layout:**
• Grid view of all report types
• Recent reports list
• Quick date filters
• Export options

## Sales Reports

### 1. Daily Sales Report

**Purpose**: Track sales performance for any specific day

**Access**: Reports > Sales > Daily Sales Report

**Parameters:**
• Select date (defaults to today)
• Select staff member (optional - all or specific)
• Include/exclude returns

**Report Contains:**

**Summary Section:**
• Total Bills: 125
• Total Items Sold: 487
• Gross Sales: Rs 45,800
• Discounts Given: Rs 2,150
• Returns: -Rs 1,200
• **Net Sales**: Rs 42,450
• Tax Collected (GST): Rs 5,890
• Average Bill Value: Rs 339.60
• Average Items per Bill: 3.9

**Time-Based Analysis:**
| Hour     | Bills | Sales   | Avg Bill |
|----------|-------|---------|----------|
| 9-10 AM  | 8     | Rs 2,400  | Rs 300     |
| 10-11 AM | 12    | Rs 3,800  | Rs 317     |
| 11-12 PM | 18    | Rs 6,200  | Rs 344     |
| 12-1 PM  | 22    | Rs 7,800  | Rs 355     |
| 1-2 PM   | 15    | Rs 4,900  | Rs 327     |
| ... continues for all hours

**Peak Hour**: 6-7 PM (28 bills, Rs 9,500)
**Slowest Hour**: 9-10 AM (8 bills, Rs 2,400)

**Payment Method Breakdown:**
• Cash: Rs 28,500 (67%)
• UPI: Rs 10,200 (24%)
• Card: Rs 3,750 (9%)

**Top 10 Selling Products:**
1. Britannia Marie Gold - 45 units - Rs 900
2. Colgate MaxFresh - 28 units - Rs 2,380
3. Amul Butter 500g - 22 units - Rs 4,400
... continues

**Staff Performance:**
• Rajesh Kumar: 85 bills, Rs 29,000
• Priya Sharma: 40 bills, Rs 13,450

**Export Options:**
• PDF (with charts)
• Excel (raw data)
• Print

### 2. Monthly Sales Report

**Purpose**: Comprehensive monthly performance analysis

**Access**: Reports > Sales > Monthly Sales Report

**Parameters:**
• Select month & year
• Compare with previous month (optional)

**Report Contains:**

**Executive Summary:**
• Total Revenue: Rs 12,50,000
• Total Bills: 3,650
• Total Items Sold: 14,280
• Gross Profit: Rs 4,37,500 (35%)
• Net Profit: Rs 3,52,500 (28.2%)
• Average Daily Sales: Rs 41,667
• Best Day: Nov 23 (Rs 65,000)
• Worst Day: Nov 5 (Rs 28,000)

**Daily Trend Graph:**
Line chart showing sales for all 30 days

**Week-by-Week Comparison:**
| Week | Sales       | Bills | Avg Bill | vs Prev Week |
|------|-------------|-------|----------|--------------|
| 1-7  | Rs 2,80,000   | 850   | Rs 329     | -           |
| 8-14 | Rs 3,15,000   | 920   | Rs 342     | +12.5%      |
| 15-21| Rs 3,25,000   | 940   | Rs 346     | +3.2%       |
| 22-30| Rs 3,30,000   | 940   | Rs 351     | +1.5%       |

**Category-Wise Sales:**
| Category      | Sales       | % Total | Units | Growth |
|---------------|-------------|---------|-------|--------|
| Groceries     | Rs 5,00,000   | 40%     | 5,200 | +8%    |
| Personal Care | Rs 3,50,000   | 28%     | 3,800 | +15%   |
| Beverages     | Rs 2,00,000   | 16%     | 2,100 | +10%   |
| Snacks        | Rs 1,50,000   | 12%     | 2,800 | +20%   |
| Others        | Rs 50,000     | 4%      | 380   | -5%    |

**Payment Methods:**
• Cash: Rs 8,40,000 (67.2%)
• UPI: Rs 2,80,000 (22.4%)
• Card: Rs 1,00,000 (8%)
• Credit: Rs 30,000 (2.4%)

**Customer Analysis:**
• Total Unique Customers: 1,850
• New Customers: 320 (17.3%)
• Repeat Customers: 1,530 (82.7%)
• Average Purchases per Customer: 1.97
• Customer Retention: 78%

**Top 20 Products:**
Ranked by revenue, quantity, and profit

**Insights & Recommendations:**
• Personal Care growing fastest (+15%)
• Weekend sales 40% higher than weekdays
• Peak time: 6-8 PM (stock accordingly)
• 12 products need reordering
• Dead stock: 8 items (consider clearance)

### 3. Product-Wise Sales Report

**Purpose**: Analyze individual product performance

**Access**: Reports > Sales > Product-Wise

**Parameters:**
• Date range
• Select category (optional)
• Select specific products (optional)
• Sort by: Revenue/Quantity/Profit

**Report Contains:**

**For Each Product:**
• Product Name
• Category
• Units Sold
• Revenue Generated
• Cost of Goods Sold
• Gross Profit
• Profit Margin %
• Average Selling Price
• Stock Remaining
• Stock Turnover Ratio

**Example Entry:**
**Colgate MaxFresh 200g**
• Units Sold: 450
• Revenue: Rs 38,250
• COGS: Rs 30,600 (Rs 68 per unit)
• Profit: Rs 7,650
• Margin: 20%
• Avg Price: Rs 85
• Current Stock: 120 units
• Turnover: 3.75x (excellent)
• Reorder Status: ✅ Well-stocked
• Trend: ⬆️ +15% vs last month

**Filters:**
• Show only fast movers
• Show only dead stock
• Show low stock items
• Show high profit items

**Sorting Options:**
• Highest revenue first
• Most quantity sold
• Best profit margin
• Fastest turnover

### 4. Category-Wise Sales Report

**Purpose**: Understand which product categories perform best

**Access**: Reports > Sales > Category-Wise

**Report Contains:**

| Category      | Products | Units  | Revenue     | Profit     | Margin | Share |
|---------------|----------|--------|-------------|------------|--------|-------|
| Groceries     | 285      | 5,200  | Rs 5,00,000   | Rs 1,75,000  | 35%    | 40%   |
| Personal Care | 180      | 3,800  | Rs 3,50,000   | Rs 1,22,500  | 35%    | 28%   |
| Beverages     | 95       | 2,100  | Rs 2,00,000   | Rs 60,000    | 30%    | 16%   |
| Snacks        | 125      | 2,800  | Rs 1,50,000   | Rs 45,000    | 30%    | 12%   |
| Others        | 65       | 380    | Rs 50,000     | Rs 15,000    | 30%    | 4%    |

**Pie Chart**: Visual representation of sales share
**Bar Graph**: Revenue comparison across categories

**Top Product per Category:**
• Groceries: Britannia Bread (Rs 25,000)
• Personal Care: Dove Shampoo (Rs 18,000)
• Beverages: Coca-Cola 2L (Rs 15,000)
• Snacks: Lays Chips (Rs 12,000)

### 5. Customer-Wise Sales Report

**Purpose**: Identify top customers and their buying patterns

**Access**: Reports > Customers > Sales Report

**Report Contains:**

**Top 50 Customers:**
| Rank | Customer Name  | Phone      | Bills | Total Spent | Avg Bill | Last Visit |
|------|----------------|------------|-------|-------------|----------|------------|
| 1    | Amit Sharma    | 9876543210 | 28    | Rs 45,800     | Rs 1,636   | Yesterday  |
| 2    | Priya Gupta    | 9876543211 | 22    | Rs 38,500     | Rs 1,750   | 2 days ago |
| 3    | Rahul Kumar    | 9876543212 | 35    | Rs 35,000     | Rs 1,000   | Today      |
... continues

**Customer Segmentation:**
• **VIP Customers** (>Rs 25k/month): 45 customers, Rs 12 Lakh revenue
• **Regular Customers** (Rs 10-25k/month): 180 customers, Rs 28 Lakh revenue
• **Occasional Customers** (<Rs 10k/month): 850 customers, Rs 8 Lakh revenue
• **One-Time Customers**: 775 customers, Rs 2 Lakh revenue

**Customer Lifetime Value (CLV):**
• Average CLV: Rs 15,420
• Top customer CLV: Rs 2,85,000 (3 years)
• New customer average: Rs 2,500

**Insights:**
• Top 50 customers = 45% of revenue
• Focus retention on top 200 customers
• 320 customers haven't visited in 30+ days (send recall SMS)

## Inventory Reports

### 6. Stock Summary Report

**Purpose**: Current stock status of all products

**Access**: Reports > Inventory > Stock Summary

**Report Contains:**

**Overall Metrics:**
• Total Products: 750
• Total Stock Value: Rs 18,50,000
• Well-Stocked: 620 products (83%)
• Low Stock: 85 products (11%)
• Out of Stock: 45 products (6%)

**Stock Value by Category:**
| Category      | Products | Stock Value  | % of Inventory |
|---------------|----------|--------------|----------------|
| Groceries     | 285      | Rs 8,50,000    | 46%           |
| Personal Care | 180      | Rs 5,20,000    | 28%           |
| Beverages     | 95       | Rs 2,80,000    | 15%           |
| Snacks        | 125      | Rs 1,50,000    | 8%            |
| Others        | 65       | Rs 50,000      | 3%            |

**Low Stock Alert List:**
85 products need reordering (critical priority)

**Out of Stock List:**
45 products currently unavailable

**Dead Stock List:**
28 products with zero movement in 60 days

### 7. Stock Movement Report

**Purpose**: Track how fast inventory is moving

**Access**: Reports > Inventory > Stock Movement

**Parameters:**
• Date range (e.g., last 30 days)
• Category filter

**Report Shows:**
| Product         | Opening | Purchased | Sold | Returned | Closing | Turnover |
|-----------------|---------|-----------|------|----------|---------|----------|
| Amul Butter 500g| 50      | 200       | 220  | 2        | 32      | 4.4x     |
| Colgate 200g    | 80      | 300       | 350  | 5        | 35      | 4.4x     |
... continues

**Turnover Ratio Interpretation:**
• **>5x**: Super fast mover (excellent)
• **3-5x**: Fast mover (good)
• **1-3x**: Moderate (acceptable)
• **<1x**: Slow mover (concern)
• **0x**: Dead stock (critical)

### 8. Stock Valuation Report

**Purpose**: Calculate total inventory value and analyze aging

**Access**: Reports > Inventory > Valuation

**Report Contains:**

**Valuation Method:**
• FIFO (First In First Out)
• Weighted Average Cost
• Last Purchase Price

**Total Inventory Value**: Rs 18,50,000

**Age Analysis:**
| Age       | Products | Value       | % of Total | Status |
|-----------|----------|-------------|------------|--------|
| 0-30 days | 450      | Rs 12,00,000  | 65%        | ✅ Fresh|
| 31-60 days| 180      | Rs 4,50,000   | 24%        | ✅ Good|
| 61-90 days| 85       | Rs 1,50,000   | 8%         | ⚠️ Old |
| 90+ days  | 35       | Rs 50,000     | 3%         | 🔴 Very Old|

**Aging Risk:**
• Rs 2 Lakh inventory >60 days (11% of total)
• Risk of expiry/obsolescence
• Recommend: Clearance sale

**Profit Locked in Inventory:**
• If all sold at current prices: Rs 6,47,500 potential profit
• Current unrealized profit: 35% margin

### 9. Reorder Report

**Purpose**: Products that need to be restocked

**Access**: Reports > Inventory > Reorder Report

**Auto-Generated Daily**

**Critical Priority (Stock-out in <3 days):**
| Product | Current | Daily Sale | Days Left | Order Qty | Est. Cost |
|---------|---------|------------|-----------|-----------|-----------|
| Bread   | 25      | 12/day     | 2.1       | 400 loaves| Rs 32,000   |
| Butter  | 15      | 8/day      | 1.9       | 250 units | Rs 50,000   |

**High Priority (Stock-out in 3-7 days):**
28 products listed with reorder recommendations

**Medium Priority (Stock-out in 7-14 days):**
45 products listed

**Total Reorder Value**: Rs 3,25,000 (for next week)

**Supplier-Wise Grouping:**
• ABC Distributors: 45 items, Rs 1,80,000
• XYZ Suppliers: 28 items, Rs 1,05,000
• Others: 15 items, Rs 40,000

**One-Click Actions:**
• Generate Purchase Orders
• Email to suppliers
• WhatsApp to suppliers
• Mark as ordered

## Financial Reports

### 10. Profit & Loss Statement (P&L)

**Purpose**: Complete financial performance overview

**Access**: Reports > Financial > P&L Statement

**Parameters:**
• Period: Monthly/Quarterly/Yearly
• Comparison: Yes/No (vs previous period)

**Report Format:**

**November 2025 P&L Statement**

**Revenue:**
• Gross Sales: Rs 12,80,000
• Less: Returns: -Rs 15,000
• Less: Discounts: -Rs 15,000
• **Net Sales**: Rs 12,50,000

**Cost of Goods Sold:**
• Opening Stock: Rs 15,00,000
• Add: Purchases: Rs 6,50,000
• Less: Closing Stock: -Rs 12,88,000
• **COGS**: Rs 8,62,000

**Gross Profit**: Rs 3,88,000 (31% margin)

**Operating Expenses:**
• Rent: Rs 30,000
• Salaries: Rs 25,000
• Electricity: Rs 6,000
• Marketing: Rs 8,000
• Maintenance: Rs 5,000
• Bank Charges: Rs 1,500
• Other Expenses: Rs 9,500
• **Total Expenses**: Rs 85,000

**Operating Profit (EBITDA)**: Rs 3,03,000 (24.2%)

**Other Income/Expenses:**
• Interest Income: +Rs 2,000
• Interest on Loan: -Rs 5,000
• Depreciation: -Rs 8,000
• **Net Other**: -Rs 11,000

**Net Profit Before Tax**: Rs 2,92,000 (23.4%)
**Tax Provision**: Rs 58,400 (20%)
**Net Profit After Tax**: Rs 2,33,600 (18.7%)

**vs October 2025:**
• Revenue: +5.2%
• Gross Profit: +6.8%
• Net Profit: +9.2%
• **Trend**: ✅ Improving

### 11. Cash Flow Statement

**Purpose**: Track actual cash movements

(See Expenses & Profit section for detailed format)

### 12. Balance Sheet

**Purpose**: Snapshot of financial position

**Access**: Reports > Financial > Balance Sheet

**As of 30-Nov-2025**

**Assets:**

*Current Assets:*
• Cash in Hand: Rs 85,000
• Bank Balance: Rs 6,05,000
• Inventory: Rs 18,50,000
• Accounts Receivable: Rs 1,80,000
• **Total Current**: Rs 27,20,000

*Fixed Assets:*
• Shop Furniture: Rs 2,50,000
• Equipment: Rs 3,50,000
• Less: Depreciation: -Rs 80,000
• **Net Fixed**: Rs 5,20,000

**Total Assets**: Rs 32,40,000

**Liabilities:**

*Current Liabilities:*
• Accounts Payable: Rs 4,50,000
• Short-term Loan: Rs 2,00,000
• **Total Current**: Rs 6,50,000

*Long-term Liabilities:*
• Business Loan: Rs 8,00,000

**Total Liabilities**: Rs 14,50,000

**Owner's Equity:**
• Capital: Rs 10,00,000
• Retained Earnings: Rs 7,90,000
• **Total Equity**: Rs 17,90,000

**Total Liabilities + Equity**: Rs 32,40,000 ✅ Balanced

**Key Ratios:**
• Current Ratio: 4.18 (healthy)
• Debt-to-Equity: 0.81 (acceptable)
• Return on Equity: 13% annual

## Tax Reports

### 13. GST Report (GSTR-1 & GSTR-3B)

**Purpose**: Generate GST filing reports

**Access**: Reports > Tax > GST Report

**Parameters:**
• Month & Year
• Report Type: GSTR-1 / GSTR-3B

**GSTR-1 (Outward Supplies):**

**B2C Sales (Bill <Rs 2.5L):**
• Total Sales: Rs 12,50,000
• Taxable Value: Rs 10,59,322
• CGST (9%): Rs 95,339
• SGST (9%): Rs 95,339
• **Total GST**: Rs 1,90,678

**Tax Rate-Wise Breakup:**
| GST Rate | Taxable Value | CGST   | SGST   | Total GST |
|----------|---------------|--------|--------|-----------|
| 5%       | Rs 3,50,000     | Rs 8,750 | Rs 8,750 | Rs 17,500   |
| 12%      | Rs 4,20,000     | Rs 25,200| Rs 25,200| Rs 50,400   |
| 18%      | Rs 2,89,322     | Rs 26,039| Rs 26,039| Rs 52,078   |

**GSTR-3B (Monthly Return):**

**Outward Supplies:**
• Taxable Supplies: Rs 10,59,322
• GST on Sales: Rs 1,90,678

**Input Tax Credit (ITC):**
• ITC on Purchases: Rs 82,450
• ITC on Expenses: Rs 8,550
• **Total ITC**: Rs 91,000

**Net GST Payable:**
• Output GST: Rs 1,90,678
• Less: ITC: -Rs 91,000
• **Tax Payable**: Rs 99,678

**Export Options:**
• JSON file (for GST portal upload)
• Excel format
• PDF summary

### 14. HSN/SAC Summary Report

**Purpose**: Product-wise tax classification summary

**Required for:** Annual GST return

**Report Contains:**
| HSN Code | Description      | Units | Taxable Value | GST Rate | GST Amount |
|----------|------------------|-------|---------------|----------|------------|
| 1905     | Biscuits/Bread   | 5,200 | Rs 3,50,000     | 5%       | Rs 17,500    |
| 3305     | Hair Care        | 1,850 | Rs 2,80,000     | 18%      | Rs 50,400    |
| 2202     | Soft Drinks      | 2,100 | Rs 1,50,000     | 12%      | Rs 18,000    |
... continues for all HSN codes

### 15. TDS Report

**Purpose**: Track TDS deductions (if applicable)

**For businesses with:** Rent >Rs 2.4L/year, Professional fees, etc.

**Report Shows:**
• Rent paid: Rs 3,60,000/year
• TDS @10%: Rs 36,000
• TDS deducted & deposited: ✅ Yes
• TAN: ABCD12345E
• Challan details: (BSR Code, Date, Challan No.)

## Staff Performance Reports

### 16. Cashier Performance Report

**Purpose**: Evaluate individual staff performance

**Access**: Reports > Staff > Performance

**Parameters:**
• Date range
• Select staff member (or all)

**Report Contains:**

**For Each Staff Member:**

**Rajesh Kumar:**
• **Bills Handled**: 850 (60% of total)
• **Total Sales**: Rs 7,50,000
• **Average Bill**: Rs 882
• **Items per Bill**: 4.2
• **Discounts Given**: Rs 18,500 (2.5% of sales)
• **Returns Processed**: 12 (Rs 8,500)
• **Credit Sales**: 25 bills (Rs 45,000)
• **Working Days**: 26 days
• **Average Daily Sales**: Rs 28,846
• **Peak Performance Day**: Nov 23 (Rs 42,000)
• **Customer Rating**: 4.8/5
• **Speed**: 3.5 minutes per bill (good)

**Performance Badges:**
⭐ Top Performer (highest sales)
🏆 Speed Champion (fastest billing)
💯 Accuracy Expert (zero billing errors)
😊 Customer Favorite (best ratings)

**Comparison Chart:**
Bar graph comparing all staff members

**Insights:**
• Rajesh handles 60% bills (very productive)
• Priya has lower volume but higher average bill (upselling?)
• Rohan has most errors (needs training)

### 17. Hourly Traffic Report

**Purpose**: Understand customer footfall patterns

**Report Shows:**
| Hour     | Customers | Bills | Revenue  | Staff Needed |
|----------|-----------|-------|----------|--------------|
| 9-10 AM  | 12        | 8     | Rs 2,400   | 1            |
| 10-11 AM | 18        | 12    | Rs 3,800   | 1            |
| 11-12 PM | 28        | 18    | Rs 6,200   | 2            |
| 6-7 PM   | 45        | 28    | Rs 9,500   | 3 (peak!)    |
| 9-10 PM  | 8         | 5     | Rs 1,500   | 1            |

**Heatmap Visualization:**
Color-coded chart showing busy vs quiet hours

**Staffing Recommendation:**
• 1 staff: 9-11 AM, 2-5 PM, 9-10 PM
• 2 staff: 11 AM-2 PM, 8-9 PM
• 3 staff: 5-8 PM (peak hours)

## Report Scheduling & Automation

### Auto-Generated Reports:

**Daily Reports (Email at 10 PM):**
• Daily sales summary
• Stock alerts
• Reorder recommendations

**Weekly Reports (Email every Monday):**
• Weekly sales report
• Top 10 products
• Staff performance
• Expense summary

**Monthly Reports (Email on 1st of month):**
• Complete P&L statement
• Monthly sales analysis
• GST report (for filing)
• Inventory valuation

**Setup:**
1. Go to **Reports > Schedule Reports**
2. Select report type
3. Choose frequency (daily/weekly/monthly)
4. Enter email addresses (comma-separated)
5. Select report format (PDF/Excel)
6. Save automation

## Export & Print Options

**PDF Export:**
• Professional letterhead
• Charts & graphs included
• Page numbers & date
• Digital signature (optional)
• Password protection (optional)

**Excel Export:**
• Raw data in tables
• Formulas included
• Charts on separate sheets
• Pivot-table ready
• Macro-enabled (optional)

**CSV Export:**
• Simple comma-separated
• Universal compatibility
• Import to any software
• Lightweight file size

**Print:**
• Direct to printer
• Page setup options
• Header/footer customization
• Landscape/portrait modes

**Email:**
• Send directly from AADHAR
• Multiple recipients
• Custom subject & message
• Schedule for later

**Cloud Backup:**
• Auto-save to Google Drive
• Auto-save to Dropbox
• Version history maintained
• Access from anywhere

Next: Build customer loyalty and manage relationships! →`
    },
    {
      id: "customers-loyalty",
      title: "👥 Customers & Loyalty Program",
      description: "Build lasting relationships and reward repeat customers",
      icon: Users,
      content: `# Customers & Loyalty Management

Build a thriving customer base with powerful CRM features and automated loyalty rewards program.

## Customer Database

### Adding New Customer

**From Billing Screen:**
1. During billing, click "Select Customer" dropdown
2. Click "+ New Customer"
3. Quick form appears

**From Customers Section:**
1. Click "Customers" in sidebar
2. Click "+ Add Customer" button
3. Full customer form

**Required Fields:**
• Name: Full name or shop name
• Mobile: 10-digit phone number (unique identifier)

**Optional Fields:**
• Email: For email receipts
• Date of Birth: For birthday offers
• Anniversary: For special occasion offers
• Address: Delivery address
• GSTIN: For GST invoices (B2B)
• Credit Limit: Maximum credit allowed
• Opening Balance: If migrating from old system
• Customer Group: VIP, Regular, Wholesale, etc.
• Preferred Language: English/Nepali
• Notes: Any special information

**Profile Photo:** Upload from phone/computer

**Save:** Customer added to database

### Customer Groups & Segmentation

**Default Groups:**
• Walk-in (no profile)
• Regular Customer
• VIP Customer
• Wholesale Customer
• Corporate Customer

**Custom Groups:**
Create your own (e.g., "Wedding Customers", "Hotel Clients")

**Group Benefits:**
• Different pricing tiers
• Special discounts
• Exclusive offers
• Priority service
• Custom loyalty multipliers

**Auto-Assignment Rules:**
• Spending >Rs 50k/month → Auto-upgrade to VIP
• First purchase → Regular Customer
• 10+ purchases → Loyal Customer badge

### Customer Profile

**View Complete Profile:**
1. Go to Customers section
2. Click on customer name
3. Detailed profile opens

**Profile Contains:**

**Basic Info:**
• Name, phone, email
• Customer ID (auto-generated)
• Member since date
• Last visit
• Total visits count

**Financial Summary:**
• Total Lifetime Value: Rs 2,85,450
• Average Bill Value: Rs 1,425
• Total Bills: 202
• Outstanding Credit: Rs 5,500
• Loyalty Points: 1,845 points

**Purchase History:**
• Last 50 bills listed
• Filter by date range
• View specific bill details
• Reprint receipts

**Favorite Products:**
AI-detected based on purchase frequency
• Amul Butter (bought 45 times)
• Britannia Bread (bought 38 times)
• Colgate MaxFresh (bought 22 times)

**Communication History:**
• SMS sent: 12 messages
• Emails sent: 5 emails
• Last contacted: 5 days ago

**Special Dates:**
• Birthday: March 15
• Anniversary: June 10
• Upcoming: Anniversary in 12 days

## Loyalty Points Program

### How Loyalty Works

**Earning Points:**
• Configured rate: Rs 100 spent = 1 point (customizable)
• Customer shops for Rs 500
• Earns 5 points automatically
• Points credit immediately after payment

**Redemption Value:**
• 1 point = Rs 1 (default, customizable)
• Customer has 100 points = Rs 100 discount value

**Point Balance:**
• Tracked per customer
• Never expires (or set expiry in settings)
• Visible on receipts
• Customer can check via SMS

### Configuring Loyalty Program

**Settings > Loyalty Program:**

**Earning Rules:**
• Earning Rate: 1 point per Rs 100 (adjust as needed)
• Minimum Bill for Points: Rs 50 (bills below don't earn)
• Points on Discounted Bills: Yes/No
• Points on Credit Sales: Yes/No
• Double Points Days: Select days (e.g., Tuesdays)
• Birthday Bonus: 10x points on birthday

**Redemption Rules:**
• Redemption Value: 1 point = Rs 1
• Minimum Redemption: 50 points (prevent tiny redemptions)
• Maximum Redemption per Bill: 500 points (or unlimited)
• Redemption on Sale Items: Yes/No

**Point Expiry:**
• No Expiry (default)
• Or set: Points expire after 365 days

**VIP Tiers:**
Create tiered benefits:
• Bronze (0-500 points): 1x earning
• Silver (501-2000 points): 1.5x earning
• Gold (2001-5000 points): 2x earning
• Platinum (5000+ points): 3x earning

### Earning Points

**Automatic During Billing:**
1. Customer selected at billing
2. Bill total calculated
3. Points earned shown: "You'll earn 12 points!"
4. After payment completes
5. Points added to customer account
6. Receipt shows: "You earned 12 points! Total: 1,257 points"

**Manual Point Award:**
(For special promotions, contests, referrals)
1. Go to customer profile
2. Click "Add Points Manually"
3. Enter points: 100
4. Reason: "Referral bonus"
5. Save
6. Customer notified via SMS

**Bonus Points:**
• Birthday: Automatic 10x multiplier
• Anniversary: 5x multiplier
• Festival days: 2x multiplier (configured)
• Mega sale days: 3x multiplier

### Redeeming Points

**During Billing:**
1. Customer selected
2. Points balance shows: "Available: 1,257 points"
3. Click "Redeem Points" button
4. Options:
   • Use Maximum (all available points)
   • Custom Amount: Enter points to redeem
5. Discount applied to bill
6. Example: Redeem 500 points = Rs 500 off
7. Remaining points: 757

**Receipt Shows:**
• Points Redeemed: 500 points (Rs 500)
• Points Remaining: 757 points
• Points Earned this Bill: 8 points (on reduced amount)

**Redemption Scenarios:**

**Scenario 1: Full Redemption**
• Bill: Rs 600
• Available Points: 800
• Redeem: 500 points (max per bill)
• Pay: Rs 100
• Earn: 1 point (on Rs 100)

**Scenario 2: Partial Redemption**
• Bill: Rs 1,500
• Available Points: 200
• Redeem: 200 points
• Pay: Rs 1,300
• Earn: 13 points (on Rs 1,300)

### Points Statement

**Customer Can Check:**
• Via SMS: Send "POINTS" to your shop number
• Auto-reply: "Your points: 1,257. Earn 1 point per Rs 100 spent. Redeem anytime!"

**In-Shop:**
• Ask staff to check in customer profile
• Or customer views on customer-facing display

**Detailed Statement:**
Customer profile > Points History tab

| Date       | Type    | Points | Balance | Bill/Note        |
|------------|---------|--------|---------|------------------|
| 29-11-2025 | Earned  | +12    | 1,257   | Bill #00234      |
| 28-11-2025 | Redeemed| -500   | 1,245   | Bill #00220      |
| 27-11-2025 | Earned  | +8     | 1,745   | Bill #00215      |
| 25-11-2025 | Bonus   | +100   | 1,737   | Referral reward  |
| 24-11-2025 | Earned  | +15    | 1,637   | Bill #00198      |

**Export:** PDF or Excel

## Credit Sales & Account Management

### Enabling Credit for Customer

**Customer Profile:**
1. Open customer profile
2. Toggle "Allow Credit Sales" to ON
3. Set "Credit Limit": Rs 10,000
4. Set "Credit Period": 30 days (default payment due)
5. Save

**Credit Status Indicators:**
• ✅ Credit Enabled
• 🟡 Credit Limit: Rs 10,000
• 🟢 Available: Rs 7,500 (Rs 2,500 outstanding)
• ⏳ Payment Terms: Net 30 days

### Processing Credit Sale

**During Billing:**
1. Add items to cart normally
2. Select customer (credit must be enabled)
3. Bill total: Rs 3,000
4. Click "Credit Sale" button
5. System checks:
   • Current outstanding: Rs 2,500
   • Bill amount: Rs 3,000
   • Total: Rs 5,500
   • Credit limit: Rs 10,000
   • ✅ Within limit (proceed)
6. Confirm credit sale
7. No payment collected
8. Credit note receipt prints
9. Due date calculated: 30 days from today

**Credit Note Shows:**
• "CREDIT SALE" watermark
• Amount due: Rs 3,000
• Previous balance: Rs 2,500
• New balance: Rs 5,500
• Due date: December 29, 2025
• Terms: "Payment due within 30 days"

### Managing Credit Accounts

**View All Credit Customers:**
1. Go to "Customers" > "Credit Accounts" tab
2. See list of customers with outstanding balance

**Summary Dashboard:**
• Total Credit Outstanding: Rs 2,45,000
• Number of Credit Customers: 45
• Average Days Outstanding: 18 days
• Overdue Amount: Rs 35,000 (5 customers)

**Customer List:**
| Customer      | Outstanding | Credit Limit | Available | Overdue | Action       |
|---------------|-------------|--------------|-----------|---------|--------------|
| Raj Hotel     | Rs 45,000     | Rs 1,00,000    | Rs 55,000   | No      | View Bills   |
| ABC Store     | Rs 25,000     | Rs 50,000      | Rs 25,000   | 15 days | Send Reminder|
| XYZ Cafe      | Rs 18,500     | Rs 30,000      | Rs 11,500   | No      | View Bills   |

**Overdue Alerts:**
🔴 Customers with overdue payments highlighted in red

### Collecting Credit Payment

**When Customer Pays:**
1. Go to customer profile
2. Click "Collect Payment" button
3. Payment Collection form:
   • Amount Receiving: Rs 5,000 (or full balance)
   • Payment Method: Cash/UPI/Card/Bank Transfer
   • Payment Date: Today (or backdate if needed)
   • Reference Number: (for UPI/Bank)
   • Note: Optional
4. Click "Record Payment"
5. Outstanding balance updates
6. Payment receipt prints
7. Customer notified via SMS

**Partial Payment:**
• Customer pays Rs 5,000 of Rs 10,000 due
• Balance reduces to Rs 5,000
• Both payments tracked separately

**Payment History:**
Customer profile > Payments tab
Shows all credit sales and payments received

### Credit Reminders

**Automatic Reminders:**

**7 Days Before Due:**
SMS: "Dear Raj, your payment of Rs 10,000 is due on Dec 5. Please clear at earliest. - YourShop"

**On Due Date:**
SMS: "Payment of Rs 10,000 due today. Pay now to avoid late charges. - YourShop"

**7 Days Overdue:**
SMS: "Your payment of Rs 10,000 is overdue by 7 days. Please clear immediately. Call: 9876543210"

**Manual Reminder:**
• Click "Send Reminder" button
• Choose: SMS / WhatsApp / Call
• Pre-filled message (edit if needed)
• Send

**Reminder Settings:**
Settings > Credit Management
• Enable auto-reminders: Yes/No
• Reminder frequency
• Message templates (customize)
• Add late fee: Optional (Rs /day or %)

### Credit Reports

**Accounts Receivable Report:**
• Total outstanding by customer
• Aging analysis (0-30, 31-60, 60+ days)
• Bad debt risk customers
• Collection efficiency
• DSO (Days Sales Outstanding)

**Credit Limit Utilization:**
Shows customers near credit limit (manage risk)

## Customer Communication

### SMS Marketing

**Bulk SMS:**
1. Go to "Customers" > "Send SMS"
2. Select recipients:
   • All customers
   • Customer groups (VIP, Regular, etc.)
   • Custom filter (not visited in 30 days)
   • Specific customers (checkboxes)
3. Compose message:
   • Use templates
   • Add personalization: {Name}, {Points}
   • Character count shown
   • Preview on mobile
4. Schedule:
   • Send now
   • Schedule for later (date & time)
5. Click "Send SMS"
6. Cost shown: Rs 0.25 per SMS
7. Confirmation before sending

**SMS Templates:**
• New offer announcement
• Festival greetings
• Birthday wishes
• Payment reminder
• New product launch
• Store closed/open timing change
• Loyalty points balance
• Exclusive deals

**Example SMS:**
"Hi {Name}! 🎉 Get 20% OFF on your next purchase. Show this SMS at billing. Valid till 30th Nov. Your points: {Points}. Visit us today! - Aadhar Retail"

**SMS History:**
Track all sent messages, delivery status, click rates

### WhatsApp Integration

**Send Bills via WhatsApp:**
• After billing, click "Send WhatsApp"
• Bill PDF attaches automatically
• Customer receives professional receipt
• Higher engagement than SMS

**WhatsApp Marketing:**
• Send promotional images
• Product catalogs
• Video messages
• Interactive buttons
• Better click-through than SMS

**WhatsApp Business API:**
• Two-way communication
• Customer can inquire
• Order status updates
• Automated responses

### Email Marketing

**Professional Email Campaigns:**
1. Create email campaign
2. Design with drag-drop builder
3. Add images, products, offers
4. Personalize content
5. Send to customer segments
6. Track open rates, click rates

**Automated Emails:**
• Welcome email (new customer)
• Thank you email (after purchase)
• Birthday/anniversary emails
• Win-back emails (inactive customers)
• Loyalty tier upgrade notifications

## Customer Analytics

### Customer Insights Dashboard

**Overview Metrics:**
• Total Customers: 1,850
• Active (last 30d): 1,420 (77%)
• New (this month): 145
• Churned (90+ days inactive): 185 (10%)
• Average CLV: Rs 18,450
• Repeat Rate: 68%

**Customer Acquisition:**
• New customers per day: 4.8 average
• Peak acquisition: Weekends
• Acquisition cost: Rs 85 per customer (marketing spend/new customers)
• Payback period: 2.3 visits

**Customer Retention:**
• Monthly retention: 78%
• 3-month retention: 65%
• 12-month retention: 45%
• Churn rate: 22% monthly

**Customer Lifetime Value:**
• Average CLV: Rs 18,450
• Top 10% CLV: Rs 85,000+
• CLV by segment:
  - VIP: Rs 1,25,000
  - Regular: Rs 22,000
  - Occasional: Rs 4,500

### RFM Analysis

**Recency, Frequency, Monetary:**

**Recency:**
• Last purchase date
• Groups: 1-7 days (hot), 8-30 days (warm), 30-90 days (cold), 90+ days (lost)

**Frequency:**
• Number of purchases
• Groups: 1-2 (new), 3-10 (regular), 11-30 (loyal), 30+ (super loyal)

**Monetary:**
• Total spending
• Groups: <Rs 5k (low), Rs 5-20k (medium), Rs 20-50k (high), Rs 50k+ (VIP)

**RFM Segments:**
• **Champions**: Recent, frequent, high spend (nurture heavily)
• **Loyal Customers**: Frequent, moderate spend (reward loyalty)
• **Promising**: Recent, low frequency (convert to regular)
• **At Risk**: Was frequent, now inactive (win-back campaign)
• **Lost**: Long inactive, was valuable (aggressive win-back)
• **About to Sleep**: Declining activity (re-engage)

**Actions per Segment:**
Auto-suggested campaigns tailored to each segment

### Customer Satisfaction

**Feedback Collection:**
• Post-purchase SMS with feedback link
• In-app rating (1-5 stars)
• Net Promoter Score (NPS)
• Detailed review form

**NPS Dashboard:**
• Promoters (9-10): 65%
• Passives (7-8): 25%
• Detractors (0-6): 10%
• **NPS Score**: 55 (excellent)

**Review Management:**
• Positive reviews: Share on social media
• Negative reviews: Alert manager, follow up
• Feature reviews on website

## Birthday & Anniversary Offers

### Automatic Celebrations

**Setup:**
Settings > Customer Marketing > Special Occasions
• Birthday offer: 20% discount on any purchase
• Anniversary offer: Buy 1 Get 1 on select items
• Enable SMS notification: Yes
• Send notification: 3 days before + on the day

**Birthday Flow:**
1. System checks birthdays daily (12 AM)
2. 3 days before: SMS sent "Your birthday is coming! Enjoy 20% off on your special day!"
3. On birthday: SMS at 9 AM "Happy Birthday! 🎂 Get 20% OFF today. Show this SMS at billing. Valid today only!"
4. When customer visits and makes purchase:
   • Discount applies automatically
   • Special birthday receipt prints
   • "Happy Birthday!" message on receipt
   • Bonus loyalty points (10x multiplier)
   • Free gift (if configured)

**Anniversary Flow:**
Similar to birthday

**Results:**
• 35% of customers redeem birthday offers
• Average birthday purchase: Rs 1,850 (vs Rs 350 regular)
• Great retention tool

## Customer Referral Program

**Encourage Word-of-Mouth:**

**Setup:**
Settings > Loyalty > Referral Program
• Referrer reward: 100 points (Rs 100 value)
• Referee reward: 50 points on first purchase
• Enable: Yes

**How It Works:**
1. Existing customer (Amit) refers friend (Priya)
2. Priya visits shop, mentions referral
3. Staff creates Priya's profile, marks "Referred by: Amit"
4. Priya makes first purchase
5. Priya earns: 50 bonus points
6. Amit (referrer) earns: 100 bonus points
7. Both notified via SMS

**Tracking:**
• View all referrals per customer
• Leaderboard: Top referrers
• Referral conversion rate

## Customer Segmentation & Targeting

**Create Custom Segments:**
1. Go to Customers > Segments
2. Click "Create Segment"
3. Define rules:
   • Spent >Rs 20,000 in last 90 days
   • AND hasn't visited in 15+ days
   • AND in "VIP" group
4. Name segment: "High-value at-risk customers"
5. Save

**Use Segment:**
• Send targeted SMS
• Special exclusive offers
• Personalized communication
• Track segment performance

**Pre-Built Segments:**
• High spenders (top 20%)
• Frequent visitors (5+ times/month)
• One-time customers (only 1 purchase)
• Inactive 30 days
• Inactive 90 days
• Birthday this month
• Credit customers
• Zero points (never redeemed)

Next: Understand how offline mode keeps your business running! →`
    },
    {
      id: "offline-mode",
      title: "🔄 Offline Mode & Sync",
      description: "Work seamlessly without internet, sync when connected",
      icon: WifiOff,
      content: `# Offline Mode & Cloud Sync

Never let internet issues stop your business. Aadhar POS works fully offline with intelligent background sync.

## Why Offline-First Matters

**Internet Reality in Nepal:**
• Power cuts common → router down
• Mobile data unstable in some areas
• Busy hours = slow internet
• Cost concerns with data usage

**Aadhar Solution:**
⚠️ **Requires an internet connection** — verified offline billing is planned, not currently available
✅ **Local database** - all data on your device
✅ **Auto-sync** - uploads when internet available
✅ **Conflict resolution** - handles multi-device scenarios
✅ **Peace of mind** - never lose a sale due to internet

## What Works Offline

### Planned for a future offline mode:

**Billing & Sales:**
✅ Complete billing process
✅ Add items to cart
✅ Apply discounts
✅ Select customers
✅ Earn/redeem loyalty points
✅ Process payments (all methods)
✅ Print receipts
✅ Hold/retrieve bills
✅ Credit sales
✅ Split payments

**Inventory Management:**
✅ Add new products
✅ Edit product details
✅ Update stock quantities
✅ View stock levels
✅ Stock adjustments
✅ Barcode scanning
✅ Product search

**Customer Management:**
✅ Add new customers
✅ Edit customer info
✅ View purchase history
✅ Credit management
✅ Points balance check

**Reports & Analytics:**
✅ All reports generate
✅ Sales reports
✅ Inventory reports
✅ Financial reports
✅ Export to PDF/Excel

**Expenses:**
✅ Add expenses
✅ View expense reports
✅ Profit calculations

**Settings:**
✅ Change all settings
✅ Printer configuration
✅ User management
✅ Tax settings

### Limited/Delayed (Syncs When Online):

🟡 **SMS Sending:**
• Bills added to queue
• Sends when internet available
• Queued SMS shows "Pending" status

🟡 **WhatsApp Messages:**
• Same as SMS - queues and sends later

🟡 **Email Receipts:**
• Queued for sending
• Auto-sends when connected

🟡 **Online Payments (UPI QR Auto-Verify):**
• QR generates offline (static fallback)
• Auto-verification requires internet
• Manual confirmation available
• Transaction syncs when online

🟡 **Cloud Backup:**
• Data stored locally
• Backs up to cloud when online
• No data loss

🟡 **Software Updates:**
• Downloads when internet available
• Not critical for operations

🟡 **Global Product Database:**
• Can't fetch product info from online DB
• But all your existing products work
• Manual entry always available

## How Offline Mode Works

### Local Database

**Technology:**
• **Desktop/Laptop**: SQLite database (file-based)
• **Web App**: IndexedDB (browser storage)
• **Mobile**: SQLite or Realm database

**Storage Location:**
• Windows: C:\\\\Users\\\\[User]\\\\AppData\\\\Local\\\\AadharPOS\\\\data.db
• Mac: /Users/[User]/Library/Application Support/AadharPOS/data.db
• Linux: /home/[user]/.local/share/AadharPOS/data.db

**Database Size:**
• Typical small shop: 50-100 MB
• Medium shop: 200-500 MB
• Large shop: 1-2 GB
• Can handle millions of records

**What's Stored Locally:**
• All products (5,000-10,000 products typical)
• All customers (1,000-50,000 customers)
• All sales history (last 2 years by default)
• All expenses
• All settings
• Images (product photos, receipts)
• Reports cache

**Data Security:**
• Database encrypted with AES-256
• Password-protected
• No external access without authentication
• Backup encrypted

### Offline Indicator

**Visual Status:**
• Top-right corner of app
• 🟢 Online: Green WiFi icon
• 🔴 Offline: Red X icon with "Offline Mode"
• 🟡 Syncing: Rotating arrows "Syncing..."

**Status Messages:**
• "Connected to cloud"
• "Offline - working locally"
• "Syncing 25 of 100 records..."
• "Last synced: 2 minutes ago"
• "Sync error - will retry"

### Automatic Network Detection

**System Monitors:**
• Internet connectivity every 30 seconds
• When connection detected → auto-sync starts
• When connection lost → switches to offline
• No user intervention needed

**Smart Detection:**
• Pings sync server
• Checks actual internet (not just WiFi/LAN connected)
• Handles captive portals (coffee shop WiFi with login)
• Respects metered connections (mobile data)

## Cloud Sync Process

### What Gets Synced

**Bidirectional Sync (Both Ways):**
• Products (add/edit/delete)
• Customers (add/edit/delete)
• User accounts & permissions
• Settings changes
• Expenses

**Upload Only (Device → Cloud):**
• Sales transactions
• Payment records
• Inventory adjustments
• Receipt images

**Download Only (Cloud → Device):**
• Software updates
• Global product database
• Tax rate updates
• Feature flags

### Sync Triggers

**Automatic Sync Happens:**
1. Every 5 minutes (if online)
2. After every sale (immediate)
3. After adding/editing products
4. After adding/editing customers
5. When app starts (initial sync)
6. When internet reconnects (after offline period)

**Manual Sync:**
• Click sync icon (top-right)
• Or Settings > Sync > "Sync Now"
• Forces immediate sync
• Shows progress

### Sync Priority

**Order of Importance:**
1. **Critical (Syncs First):**
   • Sales transactions
   • Payment records
   • Customer credits/debits
   • Loyalty points changes

2. **High Priority:**
   • New customers
   • Stock adjustments
   • Expenses

3. **Medium Priority:**
   • Product edits
   • Customer edits
   • Settings changes

4. **Low Priority:**
   • Report exports
   • Receipt images
   • Logs

**Why Priority Matters:**
• Slow internet → critical data syncs first
• Ensures financial data always backed up
• Less critical data syncs when bandwidth available

### Sync Progress

**Sync Status Screen:**
Settings > Sync Status

**Shows:**
• Last successful sync: 2 minutes ago
• Next scheduled sync: In 3 minutes
• Pending items: 12
  - 8 sales transactions
  - 3 customer updates
  - 1 expense record
• Failed items: 0
• Total data synced today: 245 MB

**Detailed Log:**
| Time  | Type        | Action    | Status  | Details           |
|-------|-------------|-----------|---------|-------------------|
| 15:45 | Sale        | Upload    | ✅ Success | Bill #00234      |
| 15:43 | Customer    | Upload    | ✅ Success | Amit Sharma      |
| 15:40 | Sale        | Upload    | ✅ Success | Bill #00233      |
| 15:38 | Product     | Download  | ✅ Success | 5 products       |
| 15:35 | Sale        | Upload    | ⏳ Pending | Bill #00232      |

### Sync Errors & Resolution

**Common Errors:**

**Error: "Sync server unreachable"**
• Cause: Internet down or server maintenance
• Resolution: Auto-retries every 2 minutes
• Action: None needed (automatic)

**Error: "Conflict detected"**
• Cause: Same record edited on 2 devices
• Resolution: Conflict resolution dialog
• Action: Choose which version to keep

**Error: "Authentication failed"**
• Cause: Login session expired
• Resolution: Re-login required
• Action: Click "Login Again"

**Error: "Upload failed - retry"**
• Cause: Network timeout
• Resolution: Auto-retries 3 times
• Action: If persists, contact support

**Failed Sync Recovery:**
• Failed items queued separately
• Retries every 10 minutes
• Up to 50 retry attempts
• After 50 fails → alerts owner
• Manual intervention option

## Multi-Device Sync

### How Multi-Device Works

**Scenario:**
• Main counter: Desktop
• Owner: Laptop at home
• Staff: Mobile at warehouse

**All 3 devices run Aadhar POS:**
• Each has local database
• Each syncs with cloud
• Cloud is "source of truth"
• Changes propagate to all devices

**Example Flow:**
1. **Desktop** (15:30): Sells 5 units of Product A
   • Stock: 100 → 95 (local)
   • Uploads to cloud immediately
2. **Cloud** (15:30:05): Receives update
   • Stock: 100 → 95 (cloud)
3. **Laptop** (15:30:30): Pulls sync
   • Downloads: Stock update
   • Stock: 100 → 95 (laptop)
4. **Mobile** (15:31): Pulls sync
   • Downloads: Stock update
   • Stock: 100 → 95 (mobile)

**Result:** All devices in sync within 60 seconds

### Conflict Resolution

**What is a Conflict:**
Two devices edit same record simultaneously before syncing

**Example Conflict:**
• Device A (15:30): Changes product price Rs 50 → Rs 55
• Device B (15:31): Changes same product price Rs 50 → Rs 60
• Both offline, can't sync
• Both come online simultaneously
• Conflict!

**Resolution Strategies:**

**1. Last Write Wins (Default):**
• Most recent change kept
• Device B's Rs 60 wins (newer timestamp)
• Device A notified: "Price updated to Rs 60 by another device"

**2. Manual Resolution:**
• Conflict dialog shows both versions
• User chooses which to keep
• Or merge changes manually

**3. Field-Level Merge:**
• If different fields changed, both apply
• Device A changed price
• Device B changed stock
• Both changes applied

**Conflict Notification:**
🔔 "3 conflicts detected. Review now?"
• Click to open conflict resolution screen
• Shows side-by-side comparison
• Choose version or merge
• Resolve and sync

### Best Practices for Multi-Device

**Recommendations:**
✅ Keep all devices online when possible
✅ Sync frequently (every 5 min auto is good)
✅ Assign specific tasks to devices (reduce conflicts)
  - Counter device: Billing only
  - Owner device: Reports, analytics, settings
  - Warehouse device: Stock updates only
✅ Enable conflict notifications
✅ Review sync logs weekly

**Common Mistakes to Avoid:**
❌ Don't work offline for hours on multiple devices
❌ Don't edit same products on 2 devices simultaneously
❌ Don't ignore sync errors
❌ Don't disable auto-sync

## Offline Duration Limits

**How Long Can You Work Offline?**
• **Unlimited** - no time limit
• Days, weeks, months if needed
• Local database fully functional

**Practical Limits:**
• Receipt images pile up (storage)
• SMS queue grows (all pending)
• Reports include only local data
• No cloud backups created

**Recommendations:**
• Connect to internet daily (end of day)
• Sync at least once every 24 hours
• Ensure SMS/receipts sent
• Cloud backup updated

## Sync Settings & Preferences

**Settings > Sync & Backup:**

**Auto-Sync:**
• Enable: Yes / No
• Frequency: Every 1/5/10/30 minutes
• Sync on sale: Yes (recommended)
• Sync on startup: Yes

**Sync What:**
• Sales: ✅ Always (can't disable)
• Products: ✅ Enabled
• Customers: ✅ Enabled
• Expenses: ✅ Enabled
• Images: ✅ Enabled (can disable to save bandwidth)
• Reports: ⬜ Disabled (large files)

**Network Preferences:**
• Sync on WiFi: Yes
• Sync on mobile data: Yes / No
• Mobile data limit: 100 MB/day
• Pause sync when low battery: Yes (mobile)

**Conflict Handling:**
• Default strategy: Last write wins / Manual resolve
• Notify on conflict: Yes
• Auto-resolve simple conflicts: Yes

**Backup Schedule:**
• Cloud backup: Daily at 11 PM
• Local backup: Daily at 12 AM
• Keep backups: 30 days

## Local Backup & Restore

**Why Local Backup:**
• Extra safety beyond cloud
• Faster restore (no download)
• Offline operation is planned and not currently available
• Export to external drive

### Creating Backup

**Manual Backup:**
1. Settings > Backup & Restore
2. Click "Create Backup Now"
3. Choose location:
   • Same device (default)
   • External drive (USB)
   • Network drive
4. Backup creates (30 seconds - 5 minutes)
5. Backup file: AADHAR_Backup_2025-11-29.npbak

**Auto-Backup:**
• Enabled by default
• Runs every night at 12 AM
• Keeps last 7 days locally
• Old backups auto-delete

**Backup Contains:**
• Complete database
• All images
• Settings
• User accounts (encrypted)
• Reports cache

**Backup Size:**
• Small shop: 100-500 MB
• Medium shop: 500 MB - 2 GB
• Large shop: 2-5 GB

### Restoring from Backup

**When to Restore:**
• Device crashed/replaced
• Data corruption
• Accidental deletion
• Moving to new device
• Testing/training setup

**Restore Process:**
1. Settings > Backup & Restore
2. Click "Restore from Backup"
3. Choose backup file
4. Confirm: "This will replace current data"
5. Restore runs (2-10 minutes)
6. App restarts
7. Data restored

**Restore Options:**
• Full restore (everything)
• Partial restore (select data)
  - Sales only
  - Products only
  - Customers only

**Important Notes:**
⚠️ Restore overwrites current data
⚠️ Can't undo restore
⚠️ Backup before restoring
⚠️ Close app during restore

## Data Export

**Export All Data:**
Settings > Export Data

**Export Formats:**
• SQL dump (developer-friendly)
• Excel workbook (multiple sheets)
• CSV files (one per table)
• JSON (API-friendly)

**Use Cases:**
• Migrate to different software
• Share with accountant
• Advanced analysis in Excel
• Compliance/audit requirements

**Export Contains:**
• All products
• All customers
• All sales (full history)
• All expenses
• User data
• Settings

**Export Size:**
Can be large (100 MB - 1 GB+)

## Sync Monitoring & Health

**Sync Health Dashboard:**
Settings > Sync Status > Health

**Health Score (0-100):**
• 90-100: ✅ Excellent sync health
• 70-89: 🟡 Good, minor delays
• 50-69: ⚠️ Issues detected
• <50: 🔴 Critical sync problems

**Health Factors:**
• Sync success rate (target: >98%)
• Average sync latency (target: <30s)
• Failed syncs (target: <5%)
• Conflict frequency (target: <1%)
• Last sync age (target: <10 min)
• Pending queue size (target: <20)

**Sync Statistics:**
• Total syncs today: 285
• Successful: 282 (98.9%)
• Failed: 3 (1.1%)
• Average time: 12 seconds
• Data transferred: 450 MB up, 25 MB down
• Peak sync time: 15:45 (post-lunch rush)

**Recommendations:**
System suggests improvements:
• "Internet slow during 6-8 PM - consider upgrading"
• "Large images increasing sync time - enable compression"
• "Multiple conflicts from Device #2 - check settings"

Next: Learn cloud sync architecture and conflict handling! →`
    },
    {
      id: "user-permissions",
      title: "🔐 User Permissions & Roles",
      description: "Manage staff access and protect sensitive operations",
      icon: Lock,
      content: `# User Permissions & Staff Roles

Control what each staff member can do with comprehensive role-based permissions.

## Why User Permissions Matter

**Scenarios:**
• **Cashier**: Should only do billing, not change prices
• **Manager**: Can approve discounts, view reports
• **Warehouse Staff**: Only stock updates, no sales reports
• **Owner**: Full access to everything

**Benefits:**
✅ Prevent accidental changes
✅ Reduce theft/fraud risk
✅ Track who did what (accountability)
✅ Train new staff safely (limited access)
✅ Comply with audit requirements

## Default User Roles

### Owner/Admin
**Full Access - No Restrictions**
• Complete system access
• All features unlocked
• Can create/delete users
• Can change all settings
• View all reports
• Approve all actions

### Manager
**High Level Access**
✅ Process sales
✅ View all reports
✅ Add/edit products
✅ Add/edit customers
✅ Manage inventory
✅ View expenses
✅ Approve large discounts
✅ Process returns
✅ Manage staff schedules

❌ Can't change critical settings
❌ Can't delete users
❌ Can't view owner's personal reports

### Cashier/Sales Staff
**Limited to Daily Operations**
✅ Process sales (billing)
✅ Add items to cart
✅ Basic discounts (up to 5%)
✅ Select customers
✅ Print receipts
✅ Hold/retrieve bills
✅ Add new customers
✅ Search products

❌ Can't edit product prices
❌ Can't change stock quantities
❌ Can't view financial reports
❌ Can't access expenses
❌ Can't approve large discounts
❌ Can't process returns without approval

### Warehouse/Stock Manager
**Inventory Focused**
✅ Add new products
✅ Edit product details
✅ Update stock quantities
✅ Stock adjustments
✅ Receive purchase orders
✅ Generate reorder reports
✅ View inventory reports

❌ Can't process sales
❌ Can't view financial reports
❌ Can't access customer data
❌ Can't change prices

### Accountant (Read-Only)
**Reports & Analysis Only**
✅ View all reports
✅ Export reports
✅ View sales history
✅ View expenses
✅ View customer credits
✅ Generate tax reports

❌ Can't make any changes
❌ Can't process sales
❌ Can't add/edit anything
❌ Read-only access

## Creating Users

### Add New User:

1. Settings > Users & Permissions
2. Click "+ Add User"
3. **User Details Form:**

**Basic Info:**
• Full Name: Rajesh Kumar
• Username: rajesh.kumar (login ID)
• Email: rajesh@gmail.com
• Mobile: 9876543210
• Employee ID: EMP-001 (optional)
• Date of Joining: 01-11-2025

**Role Assignment:**
• Select Role: Cashier / Manager / Owner / etc.
• Or "Custom Role" (define specific permissions)

**Security:**
• Password: (strong password required)
• Confirm Password:
• PIN Code: 1234 (for quick actions)
• Force password change on first login: ☑️

**Access Schedule:**
• Working Days: Mon-Sat (select days)
• Working Hours: 10 AM - 8 PM
• Allow access outside hours: ☐

**Device Restrictions:**
• Allow on devices: All / Specific devices only
• If specific: Select allowed devices (Counter 1, Mobile App, etc.)

4. Click "Create User"
5. User account created
6. Login credentials sent via SMS/Email

### Bulk User Import

**For Large Teams:**
1. Download CSV template
2. Fill user details in Excel
3. Upload CSV
4. Review import
5. Confirm
6. All users created

## Custom Roles & Permissions

### Creating Custom Role:

1. Settings > Roles
2. Click "+ Create Custom Role"
3. Role Name: "Evening Shift Cashier"
4. Description: "Cashier with extended discount limits for evening shift"
5. **Configure Permissions:**

**Permission Categories:**

### Sales & Billing
• Process sales: ✅ Allow
• Maximum discount: 10% (vs 5% for regular cashier)
• Apply bill-level discount: ✅ Allow
• Hold bills: ✅ Allow
• Retrieve held bills: Own bills only / All bills
• Cancel bill: ⬜ Deny
• Edit completed bill: ⬜ Deny
• Process returns: With approval / Direct / Deny
• Credit sales: With approval / Direct / Deny
• Maximum bill amount: Unlimited / Rs 10,000 / Custom

### Products & Inventory
• View products: ✅ Allow
• Add products: ⬜ Deny
• Edit product details: ⬜ Deny
• Edit product prices: ⬜ Deny
• Update stock: ⬜ Deny
• Delete products: ⬜ Deny
• View low stock alerts: ✅ Allow

### Customers
• View customers: ✅ Allow
• Add customers: ✅ Allow
• Edit customers: Own created / All / Deny
• Delete customers: ⬜ Deny
• View customer history: ✅ Allow
• Redeem loyalty points: ✅ Allow
• Manual point adjustment: ⬜ Deny

### Reports & Analytics
• View daily sales report: ✅ Allow
• View monthly reports: ⬜ Deny
• View profit reports: ⬜ Deny
• View customer reports: ✅ Allow
• View inventory reports: ⬜ Deny
• Export reports: ⬜ Deny
• View business insights: ⬜ Deny

### Expenses
• View expenses: ⬜ Deny
• Add expenses: With approval / Direct / Deny
• Edit expenses: ⬜ Deny
• Delete expenses: ⬜ Deny

### Settings
• View settings: ⬜ Deny
• Change settings: ⬜ Deny
• Manage users: ⬜ Deny
• Manage printers: ⬜ Deny
• Backup/Restore: ⬜ Deny

### Advanced Permissions
• Cash drawer access: ✅ Allow
• View cash in drawer: ✅ Allow
• Cash drop: With approval / Direct / Deny
• End of day report: ✅ Allow
• Override prices: ⬜ Deny
• Delete sales records: ⬜ Deny

6. Save Custom Role
7. Assign to users as needed

## Permission Enforcement

### Real-World Scenarios:

**Scenario 1: Large Discount Attempt**
• Cashier adds 15% discount (limit is 10%)
• System blocks: "You can only give up to 10% discount"
• Options:
  - Reduce discount to 10%
  - Request manager approval
• If approval: Manager enters PIN
• Discount approved, sale continues

**Scenario 2: Price Edit Attempt**
• Cashier tries to change product price
• System: "Permission denied. Contact manager."
• Price field disabled/grayed out
• No accidental changes possible

**Scenario 3: Stock Adjustment**
• Cashier scans product to add to bill
• Product shows "Out of stock: 0 units"
• Cashier can't edit stock (no permission)
• Must call warehouse staff or manager
• Manager/warehouse staff updates stock
• Cashier can then complete sale

**Scenario 4: Return Request**
• Customer wants to return item
• Cashier processes return
• System: "Return amount Rs 2,500 requires approval"
• Manager notification sent
• Manager reviews on their device
• Manager approves with PIN
• Refund processed

**Scenario 5: After-Hours Access**
• Staff user "Rajesh" tries to login at 10 PM
• Working hours: 10 AM - 8 PM
• System: "Access denied. Outside working hours."
• Option to request emergency access
• Owner receives notification
• Owner can grant temporary access

## Approval Workflows

### Discount Approval

**Setup:**
Settings > Permissions > Approvals

**Discount Tiers:**
• 0-5%: Auto-approved (all staff)
• 5-10%: Requires senior cashier / manager approval
• 10-20%: Requires manager approval
• 20%+: Requires owner approval

**Approval Process:**
1. Cashier applies 15% discount
2. Bill pauses, approval request sent
3. Manager's device shows notification
4. Manager reviews:
   • Bill details
   • Items
   • Customer
   • Reason for discount
5. Manager decision:
   • Approve (enters PIN)
   • Reject (with reason)
   • Modify (suggest different discount)
6. Cashier notified
7. If approved: Bill completes
8. If rejected: Cashier adjusts or cancels

**Offline Approval:**
• If manager offline, approval queues
• Temporary approval possible (with owner permission)
• Manager reviews later (audit trail)

### Return Approval

**Similar workflow:**
• Returns >Rs 1,000 need approval
• Manager reviews return reason
• Checks product condition
• Approves/rejects
• Refund processes

### Cash Drop Approval

**For theft prevention:**
• When cash in drawer exceeds Rs 10,000
• Staff must do "cash drop" (remove excess cash to safe)
• Requires manager verification
• Manager counts cash
• Confirms amount
• Safe deposit recorded

## User Activity Tracking

### Activity Logs

**What's Tracked:**
• Login/logout times
• Every sale processed (with user ID)
• Every discount given
• Every product edit
• Every customer edit
• Every setting change
• Every report viewed
• Failed login attempts
• Permission violations

**View Activity:**
Settings > Users > Activity Log

**Filter Options:**
• By user (specific staff member)
• By date range
• By action type (sales, edits, etc.)
• By success/failure

**Sample Log:**
| Time  | User    | Action             | Details              | Status | Device    |
|-------|---------|--------------------|--------------------|--------|-----------|
| 15:45 | Rajesh  | Sale Completed     | Bill #00234, Rs 850  | ✅     | Counter 1 |
| 15:43 | Rajesh  | Discount Applied   | 8%, Bill #00234    | ✅ Approved | Counter 1 |
| 15:40 | Priya   | Customer Added     | Amit Sharma        | ✅     | Counter 2 |
| 15:38 | Rajesh  | Price Edit Attempt | Product: Colgate   | ❌ Denied | Counter 1 |
| 15:35 | Rohan   | Login Failed       | Wrong password (3rd)| ❌ Locked | Mobile   |

### Staff Performance Dashboard

**Manager View:**
Settings > Staff Performance

**Metrics per Staff:**
• Sales processed today/week/month
• Total revenue generated
• Average bill value
• Items per bill
• Discounts given (amount & %)
• Returns processed
• Customer satisfaction rating
• Speed (avg time per bill)
• Accuracy (billing errors)
• Attendance & punctuality

**Comparison Charts:**
• Bar graph comparing all staff
• Identify top performers
• Identify training needs

**Leaderboard:**
• Top salesperson of the month
• Fastest billing
• Most customer adds
• Best customer ratings

## Security Best Practices

### Password Policy

**Enforce Strong Passwords:**
Settings > Security > Password Policy
• Minimum length: 8 characters
• Require: Uppercase, lowercase, number, special char
• Password expiry: 90 days (force change)
• Can't reuse last 5 passwords
• Lock account after 5 failed attempts
• Auto-logout after 30 minutes idle

### PIN Codes

**Quick Action PINs:**
• 4-6 digit PIN for fast approvals
• Used for: Discount approval, returns, cash drawer
• Faster than full password
• Unique per user
• Change regularly

**PIN Usage:**
• Manager approval needed
• Screen prompts: "Enter Manager PIN"
• Manager types PIN (hidden)
• Action approved/denied

### Two-Factor Authentication (2FA)

**Extra Security Layer:**
Settings > Security > 2FA
• Enable 2FA: Yes/No
• Method: SMS / Authenticator App
• Required for: Owner, Manager (recommended)

**How 2FA Works:**
1. User enters username + password
2. System sends OTP to mobile: "456789"
3. User enters OTP
4. Login successful

**Benefits:**
✅ Prevents unauthorized access even if password stolen
✅ Secure remote access
✅ Compliance requirement for some businesses

### Session Management

**Active Sessions:**
Settings > Security > Active Sessions

**Shows:**
• All currently logged-in users
• Device info (Counter 1, Mobile, etc.)
• Login time
• Last activity
• IP address (if web)

**Actions:**
• View session details
• Force logout (remote disconnect)
• Block device

**Auto-Logout:**
• Idle timeout: 30 minutes (configurable)
• Close app = auto-logout
• Switch user without logout = security warning

## Role-Based Dashboards

**Different Users See Different Dashboards:**

**Owner Dashboard:**
• Complete business overview
• Revenue, profit, expenses
• All insights & analytics
• Staff performance
• System health

**Manager Dashboard:**
• Daily/weekly sales
• Staff performance
• Low stock alerts
• Customer insights
• Approval queue

**Cashier Dashboard:**
• Quick billing shortcut
• Today's sales (own)
• Held bills
• Customer search
• Simple interface (no clutter)

**Warehouse Dashboard:**
• Stock levels
• Reorder alerts
• Purchase orders
• Stock movement
• Inventory reports

**Accountant Dashboard:**
• Financial reports
• Profit/loss
• Tax reports
• Expense summary
• Export options

## Multi-Location Permissions

**For Businesses with Multiple Branches:**

**Location-Based Access:**
• User A: Access only "Branch 1"
• User B: Access only "Branch 2"
• Manager C: Access all branches
• Owner: Access all branches

**Configuration:**
Settings > Users > [User] > Location Access
• Select allowed locations (checkboxes)
• User sees only data from allowed locations
• Reports filtered by location

**Benefits:**
✅ Branch managers can't see other branch data
✅ Staff tied to their location
✅ Centralized owner/admin control
✅ Better privacy & accountability

Next: Customize all system settings to match your business! →`
    },
    {
      id: "settings",
      title: "⚙️ System Settings & Configuration",
      description: "Customize Aadhar POS to match your business needs perfectly",
      icon: Settings,
      content: `# System Settings & Configuration

Complete guide to configuring every aspect of Aadhar POS for your unique business needs.

## Accessing Settings

**Multiple Ways:**
• Dashboard > Settings card
• Sidebar > Settings (gear icon)
• Keyboard shortcut: **Ctrl + ,** (comma)
• User menu (top-right) > Settings

**Settings Layout:**
• Left sidebar: Setting categories
• Right panel: Configuration options
• Search bar: Find settings quickly
• Save button: Apply changes

## Shop Information

**Settings > Shop Information**

**Basic Details:**
• Shop Name: "Aadhar Retail Store"
• Business Type: Grocery / Medical / Electronics / General Store / Cafe / Restaurant / Other
• Tagline: "Quality products, Great service" (appears on receipts)
• Logo: Upload (250x250 px recommended)
• Shop Photo: Upload (for online listings)

**Contact Information:**
• Phone 1: +977-9876543210 (primary)
• Phone 2: +977-1234567890 (alternate)
• Email: info@aadharpos.com
• Website: www.aadharpos.com

**Address:**
• Address Line 1: "123 Main Road"
• Address Line 2: "Near City Hospital"
• City: "Kathmandu"
• Province: "Bagmati"
• Postal Code: "44600"
• Country: "Nepal"

**Social Media:**
• Facebook Page: URL
• Instagram: @username
• WhatsApp Business: Number

**Business Hours:**
• Monday: 9:00 AM - 8:00 PM
• Tuesday: 9:00 AM - 8:00 PM
• ... (set for each day)
• Closed Days: Select (e.g., Public Holidays)

**GST/Tax Registration:**
• GST Registered: Yes / No
• GSTIN: 27XXXXX1234X1Z5
• PAN: ABCDE1234F
• State: Maharashtra
• GST Registration Date: 01-04-2023

**Save:** Shop info updated (reflects on receipts, reports)

## Tax Settings

**Settings > Tax & GST**

### GST Configuration (India)

**Enable GST:** Yes / No

**Tax Structure:**
• CGST + SGST (intra-state)
• IGST (inter-state)
• Auto-detect based on customer state

**Default Tax Rates:**
• 0% (Exempted items)
• 5% (Essential goods)
• 12% (Standard goods)
• 18% (Services, premium goods)
• 28% (Luxury items)

**Product-Wise Tax:**
Each product assigned HSN code + GST rate

**Tax Inclusive/Exclusive:**
• Prices include tax: Yes (MRP model)
• Prices exclude tax: No (add tax at billing)

**HSN Code Management:**
• Library of 10,000+ HSN codes
• Search by product category
• Auto-suggest HSN for products

### VAT Configuration (Nepal)

**Enable VAT:** Yes / No

**VAT Rate:** 13% (standard Nepal VAT)

**PAN Number:** 123456789 (for tax returns)

**VAT Invoice Format:**
• Include PAN on receipt
• VAT breakdown shown
• Taxable vs non-taxable items

### Tax Exemptions

**Exempt Categories:**
• Select product categories to exempt from tax
• Example: Fresh vegetables (0% GST)

**Exempt Customers:**
• Select customer groups to exempt
• Example: Government entities, NGOs

## Currency & Regional

**Settings > Currency & Regional**

**Currency:**
• Primary Currency: Nepalese Rupee (NPR) / Indian Rupee (INR)
• Currency Symbol: Rs  / रू / Rs
• Symbol Position: Before / After amount
• Decimal Places: 2 (Rs 99.99) or 0 (Rs 100)

**Number Format:**
• Thousand Separator: Comma (1,00,000) or Period (100.000)
• Decimal Separator: Period (99.99) or Comma (99,99)
• Negative Numbers: -99 or (99) or 99-

**Date Format:**
• DD-MM-YYYY (29-11-2025) [Default Nepal]
• MM-DD-YYYY (11-29-2025)
• YYYY-MM-DD (2025-11-29)

**Time Format:**
• 12-hour (03:45 PM)
• 24-hour (15:45)

**First Day of Week:**
• Sunday (default)
• Monday

**Calendar System:**
• Gregorian (Western)
• Bikram Sambat (Nepali calendar)
• Show both: Yes / No

**Language:**
• Primary: English / नेपाली (Nepali)
• Receipts: English / Nepali / Both
• UI Language: English / Nepali
• Number System: English (1,2,3) / Nepali (१,२,३)

## Billing Settings

**Settings > Billing**

**Bill Number Format:**
• Prefix: INV- / BILL- / Custom
• Starting Number: 1 (or continue from old system)
• Number Length: 5 digits (00001) or 6 digits (000001)
• Reset Frequency: Never / Monthly / Yearly
• Example: INV-2025-00234

**Bill Footer:**
• Custom message: "Thank you for your business!"
• Terms & Conditions: Link or text
• Return Policy: "Returns within 7 days with receipt"
• Contact for Support: Phone number

**Receipt Layout:**
• Paper Size: 3 inch / 2 inch (thermal) / A4 / A5
• Font Size: Small / Medium / Large
• Logo Position: Top Center / Top Left / None
• QR Code: Include / Don't include
• Barcode: Include bill number barcode / Don't include

**Receipt Copies:**
• Print copies: 1 / 2 / 3
• Original + Duplicate labels: Yes / No
• Auto-print: Yes / No (if No, print button shown)

**Bill Options:**
• Allow decimal quantities: Yes / No
• Allow negative stock sale: Yes / No (sell even if out of stock)
• Auto-apply customer loyalty points: Yes / No
• Show product images on bill screen: Yes / No
• Require customer selection: Optional / Mandatory / Not needed

**Payment Options:**
• Enable cash payments: Yes
• Enable card payments: Yes
• Enable UPI payments: Yes
• Enable credit sales: Yes
• Custom payment methods: Add (e.g., Gift Card, Bitcoin, etc.)

**Discounts:**
• Allow item-level discount: Yes / No
• Allow bill-level discount: Yes / No
• Maximum discount % (staff): 5% / 10% / Custom
• Require discount reason: Yes / No

**Tax on Bill:**
• Show tax breakdown: Yes (CGST/SGST separate) / No (one line)
• Include tax in product price: Yes / No
• Tax summary at bottom: Yes / No

## Inventory Settings

**Settings > Inventory**

**Stock Management:**
• Track inventory: Yes / No (some businesses don't need)
• Allow negative stock: Yes / No
• Low stock threshold: Global 10 units / Per product
• Auto-reorder alerts: Enable / Disable

**Stock Valuation Method:**
• FIFO (First In First Out) [Default]
• LIFO (Last In First Out)
• Weighted Average Cost
• Last Purchase Price

**Product Settings:**
• Auto-generate SKU: Yes / No
• SKU format: Prefix + Category + Number
• Require product images: Yes / No
• Barcode format: EAN-13 / UPC / Code-128
• Allow duplicate product names: Yes / No

**Categories:**
• Manage product categories
• Add/Edit/Delete categories
• Set category-wise tax rates
• Category hierarchy (subcategories)

**Units of Measurement:**
• Add custom units: kg, gram, liter, ml, piece, box, dozen, etc.
• Default unit: Piece
• Allow unit conversion: Yes (1 kg = 1000 g)

**Batches & Expiry:**
• Enable batch tracking: Yes / No (for medicines, food)
• Enable expiry tracking: Yes / No
• Alert before expiry: 30 days / 60 days / 90 days
• Auto-block expired products: Yes / No

## Printer Settings

**Settings > Printers**

**Receipt Printer:**
• Printer Name: (select from list)
• Connection Type: USB / Bluetooth / Network / Cloud
• Paper Size: 2 inch / 3 inch / A4
• Print Speed: Fast / Normal / Slow
• Auto-open cash drawer: Yes / No

**Test Print:** Button to print test receipt

**Label Printer:**
• For barcode labels, price tags
• Configure separate if available

**Invoice Printer:**
• For A4 size tax invoices (GST)
• Configure separate from receipt printer

**Printer Preferences:**
• Default printer: Receipt printer
• Fallback printer: If primary fails
• Print via cloud: Yes (for remote print)
• Save print jobs: Keep history

**Receipt Design:**
• Header: Logo + Shop Name
• Font: Monospace / Sans-serif / Serif
• Bold for totals: Yes
• QR code size: Small / Medium / Large
• Footer text size: Small / Medium

## Loyalty Program Settings

**Settings > Loyalty Program**

(See "Customers & Loyalty" section for detailed configuration)

**Quick Settings:**
• Enable loyalty: Yes / No
• Earning rate: 1 point per Rs 100
• Redemption value: 1 point = Rs 1
• Point expiry: No expiry / 365 days
• Minimum redemption: 50 points

## User & Permissions Settings

**Settings > Users & Permissions**

(See "User Permissions" section for details)

**Quick Settings:**
• Total users: 5 / Unlimited (plan-based)
• Default role for new users: Cashier
• Require strong passwords: Yes / No
• Session timeout: 30 minutes
• Allow multiple sessions per user: Yes / No

## Backup & Data Settings

**Settings > Backup & Restore**

**Auto-Backup:**
• Enable: Yes / No
• Frequency: Daily / Weekly
• Time: 12:00 AM (midnight)
• Keep backups: Last 7 days / 30 days / Forever
• Backup location: Local / Cloud / Both

**Manual Backup:**
• Create backup now (button)
• Download backup file
• Save to external drive

**Restore:**
• Upload backup file
• Select restore point (date)
• Confirm restore

**Cloud Backup:**
• Provider: Aadhar Cloud / Google Drive / Dropbox
• Auto-sync: Yes / No
• Sync frequency: Real-time / Hourly / Daily
• Encryption: AES-256 (enabled by default)

**Data Retention:**
• Keep sales history: Forever / 2 years / 1 year
• Keep deleted records: 90 days / 30 days / Never
• Archive old data: Yes / No (moves to archive DB)

## Notification Settings

**Settings > Notifications**

**Enable Notifications:** Yes / No

**Notification Types:**

**Low Stock Alerts:**
• Enable: Yes
• Alert threshold: 10 units (or per-product)
• Alert to: Owner, Manager, Warehouse staff
• Frequency: Real-time / Daily digest

**Sales Milestones:**
• Daily target: Rs 50,000
• Alert when reached: Yes
• Celebrate milestone: Yes (confetti on screen 🎉)

**Payment Reminders:**
• Credit payment due: 3 days before
• Overdue payment: Daily reminder
• Alert to: Owner, Manager

**System Alerts:**
• Software updates available: Yes
• Sync errors: Yes
• Printer issues: Yes
• Low disk space: Yes

**Customer Notifications:**
• Birthday wishes: Auto-send at 9 AM
• Anniversary wishes: Auto-send at 9 AM
• Loyalty points balance: Monthly
• Inactive customer recall: After 30 days

**Delivery Method:**
• In-app notification: Yes
• SMS: Yes / No (cost applies)
• Email: Yes / No
• Push notification (mobile): Yes / No

**Quiet Hours:**
• No notifications between: 10 PM - 8 AM
• Except critical alerts (sales, payments)

## Appearance & Theme

**Settings > Appearance**

**Color Theme:**
• Light Mode (default)
• Dark Mode (easier on eyes)
• Auto (system preference)
• High Contrast (accessibility)

**Accent Color:**
• Blue (default)
• Green
• Purple
• Red
• Custom (color picker)

**Dashboard Layout:**
• Compact (more cards visible)
• Comfortable (default spacing)
• Spacious (large cards)

**Font Size:**
• Small (fit more info)
• Medium (default)
• Large (better readability)
• Extra Large (accessibility)

**Sidebar:**
• Always expanded
• Auto-collapse
• Icons only (more screen space)

**Receipt Theme:**
• Classic (black & white)
• Colorful (brand colors)
• Minimal (less ink usage)

## Payment Gateway Settings

**Settings > Payment Gateways**

**UPI Configuration:**
• UPI ID: yourshop@paytm / yourshop@ybl
• QR Code type: Static / Dynamic
• Auto-verify payments: Yes / No

**Card Machine:**
• Provider: HDFC / ICICI / SBI / PayTM
• Terminal ID: 12345678
• Merchant ID: MER123456

**Online Payments (for online orders):**
• Razorpay: API Key + Secret
• PayTM: Merchant ID + Key
• PhonePe: Merchant ID
• Stripe: API Key

## Email Settings

**Settings > Email Configuration**

**Email Provider:**
• Gmail (SMTP)
• Outlook
• Custom SMTP

**SMTP Settings:**
• SMTP Server: smtp.gmail.com
• Port: 587 (TLS) / 465 (SSL)
• Username: yourshop@gmail.com
• Password: (app-specific password)
• From Name: "Aadhar Retail Store"

**Email Templates:**
• Welcome email (new customer)
• Receipt email
• Credit reminder
• Promotional email
• Password reset

**Test Email:** Send test to verify config

## SMS Settings

**Settings > SMS Configuration**

**SMS Provider:**
• Aadhar SMS (built-in)
• Twilio
• MSG91
• Fast2SMS
• Custom gateway

**API Configuration:**
• API Key: xxxx-xxxx-xxxx
• Sender ID: NEXPOS (6 char)
• Route: Transactional / Promotional

**SMS Balance:**
• Current balance: 500 SMS
• Recharge option
• Auto-recharge at 50 SMS: Yes / No

**SMS Templates:**
• Bill receipt SMS
• Payment reminder
• Birthday wish
• Promotional offer

**DND Compliance:**
• Don't send promotional SMS to DND numbers: Yes
• Transactional SMS allowed to all: Yes

## Integration Settings

**Settings > Integrations**

**Accounting Software:**
• QuickBooks: Connect
• Tally: Export format
• Zoho Books: API key
• Wave: Connect

**E-commerce:**
• Shopify: Sync inventory
• WooCommerce: Sync products
• Magento: API integration

**Analytics:**
• Google Analytics: Tracking ID
• Facebook Pixel: Pixel ID

**Delivery Partners:**
• Dunzo: API key
• Swiggy: Merchant ID
• Zomato: Restaurant ID

**WhatsApp Business API:**
• Provider: Sparrow SMS / Aakash SMS
• API Key: xxxx-xxxx
• Phone Number: +977-9876543210

## Advanced Settings

**Settings > Advanced**

**Database:**
• Database engine: SQLite / PostgreSQL
• Database path: (view only)
• Database size: 245 MB
• Optimize database: (button - frees unused space)
• Repair database: (button - fix corruption)

**Performance:**
• Cache size: 100 MB / 500 MB / 1 GB
• Lazy loading: Enable (loads data as needed)
• Image compression: Yes (reduce storage)
• Sync batch size: 50 / 100 / 200 records

**Developer Options:**
• Enable debug mode: Yes / No (shows technical errors)
• API access: Enable / Disable
• API Key: xxxx-xxxx-xxxx (generate)
• Webhook URL: (for external integrations)

**Experimental Features:**
• Beta features: Enable / Disable
• AI recommendations: Enable / Disable
• Voice commands: Enable / Disable

**Data Migration:**
• Import from other POS: (wizard)
• Export all data: (CSV/JSON)
• Reset all data: ⚠️ (dangerous - full wipe)

## System Information

**Settings > About**

**Software:**
• Aadhar POS Version: 5.2.0
• Build: 2025-11-15
• License: Pro Plan
• License expires: 2026-11-28 (365 days)

**Hardware:**
• Device: HP Desktop / Samsung Tablet
• OS: Windows 11 / Android 14
• RAM: 8 GB
• Storage: 256 GB (150 GB free)
• Processor: Intel i5 / Snapdragon 888

**Network:**
• Internet: Connected (15 Mbps)
• Sync status: Up to date
• Last synced: 2 minutes ago
• Server: Mumbai, India (45ms latency)

**Database:**
• Records: 5,420 products, 2,150 customers, 28,450 bills
• Database size: 245 MB
• Oldest record: 2023-01-01

**Support:**
• Documentation: aadharpos.com/docs
• Support email: support@aadharpos.com
• Support phone: +977-9876543210
• WhatsApp: +977-9876543210
• Live chat: Available 9 AM - 9 PM

**Updates:**
• Check for updates: (button)
• Auto-update: Enable / Disable
• Update channel: Stable / Beta

**Legal:**
• Privacy Policy: (link)
• Terms of Service: (link)
• License Agreement: (link)
• Attributions: (open source libraries used)

Next: Dive into admin documentation and technical details! →`
    },
    {
      id: "products-inventory",
      title: "📦 Product & Inventory Management",
      description: "Complete guide to managing your product catalog and stock levels",
      icon: Package,
      content: `# Product & Inventory Management

Master the art of product catalog management, stock control, and inventory optimization with Aadhar POS.

## Adding Products - Method 1: Barcode Scanner

### Using Handheld USB/Bluetooth Scanner

**Step-by-Step Process:**

1. **Navigate to Products**
   • Click "Products" in sidebar menu
   • Or press **F3** keyboard shortcut
   • Click **"+ Add New Product"** button (top-right)

2. **Activate Barcode Field**
   • Click in "Barcode" input field
   • Field highlights with blue border (ready for scan)
   • Ensure scanner is powered on

3. **Scan the Product Barcode**
   • Point scanner at product barcode
   • Press trigger button (red button on scanner)
   • Scanner emits red laser line
   • **Beep sound** = successful scan
   • Barcode number appears in field instantly

4. **Automatic Product Lookup**
   System performs 3-tier search:
   
   **Tier 1: Local Database (0.1 seconds)**
   • Searches your existing products
   • If found: Shows "Product already exists" warning
   • Option to edit existing or continue
   
   **Tier 2: Global Product API (1-2 seconds)**
   • If not in local DB and internet available
   • Queries international product database
   • 1.5 million+ products from India, Nepal, International brands
   
   **Tier 3: Manual Entry Required**
   • If product not found anywhere
   • You'll enter details manually

5. **Auto-Fill Magic** (if found in global database)
   ✅ **Product Name**: Full official name
   ✅ **Brand**: Manufacturer name
   ✅ **Category**: Auto-assigned (Beverages/Snacks/etc.)
   ✅ **Product Image**: High-quality official image
   ✅ **MRP**: Suggested market price
   ✅ **Pack Size**: Weight/volume
   ✅ **Manufacturer**: Company name

6. **Fill Remaining Required Fields**
   Even with auto-fill, you must enter:
   • **Your Cost Price**: What you pay supplier (Rs )
   • **Your Selling Price**: What customer pays (Rs )
   • **Opening Stock**: Initial quantity in inventory
   • **Minimum Stock**: Low stock alert threshold
   • **Supplier**: Who you buy from (optional)

7. **Review and Save**
   • Check all information is correct
   • Adjust prices if needed
   • Click **"Save Product"** (green button)
   • Success message: "Product added successfully!"
   • Product appears in catalog immediately

**Scanner Best Practices:**
✅ **Distance**: 4-6 inches from barcode
✅ **Angle**: Perpendicular to barcode (90°)
✅ **Lighting**: Good light, avoid shadows
✅ **Cleanliness**: Wipe scanner lens weekly
✅ **Barcode Quality**: Ensure barcode not damaged/faded

**Common Scanner Issues:**

**🔴 Scanner Not Beeping:**
• Check USB connection (try different port)
• Check battery if wireless
• Test with known barcode (any product)
• Reinstall drivers (Windows Device Manager)

**🔴 Wrong Products Loading:**
• Barcode damaged on package
• Scanner reading multiple barcodes at once
• Try manual entry instead

**🔴 Scan But Nothing Happens:**
• Ensure cursor in barcode field
• Check keyboard layout (should be English)
• Scanner may be in wrong mode (check manual)

### Supported Barcode Formats

✅ **EAN-13** (Most common in Nepal)
• 13 digits: 8901234567890
• Used by 95% of FMCG products
• Standard for groceries, snacks, beverages

✅ **EAN-8** (Compact version)
• 8 digits: 12345678
• Smaller packages, cigarettes

✅ **UPC-A** (North American)
• 12 digits: 123456789012
• Imported products from USA

✅ **UPC-E** (Compact UPC)
• 6-8 digits
• Small items

✅ **Code 128** (Warehouse/Logistics)
• Alphanumeric
• Used for internal codes

✅ **Code 39**
• Older format
• Still used in some industries

✅ **QR Codes**
• Square matrix codes
• Can contain product URLs, data

## Adding Products - Method 2: Camera Scanner

### Using Smartphone/Webcam

**When to use camera scanning:**
✅ Don't have handheld scanner
✅ Handheld scanner battery dead
✅ Mobile device more convenient
✅ Adding products from phone while on shop floor

**Step-by-Step:**

1. **Open Camera Scanner**
   • Products → Add New Product
   • Click 📷 **Camera Icon** (next to barcode field)
   • Or in billing: Click camera icon to add products

2. **Grant Camera Permission**
   **First time only:**
   • Browser asks: "Allow camera access?"
   • Click **"Allow"** or **"Yes"**
   • If denied by mistake:
     - Go to browser settings
     - Find "Site Permissions" or "Privacy"
     - Enable camera for app.aadhar.com.np

3. **Position Product Barcode**
   • Hold product steady
   • **Red scanning line** appears on screen
   • Align barcode within frame (rectangle guide)
   • Keep 6-8 inches distance from camera

4. **Auto-Detection**
   • System continuously scans (1-2 seconds)
   • When detected:
     - Phone **vibrates** (mobile)
     - **Beep sound** plays
     - Barcode number appears
     - Camera closes automatically

5. **Same Auto-Fill Process**
   • Product lookup happens (local → global API)
   • Information fills automatically if found
   • Complete remaining fields
   • Save product

**Camera Scanning Tips:**

✅ **Lighting is KEY**
• Avoid dark rooms
• Don't create shadow on barcode
• Best: Natural daylight or bright ceiling light
• Worst: Direct sunlight (causes glare)

✅ **Hold Steady**
• 2-3 seconds without moving
• Lean on counter for stability
• Use both hands

✅ **Barcode Condition**
• Must be clean (no dirt/water)
• Not wrinkled or torn
• Avoid glossy packaging reflection

✅ **Phone Quality Matters**
• Newer phones = faster detection
• Clean camera lens before scanning
• Use rear camera (better quality than front)

**Troubleshooting Camera Scan:**

**❌ Camera Not Opening:**
• Check browser permissions
• Try different browser (Chrome recommended)
• Update browser to latest version
• Restart device

**❌ Slow Detection:**
• Improve lighting
• Clean camera lens
• Move closer/farther to find sweet spot
• Rotate barcode orientation

**❌ Wrong Product Detected:**
• Barcode damaged
• Multiple barcodes on packaging
• Switch to manual entry

## Adding Products - Method 3: Manual Entry

### Complete Form Breakdown

For products without barcode or when scanner unavailable.

### Section 1: Basic Information

**Product Name** (Required)
• Full descriptive name
• Include: Brand + Product + Variant + Size
• ✅ Good: "Wai Wai Chicken Noodles 75g"
• ❌ Bad: "Noodles" (too vague)
• ❌ Bad: "Wai Wai" (missing variant)

**Brand** (Optional but recommended)
• Manufacturer/company name
• Examples: Wai Wai, Coca-Cola, Dabur, Patanjali
• Helps with reporting and grouping

**Category** (Required)
• Select from dropdown:
  - Beverages (soft drinks, juices, water)
  - Snacks (chips, namkeen, biscuits)
  - Personal Care (soap, shampoo, cosmetics)
  - Household (detergents, cleaners)
  - Grocery (dal, rice, flour, oil)
  - Dairy (milk, paneer, butter)
  - Medicines (pharmacy items)
  - Electronics (mobile, accessories)
  - Stationery (pens, notebooks)
  - Custom categories (create your own)

• **Or Create New**: Click "+ New Category"
  - Enter category name
  - Choose icon (optional)
  - Select parent category (for sub-categories)

**Sub-Category** (Optional)
• For better organization
• Example hierarchy:
  - Category: Beverages
    - Sub-category: Soft Drinks
    - Sub-category: Juices
    - Sub-category: Energy Drinks

### Section 2: Identification Codes

**SKU (Stock Keeping Unit)** (Required)
• Unique identifier for this product
• **Auto-generated**: SKU-001, SKU-002, etc.
• **Or Custom**: Create your own system
  - Example: BEV-CC-500 (Beverage-CocaCola-500ml)
  - Example: MED-PAR-500 (Medicine-Paracetamol-500mg)

**Barcode** (Highly Recommended)
• 8-13 digit barcode number
• Can be entered manually if scanner unavailable
• Look at product packaging
• Type exactly as printed
• **Tip**: Use camera scanner for accuracy

**HSN Code** (Optional - for GST/VAT)
• Harmonized System Nomenclature
• Required for tax filing in some countries
• Example: 2202 (for mineral water)
• Your accountant can provide this

### Section 3: Pricing

**Cost Price (CP)** (Required)
• What YOU pay to supplier
• Also called: Purchase Price, Trade Price
• Example: You buy at Rs 50
• **Include**: Transportation, any charges
• **Used for**: Profit calculation

**Selling Price (MRP/SP)** (Required)
• What CUSTOMER pays
• Also called: Retail Price, MRP
• Example: You sell at Rs 80
• **Must be** ≥ Cost Price (obviously!)

**Profit per Unit** (Auto-calculated)
• System calculates: Selling Price - Cost Price
• Example: Rs 80 - Rs 50 = Rs 30 profit
• Shows margin %: (Rs 30/Rs 80) × 100 = 37.5%

**Bulk Pricing** (Optional - Advanced)
Click "Add Bulk Price" to create quantity discounts:
• **Quantity 1-10**: Rs 80 each (regular price)
• **Quantity 11-50**: Rs 75 each (6% discount)
• **Quantity 51+**: Rs 70 each (12% discount)

Useful for:
✅ Wholesale customers
✅ Bulk buyers
✅ B2B sales
✅ Loyalty rewards

### Section 4: Inventory & Stock

**Opening Stock** (Required)
• Current quantity in inventory
• Count physically before entering
• Example: 48 units on shelf
• **Important**: Be accurate! This affects reports.

**Minimum Stock Level** (Recommended)
• Low stock alert threshold
• System warns when quantity falls below this
• How to calculate:
  - Check average daily sales (from reports)
  - Multiply by supplier lead time
  - Add safety buffer
  
  **Example Calculation:**
  - Sell 5 units per day
  - Supplier takes 3 days to deliver
  - Set minimum: 5 × 3 + 5 (buffer) = 20 units

**Unit of Measure** (Required)
Select from:
• **Piece/Unit** (most common) - discrete items
• **Kilogram (kg)** - rice, dal, flour
• **Gram (g)** - spices, gold
• **Liter (L)** - oil, liquids
• **Milliliter (ml)** - small bottles
• **Meter (m)** - fabrics, wires
• **Box** - cartons
• **Pack** - bundled items

**Storage Location** (Optional)
• Rack number, shelf, aisle
• Example: "Rack-A5", "Shelf-2-Top", "Warehouse-B"
• Helps staff find products quickly
• Useful for large inventory

### Section 5: Additional Details

**Product Image**
• Upload product photo
• **Methods:**
  1. Click "Upload" → Browse file
  2. Drag and drop image
  3. Click camera icon → Take photo
• **Specifications:**
  - Formats: JPG, PNG, WebP
  - Max size: 5MB
  - Recommended: 800×800 pixels
  - Square images look best

**Description** (Optional)
• Brief product details
• Features, benefits
• Usage instructions
• Ingredients (for food)
• Example: "Spicy chicken flavor instant noodles. Ready in 3 minutes. Contains: Wheat flour, spices, palm oil. Vegetarian."

**Expiry Date** (For perishables)
• Essential for:
  - Medicines
  - Food items
  - Cosmetics
• System alerts 30 days before expiry
• FIFO reports (First In First Out)

**Manufacturer/Supplier**
• Select from existing suppliers
• Or add new: Click "+ Add Supplier"
  - Supplier name
  - Contact person
  - Phone/Email
  - Address
  - Payment terms
  - Lead time (delivery days)

**Tags** (Optional - but powerful!)
• Add keywords for easy search
• Example: "noodles, instant, spicy, vegetarian, fast-food"
• Benefits:
  - Quick search: Type any tag word
  - Group related products
  - Promotions: "All tagged 'summer' 20% off"

### Section 6: Advanced Settings

**☑️ Enable Stock Tracking**
• Toggle ON (default): System tracks quantity
• Toggle OFF: Unlimited stock (services, digital products)

**☑️ Allow Negative Stock**
• ON: Can sell even if quantity = 0
• OFF: Blocks sale if out of stock
• Use case: Product on the way from supplier

**Tax Category**
• **Standard Rate**: 13% VAT (Nepal default)
• **Zero-Rated**: 0% tax (books, medicines)
• **Exempt**: No tax applicable
• **Custom Rate**: Enter specific percentage

**Staff Commission** (Optional)
• Percentage commission for selling this product
• Example: 5% commission on mobile phone sales
• Staff incentive program

**Variants/Options** (Advanced)
For products with size/color/flavor options:

Click "Add Variants" → Choose variant type:
• **Size**: S, M, L, XL
• **Color**: Red, Blue, Green
• **Flavor**: Chocolate, Vanilla, Strawberry

Each variant can have:
• Different price
• Different SKU
• Different stock quantity
• Different barcode

**Example: T-Shirt**
• Base product: Cotton T-Shirt
• Variants:
  - Small (Red): Rs 300, Stock: 10, SKU: TSH-S-R
  - Small (Blue): Rs 300, Stock: 15, SKU: TSH-S-B
  - Medium (Red): Rs 350, Stock: 20, SKU: TSH-M-R
  - Large (Blue): Rs 400, Stock: 8, SKU: TSH-L-B

## Bulk Product Import from Excel

### For adding 100s or 1000s of products at once

**Step 1: Download Template**
• Products → Import → **"Download Excel Template"**
• Template file: aadhar-products-template.xlsx
• Pre-formatted columns

**Step 2: Fill Excel File**

**Required Columns:**
• **Product Name** (text)
• **Cost Price** (number)
• **Selling Price** (number)
• **Opening Stock** (number)

**Optional Columns:**
• Brand
• Category
• Sub-Category
• SKU (auto-generated if empty)
• Barcode
• Description
• Minimum Stock
• Unit
• Tags (comma-separated)

**Example Excel Data:**
| Product Name | Brand | Category | Barcode | Cost Price | Selling Price | Stock |
|---|---|---|---|---|---|---|
| Wai Wai Chicken 75g | Wai Wai | Snacks | 8901234567890 | 12 | 20 | 500 |
| Coca Cola 250ml | Coca Cola | Beverages | 8901030111112 | 15 | 25 | 300 |

**Step 3: Upload File**
• Products → Import → **"Upload Excel"**
• Select your filled file
• Click "Upload"

**Step 4: Column Mapping**
System shows preview:
• Map Excel columns to Aadhar fields
• Example: "Item Name" → "Product Name"
• Click "Confirm Mapping"

**Step 5: Validation**
System checks for:
❌ Duplicate barcodes
❌ Missing required fields
❌ Invalid prices (cost > selling)
❌ Invalid numbers

**Errors shown with row numbers:**
• Row 15: Missing product name
• Row 23: Selling price less than cost
• Row 47: Duplicate barcode 8901234567890

Fix Excel file → Re-upload

**Step 6: Import**
• If all valid: Click **"Import All Products"**
• Progress bar shows: "Importing 523 products..."
• Wait until complete
• Success: "523 products imported successfully!"

### Bulk Update Existing Products

**Use Case**: Update prices for all products

**Option 1: Bulk Price Adjustment**
• Products → Select All (or filter category)
• Bulk Actions → "Price Adjustment"
• Choose:
  - Increase by: 10% OR Fixed amount: Rs 5
  - Apply to: Cost Price or Selling Price
  - For: All selected products
• Preview changes
• Confirm

**Option 2: Export → Edit → Re-import**
• Export current products to Excel
• Edit prices/stock in Excel
• Re-import (system updates existing)`
    }
  ]

  return (
    <div className="space-y-4">
      {userDocs.map((doc) => (
        <DocSection
          key={doc.id}
          doc={doc}
          expanded={expandedSections[doc.id]}
          onToggle={() => toggleSection(doc.id)}
        />
      ))}
      
      <div className="bg-gradient-to-r from-orange-400/10 to-purple-400/10 rounded-xl p-8 border border-orange-400/20 text-center">
        <Sparkles className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">1000+ Pages of Documentation</h3>
        <p className="text-gray-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
          Complete guides for Products, Billing, Inventory, Reports, Customers, Insights, Offline Mode, Cloud Sync, Settings, and more!
        </p>
        <div className="flex flex-wrap gap-3 justify-center text-sm">
          <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-700 dark:text-slate-300">📦 Product Management</span>
          <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-700 dark:text-slate-300">🛒 Billing System</span>
          <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-700 dark:text-slate-300">📊 Business Insights</span>
          <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-700 dark:text-slate-300">💰 Expense Tracking</span>
          <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-700 dark:text-slate-300">👥 Customer Loyalty</span>
          <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-700 dark:text-slate-300">🔄 Offline Mode</span>
          <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-700 dark:text-slate-300">☁️ Cloud Sync</span>
          <span className="px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-700 dark:text-slate-300">🔐 User Permissions</span>
        </div>
      </div>
    </div>
  )
}

// Reusable Doc Section Component
function DocSection({ doc, expanded, onToggle }) {
  const Icon = doc.icon
  
  return (
    <div className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-400/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{doc.title}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{doc.description}</p>
          </div>
        </div>
        <ChevronRight className={`w-6 h-6 text-gray-600 dark:text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      
      {expanded && (
        <div className="p-8 space-y-6 bg-white dark:bg-slate-950/50">
          <div className="prose dark:prose-invert prose-cyan max-w-none">
            {doc.content.split('\n\n').map((paragraph, i) => {
              // Headers
              if (paragraph.startsWith('### ')) {
                return <h4 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
                  <span className="text-orange-400">▸</span>
                  {paragraph.replace('### ', '')}
                </h4>
              }
              if (paragraph.startsWith('## ')) {
                return <h3 key={i} className="text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-5 border-b border-gray-200 dark:border-slate-800 pb-3">
                  {paragraph.replace('## ', '')}
                </h3>
              }
              if (paragraph.startsWith('# ')) {
                return <h2 key={i} className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent mt-0 mb-6">
                  {paragraph.replace('# ', '')}
                </h2>
              }
              
              // Bold text
              if (paragraph.includes('**')) {
                const parts = paragraph.split('**')
                return (
                  <p key={i} className="text-gray-700 dark:text-slate-300 mb-4 leading-relaxed text-lg">
                    {parts.map((part, j) => 
                      j % 2 === 1 ? <strong key={j} className="text-gray-900 dark:text-white font-semibold">{part}</strong> : part
                    )}
                  </p>
                )
              }
              
              // Bullet lists
              if (paragraph.startsWith('•') || paragraph.startsWith('✅') || paragraph.startsWith('🔴') || paragraph.startsWith('🟡') || paragraph.startsWith('🔵') || paragraph.startsWith('⚪') || paragraph.startsWith('🟢')) {
                const items = paragraph.split('\n')
                return (
                  <ul key={i} className="space-y-3 mb-6">
                    {items.map((item, j) => (
                      <li key={j} className="text-gray-700 dark:text-slate-300 flex items-start gap-3 text-lg">
                        <span className="text-orange-400 mt-1 text-xl">•</span>
                        <span>{item.replace(/^[•✅🔴🟡🔵⚪🟢]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
              
              // Code blocks
              if (paragraph.startsWith('```')) {
                const code = paragraph.replace(/```\w*\n?/g, '')
                return (
                  <pre key={i} className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto mb-6 border border-gray-200 dark:border-slate-800">
                    <code className="text-orange-400 text-sm">{code}</code>
                  </pre>
                )
              }
              
              // Empty lines
              if (paragraph.trim() === '') {
                return <div key={i} className="h-4"></div>
              }
              
              // Regular paragraphs
              return <p key={i} className="text-gray-700 dark:text-slate-300 mb-4 leading-relaxed text-lg">{paragraph}</p>
            })}
          </div>
        </div>
      )}
    </div>
  )
}
