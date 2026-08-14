/**
 * Convenience barrel for website content configuration.
 *
 * Importing any individual module directly is equally fine and is what most
 * components do. Schema validation lives in `./packages`, which every consumer
 * of pricing data imports, so the guard runs whether or not this barrel is used.
 */
export * from "./site"
export * from "./types"
export * from "./packages"
export * from "./industries"
export * from "./clients"
export * from "./features"
export * from "./faqs"
export * from "./process"
export * from "./format"
