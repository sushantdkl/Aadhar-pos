"use client"

import { useState, useRef, useEffect, useId, useMemo } from "react"
import Link from "next/link"
import { CheckCircle2, AlertCircle, Loader2, Copy, Check } from "lucide-react"
import {
  BUSINESS_TYPES, CONTACT_METHODS, MODULES, HARDWARE, PACKAGE_OPTIONS,
  CONDITIONAL_FIELDS, validateQuote, estimateQuote,
} from "@/lib/quote-schema"
import { npr } from "@/lib/content/format"
import { CONTACT, EVALUATION } from "@/lib/content/site"
import { cn } from "@/lib/utils"

const EMPTY = {
  fullName: "", businessName: "", phone: "", email: "", businessType: "", location: "",
  outlets: "1", users: "2", selectedPackage: "", currentSoftware: "", modules: [],
  tableCount: "", roomCount: "", productCount: "",
  needsDataMigration: false, needsWebsite: false, needsOnlineOrdering: false,
  needsPaymentIntegration: false, needsIrdIntegration: false,
  hardware: [], installDate: "", additionalRequirements: "", contactMethod: "phone",
  consent: false,
  company_website: "", // honeypot — must stay empty
}

/* ── field primitives ─────────────────────────────────────── */

const fieldBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 " +
  "dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"

function Field({ label, htmlFor, error, hint, required, children, className }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-slate-200">
        {label}
        {required && <span className="ml-0.5 text-orange-500" aria-hidden="true">*</span>}
        {!required && <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-slate-600">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function CheckGroup({ legend, options, selected, onToggle, name }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold text-gray-800 dark:text-slate-200">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const id = `${name}-${opt.replace(/\W+/g, "-").toLowerCase()}`
          const checked = selected.includes(opt)
          return (
            <label
              key={opt}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-sm transition-colors",
                checked
                  ? "border-orange-500 bg-orange-500/[0.07] text-gray-900 dark:text-white"
                  : "border-gray-300 text-gray-700 hover:border-orange-400 dark:border-slate-700 dark:text-slate-300"
              )}
            >
              <input
                type="checkbox"
                id={id}
                name={name}
                value={opt}
                checked={checked}
                onChange={() => onToggle(opt)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500 dark:border-slate-600"
              />
              <span className="leading-snug">{opt}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function Toggle({ id, label, description, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
        checked
          ? "border-orange-500 bg-orange-500/[0.07]"
          : "border-gray-300 hover:border-orange-400 dark:border-slate-700"
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500 dark:border-slate-600"
      />
      <span>
        <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs leading-relaxed text-gray-500 dark:text-slate-500">{description}</span>
        )}
      </span>
    </label>
  )
}

/* ── main form ────────────────────────────────────────────── */

export default function QuoteForm({ defaultPackage = "", defaultBusinessType = "", onSuccess }) {
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    selectedPackage: defaultPackage || "",
    businessType: defaultBusinessType || "",
  }))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("idle") // idle | submitting | success | error
  const [serverError, setServerError] = useState("")
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const startedAt = useRef(Date.now())
  const errorSummaryRef = useRef(null)
  const successRef = useRef(null)
  const uid = useId()

  const set = (key) => (e) => {
    const value = e && e.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const toggleIn = (key) => (option) =>
    setValues((v) => ({
      ...v,
      [key]: v[key].includes(option) ? v[key].filter((x) => x !== option) : [...v[key], option],
    }))

  // Live, non-binding estimate.
  const estimate = useMemo(() => {
    if (!values.selectedPackage) return null
    return estimateQuote({
      selectedPackage: values.selectedPackage,
      // Drives the retail-vs-restaurant split on online ordering.
      businessType: values.businessType,
      needsDataMigration: values.needsDataMigration,
      needsWebsite: values.needsWebsite,
      needsOnlineOrdering: values.needsOnlineOrdering,
      needsPaymentIntegration: values.needsPaymentIntegration,
      needsIrdIntegration: values.needsIrdIntegration,
      outlets: Number(values.outlets) || 1,
    })
  }, [values])

  const showTables = CONDITIONAL_FIELDS.tableCount.includes(values.businessType)
  const showRooms = CONDITIONAL_FIELDS.roomCount.includes(values.businessType)
  const showProducts = CONDITIONAL_FIELDS.productCount.includes(values.businessType)

  useEffect(() => {
    if (status === "error" && Object.keys(errors).length > 0) errorSummaryRef.current?.focus()
  }, [status, errors])

  useEffect(() => {
    if (status === "success") successRef.current?.focus()
  }, [status])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === "submitting") return // prevent double submission

    const { valid, errors: clientErrors } = validateQuote(values)
    if (!valid) {
      setErrors(clientErrors)
      setStatus("error")
      setServerError("")
      return
    }

    setStatus("submitting")
    setServerError("")
    setErrors({})

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, elapsedMs: Date.now() - startedAt.current }),
      })
      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (payload.errors) setErrors(payload.errors)
        setServerError(payload.error || "We could not submit your request. Please try again.")
        setStatus("error")
        return
      }

      setResult(payload)
      setStatus("success")
      onSuccess?.(payload)
    } catch {
      setServerError(
        "We could not reach our server. Check your connection and try again — your answers are still here."
      )
      setStatus("error")
    }
  }

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(result.reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* Clipboard unavailable — the reference is visible on screen regardless. */
    }
  }

  /* ── success ── */
  if (status === "success" && result) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-8 text-center focus:outline-none"
      >
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-500" aria-hidden="true" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          {result.duplicate ? "We already have your request" : "Quotation request received"}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 dark:text-slate-400">
          {result.duplicate
            ? "This enquiry was already submitted, so we have not created a duplicate. Our team will be in touch."
            : "Our team will review your requirements and get back to you with a written quotation."}{" "}
          Quote your reference number in any follow-up.
        </p>

        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 dark:border-slate-700 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-500">
            Reference
          </span>
          <span className="font-mono text-lg font-bold tracking-wider text-gray-900 dark:text-white">
            {result.reference}
          </span>
          <button
            type="button"
            onClick={copyReference}
            aria-label="Copy reference number"
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:hover:bg-slate-800"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-slate-500">
          Need to talk sooner?{" "}
          <a href={`tel:${CONTACT.phone}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
            {CONTACT.phoneDisplay}
          </a>{" "}
          ·{" "}
          <a href={`mailto:${CONTACT.email}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
            {CONTACT.email}
          </a>
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600 dark:border-slate-600 dark:text-slate-200"
          >
            Explore the interactive demo
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600 dark:border-slate-600 dark:text-slate-200"
          >
            Review packages
          </Link>
        </div>
      </div>
    )
  }

  const errorList = Object.entries(errors).filter(([, v]) => Boolean(v))

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Error summary — focus target so screen readers announce failures */}
      {(errorList.length > 0 || serverError) && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/[0.07] p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <p className="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {serverError || "Please correct the following before submitting"}
          </p>
          {errorList.length > 0 && (
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-sm text-red-600 dark:text-red-400">
              {errorList.map(([key, message]) => (
                <li key={key}>
                  <a href={`#${uid}-${key}`} className="underline underline-offset-2">
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Contact ── */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-base font-bold text-gray-900 dark:text-white">Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor={`${uid}-fullName`} error={errors.fullName} required>
            <input
              id={`${uid}-fullName`}
              name="fullName"
              type="text"
              autoComplete="name"
              value={values.fullName}
              onChange={set("fullName")}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? `${uid}-fullName-error` : undefined}
              className={cn(fieldBase, errors.fullName ? "border-red-500" : "border-gray-300 dark:border-slate-700")}
              placeholder="Ram Bahadur Thapa"
            />
          </Field>

          <Field label="Business name" htmlFor={`${uid}-businessName`} error={errors.businessName} required>
            <input
              id={`${uid}-businessName`}
              name="businessName"
              type="text"
              autoComplete="organization"
              value={values.businessName}
              onChange={set("businessName")}
              aria-invalid={Boolean(errors.businessName)}
              className={cn(fieldBase, errors.businessName ? "border-red-500" : "border-gray-300 dark:border-slate-700")}
              placeholder="Everest Restaurant"
            />
          </Field>

          <Field
            label="Phone number"
            htmlFor={`${uid}-phone`}
            error={errors.phone}
            hint="Nepal mobile or landline, e.g. 9801234567"
            required
          >
            <input
              id={`${uid}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={set("phone")}
              aria-invalid={Boolean(errors.phone)}
              className={cn(fieldBase, errors.phone ? "border-red-500" : "border-gray-300 dark:border-slate-700")}
              placeholder="9801234567"
            />
          </Field>

          <Field label="Email address" htmlFor={`${uid}-email`} error={errors.email} required>
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={set("email")}
              aria-invalid={Boolean(errors.email)}
              className={cn(fieldBase, errors.email ? "border-red-500" : "border-gray-300 dark:border-slate-700")}
              placeholder="you@business.com"
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Business ── */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-base font-bold text-gray-900 dark:text-white">About the business</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business type" htmlFor={`${uid}-businessType`} error={errors.businessType} required>
            <select
              id={`${uid}-businessType`}
              name="businessType"
              value={values.businessType}
              onChange={set("businessType")}
              aria-invalid={Boolean(errors.businessType)}
              className={cn(fieldBase, errors.businessType ? "border-red-500" : "border-gray-300 dark:border-slate-700")}
            >
              <option value="">Choose your business type…</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Business location" htmlFor={`${uid}-location`} error={errors.location} required>
            <input
              id={`${uid}-location`}
              name="location"
              type="text"
              value={values.location}
              onChange={set("location")}
              aria-invalid={Boolean(errors.location)}
              className={cn(fieldBase, errors.location ? "border-red-500" : "border-gray-300 dark:border-slate-700")}
              placeholder="Thamel, Kathmandu"
            />
          </Field>

          <Field label="Number of outlets" htmlFor={`${uid}-outlets`} error={errors.outlets}>
            <input
              id={`${uid}-outlets`}
              name="outlets"
              type="number"
              min="1"
              max="500"
              inputMode="numeric"
              value={values.outlets}
              onChange={set("outlets")}
              className={cn(fieldBase, errors.outlets ? "border-red-500" : "border-gray-300 dark:border-slate-700")}
            />
          </Field>

          <Field label="Number of users / staff accounts" htmlFor={`${uid}-users`} error={errors.users}>
            <input
              id={`${uid}-users`}
              name="users"
              type="number"
              min="1"
              max="1000"
              inputMode="numeric"
              value={values.users}
              onChange={set("users")}
              className={cn(fieldBase, errors.users ? "border-red-500" : "border-gray-300 dark:border-slate-700")}
            />
          </Field>

          {showTables && (
            <Field label="Number of tables" htmlFor={`${uid}-tableCount`} error={errors.tableCount}>
              <input
                id={`${uid}-tableCount`}
                type="number"
                min="0"
                max="1000"
                inputMode="numeric"
                value={values.tableCount}
                onChange={set("tableCount")}
                className={cn(fieldBase, "border-gray-300 dark:border-slate-700")}
                placeholder="e.g. 14"
              />
            </Field>
          )}

          {showRooms && (
            <Field label="Number of rooms" htmlFor={`${uid}-roomCount`} error={errors.roomCount}>
              <input
                id={`${uid}-roomCount`}
                type="number"
                min="0"
                max="2000"
                inputMode="numeric"
                value={values.roomCount}
                onChange={set("roomCount")}
                className={cn(fieldBase, "border-gray-300 dark:border-slate-700")}
                placeholder="e.g. 22"
              />
            </Field>
          )}

          {showProducts && (
            <Field
              label={values.businessType === "salon" ? "Number of services offered" : "Estimated product count"}
              htmlFor={`${uid}-productCount`}
              error={errors.productCount}
            >
              <input
                id={`${uid}-productCount`}
                type="number"
                min="0"
                max="100000"
                inputMode="numeric"
                value={values.productCount}
                onChange={set("productCount")}
                className={cn(fieldBase, "border-gray-300 dark:border-slate-700")}
                placeholder="e.g. 250"
              />
            </Field>
          )}

          <Field
            label="Current software, if any"
            htmlFor={`${uid}-currentSoftware`}
            hint="Helps us plan data migration"
          >
            <input
              id={`${uid}-currentSoftware`}
              type="text"
              value={values.currentSoftware}
              onChange={set("currentSoftware")}
              className={cn(fieldBase, "border-gray-300 dark:border-slate-700")}
              placeholder="Excel, another POS, or none"
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Requirements ── */}
      <fieldset className="space-y-5">
        <legend className="mb-1 text-base font-bold text-gray-900 dark:text-white">What you need</legend>

        <Field label="Package you are considering" htmlFor={`${uid}-selectedPackage`} error={errors.selectedPackage}>
          <select
            id={`${uid}-selectedPackage`}
            value={values.selectedPackage}
            onChange={set("selectedPackage")}
            className={cn(fieldBase, "border-gray-300 dark:border-slate-700")}
          >
            {PACKAGE_OPTIONS.map((p) => (
              <option key={p.value || "none"} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>

        <CheckGroup
          legend="Required modules"
          options={MODULES}
          selected={values.modules}
          onToggle={toggleIn("modules")}
          name={`${uid}-modules`}
        />

        <fieldset>
          <legend className="mb-2.5 text-sm font-semibold text-gray-800 dark:text-slate-200">
            Additional requirements
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <Toggle
              id={`${uid}-migration`}
              label="Data migration"
              description="Import existing products, customers or balances"
              checked={values.needsDataMigration}
              onChange={(v) => setValues((s) => ({ ...s, needsDataMigration: v }))}
            />
            <Toggle
              id={`${uid}-website`}
              label="Build my website"
              description="Included with every package — tick if you need one built"
              checked={values.needsWebsite}
              onChange={(v) => setValues((s) => ({ ...s, needsWebsite: v }))}
            />
            <Toggle
              id={`${uid}-ordering`}
              label={values.businessType === "retail" ? "Online store (e-commerce)" : "Online & WhatsApp ordering"}
              description={
                values.businessType === "retail"
                  ? "A separate e-commerce build, quoted on top of your package"
                  : "Included from the Standard packages upward"
              }
              checked={values.needsOnlineOrdering}
              onChange={(v) => setValues((s) => ({ ...s, needsOnlineOrdering: v }))}
            />
            <Toggle
              id={`${uid}-payments`}
              label="Payment gateway integration"
              description="Fonepay, eSewa or Khalti — quotation only"
              checked={values.needsPaymentIntegration}
              onChange={(v) => setValues((s) => ({ ...s, needsPaymentIntegration: v }))}
            />
            <Toggle
              id={`${uid}-ird`}
              label="IRD / CBMS integration"
              description="Subject to verification and approval"
              checked={values.needsIrdIntegration}
              onChange={(v) => setValues((s) => ({ ...s, needsIrdIntegration: v }))}
            />
          </div>
        </fieldset>

        <CheckGroup
          legend="Hardware you need from us"
          options={HARDWARE}
          selected={values.hardware}
          onToggle={toggleIn("hardware")}
          name={`${uid}-hardware`}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred installation date" htmlFor={`${uid}-installDate`} error={errors.installDate}>
            <input
              id={`${uid}-installDate`}
              type="date"
              value={values.installDate}
              onChange={set("installDate")}
              className={cn(fieldBase, "border-gray-300 dark:border-slate-700")}
            />
          </Field>

          <Field label="Preferred contact method" htmlFor={`${uid}-contactMethod`} error={errors.contactMethod}>
            <select
              id={`${uid}-contactMethod`}
              value={values.contactMethod}
              onChange={set("contactMethod")}
              className={cn(fieldBase, "border-gray-300 dark:border-slate-700")}
            >
              {CONTACT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Anything else we should know"
          htmlFor={`${uid}-additionalRequirements`}
          error={errors.additionalRequirements}
          hint="Workflow details, reporting needs, existing hardware, timelines"
        >
          <textarea
            id={`${uid}-additionalRequirements`}
            rows={4}
            maxLength={2000}
            value={values.additionalRequirements}
            onChange={set("additionalRequirements")}
            className={cn(fieldBase, "resize-y border-gray-300 dark:border-slate-700")}
            placeholder="We run two shifts and need separate cash reconciliation for each…"
          />
        </Field>
      </fieldset>

      {/* ── Estimate ── */}
      {estimate && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.06] p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Indicative estimate</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {estimate.lines.map((line, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <span className="text-gray-700 dark:text-slate-300">{line.label}</span>
                <span className="shrink-0 font-medium tabular-nums text-gray-900 dark:text-white">
                  {line.quoteOnly
                    ? "Quotation"
                    : !line.oneTime && !line.monthly
                      ? "Included"
                      : `${npr(line.oneTime)}${line.monthly ? ` + ${npr(line.monthly)}/mo` : ""}`}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-3 border-t border-orange-500/20 pt-2 font-bold">
              <span className="text-gray-900 dark:text-white">Estimated total</span>
              <span className="tabular-nums text-orange-700 dark:text-orange-400">
                {npr(estimate.oneTime)} one-time + {npr(estimate.monthly)}/month
              </span>
            </li>
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-slate-400">
            This is a non-binding estimate based on your selections. It excludes 13% VAT and hardware.
            {estimate.hasQuoteOnly && " Items marked “Quotation” are priced only after a requirements review."}{" "}
            The final quotation depends on your actual implementation requirements.
          </p>
        </div>
      )}

      {/* Honeypot — visually and programmatically hidden from real users */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-company_website`}>Company website (leave blank)</label>
        <input
          id={`${uid}-company_website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company_website}
          onChange={set("company_website")}
        />
      </div>

      {/* ── Consent + submit ── */}
      <div className="space-y-4 border-t border-gray-200 pt-6 dark:border-slate-800">
        <div>
          <label
            htmlFor={`${uid}-consent`}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
              errors.consent ? "border-red-500 bg-red-500/[0.05]" : "border-gray-300 dark:border-slate-700"
            )}
          >
            <input
              type="checkbox"
              id={`${uid}-consent`}
              checked={values.consent}
              onChange={set("consent")}
              aria-invalid={Boolean(errors.consent)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500 dark:border-slate-600"
            />
            <span className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
              I agree that AADHAR may contact me about this request and store these details for that
              purpose, as described in the{" "}
              <Link href="/privacy" className="font-semibold text-orange-600 underline-offset-2 hover:underline dark:text-orange-400">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.consent && (
            <p id={`${uid}-consent-error`} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.consent}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            "Request My Quotation"
          )}
        </button>

        <p className="text-xs leading-relaxed text-gray-500 dark:text-slate-500">
          {EVALUATION.days}-day no-obligation evaluation · No credit card required. Prefer to talk? Call{" "}
          <a href={`tel:${CONTACT.phone}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
            {CONTACT.phoneDisplay}
          </a>
          .
        </p>
      </div>
    </form>
  )
}
