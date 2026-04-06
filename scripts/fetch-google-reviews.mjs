#!/usr/bin/env node
/**
 * Fetches up to 5 recent review snippets via Google Places API (Place Details).
 * Requires: GOOGLE_MAPS_API_KEY with Places API enabled.
 *
 *   GOOGLE_MAPS_API_KEY=your_key npm run fetch-reviews
 *
 * Writes: js/reviews-data.json (preserves disclaimers; updates aggregate + reviews).
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "js", "reviews-data.json");

const KEY = process.env.GOOGLE_MAPS_API_KEY;
const SEARCH_QUERY =
  process.env.PLACES_SEARCH_QUERY ||
  "Pankaj Electronics Shop 36 Itwara Road Sarafa Chowk Bhopal 462001 India";

const baseDisclaimers = {
  disclaimerEn: "Reviews aren't verified by Google.",
  disclaimerHi: "समीक्षाएँ Google द्वारा सत्यापित नहीं हैं।",
  attributionEn:
    "Summaries shown when available are from Google Maps and may be abbreviated. See Google for full text and policies.",
};

function loadExisting() {
  try {
    const raw = readFileSync(outPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return { ...baseDisclaimers, businessName: "Pankaj Electronics", reviews: [] };
  }
}

async function findPlaceId() {
  const params = new URLSearchParams({
    input: SEARCH_QUERY,
    inputtype: "textquery",
    fields: "place_id,name",
    key: KEY,
  });
  const url =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?" +
    params.toString();
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" || !data.candidates?.[0]?.place_id) {
    throw new Error(
      "FindPlace failed: " + (data.status || res.status) + " " + JSON.stringify(data)
    );
  }
  return data.candidates[0].place_id;
}

async function placeDetails(placeId) {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: "name,rating,user_ratings_total,reviews,url",
    key: KEY,
  });
  const url =
    "https://maps.googleapis.com/maps/api/place/details/json?" + params.toString();
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" || !data.result) {
    throw new Error(
      "PlaceDetails failed: " + (data.status || res.status) + " " + JSON.stringify(data)
    );
  }
  return data.result;
}

async function main() {
  if (!KEY) {
    console.error("Set GOOGLE_MAPS_API_KEY (Places API enabled).");
    process.exit(1);
  }

  const existing = loadExisting();
  const placeId = await findPlaceId();
  const result = await placeDetails(placeId);

  const mapsUrl =
    result.url ||
    "https://www.google.com/maps/search/?api=1&query=place_id:" + placeId;

  const reviews = (result.reviews || []).map((r) => ({
    author: r.author_name,
    rating: r.rating,
    text: r.text || "",
    relativeTime: r.relative_time_description || "",
  }));

  const out = {
    businessName: result.name || existing.businessName || "Pankaj Electronics",
    googleMapsUrl: mapsUrl,
    aggregateRating: {
      ratingValue: result.rating ?? existing.aggregateRating?.ratingValue ?? 4.6,
      reviewCount:
        result.user_ratings_total ?? existing.aggregateRating?.reviewCount ?? 267,
    },
    ...baseDisclaimers,
    fetchedAt: new Date().toISOString(),
    placeId,
    reviews,
  };

  writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log("Wrote", outPath);
  console.log("Rating:", out.aggregateRating.ratingValue, "Reviews:", out.aggregateRating.reviewCount);
  console.log("Snippets stored:", reviews.length);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
