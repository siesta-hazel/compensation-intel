# Phase 1: Research – Compensation Intelligence Systems

## 1. Overview
This research analyzes four platforms that provide salary information:  
**Levels.fyi** (primary reference), **6figr**, **AmbitionBox**, and **Glassdoor**.  
The goal is to identify what makes a **compensation intelligence system** different from a raw salary listing site, and to map features for our own build.

---

## 2. Platform Analysis

### 2.1 Levels.fyi
- **What works**  
  - **Level standardization** (L3–L8) across companies – the core reason it succeeds.  
  - Clean UX for comparing levels, not just titles.  
  - Company pages show salary bands, median, and distribution per level.  
  - Side‑by‑side comparison of two offers (base, bonus, stock, total).  
  - Crowdsourced but with verification (confidence score).  
  - Data can be filtered by location, years of experience.  

- **What fails**  
  - Limited data for India (more US‑centric).  
  - No bulk upload for companies (only individual submissions).  
  - Some level mappings are inconsistent across companies (e.g., L4 at Google vs L4 at Amazon).  

- **Key difference**  
  Levels are the primary entity, not job titles.  

- **Gap we can fill**  
  - India‑first focus with regions (Bangalore, Hyderabad, etc.)  
  - Simpler submission flow with both form and JSON.

### 2.2 6figr
- **What works**  
  - India‑specific salary data, good coverage of local companies.  
  - Experience‑based filter.  
  - Provides percentiles (10th, 50th, 90th).  

- **What fails**  
  - **No level standardization** – uses experience bands and titles, which vary across companies.  
  - Comparison is weak – only shows title/experience, not true level parity.  
  - UI feels cluttered and marketing‑heavy.  

- **Key difference**  
  Focus on experience years rather than levels → leads to misleading comparisons.  

- **Gap**  
  Missing level‑based intelligence → we will implement levels as primary.

### 2.3 AmbitionBox
- **What works**  
  - Large volume of salary reports (crowdsourced).  
  - Company reviews and ratings.  

- **What fails**  
  - **No levels** – aggregates by title only (e.g., “Software Engineer” includes all seniorities).  
  - Medians are misleading because L3 and L5 get mixed.  
  - No comparison tool between companies.  
  - UI is ad‑heavy, slow.  

- **Key difference**  
  A salary listing and review site, not intelligence.

- **Gap**  
  Cannot answer “What does an L4 at Google earn?” – we will.

### 2.4 Glassdoor
- **What works**  
  - Huge dataset, widely known.  
  - Filter by location, job title.  

- **What fails**  
  - Same title inflation problem as AmbitionBox.  
  - No level granularity.  
  - Comparison is non‑existent.  
  - Requires login for detailed data.

- **Key difference**  
  More of a job portal and employer review site.

- **Gap**  
  Requires authentication and still lacks structured level comparison.

---

## 3. Feature Mapping Sheet

| Feature                                      | Levels.fyi | 6figr | AmbitionBox | Glassdoor | Build? (our system) |
|----------------------------------------------|------------|-------|-------------|-----------|----------------------|
| Level‑based salary storage (L3/L4/L5)        | ✅         | ❌    | ❌          | ❌        | **YES**              |
| Company page with salary list                | ✅         | ✅    | ✅          | ✅        | **YES**              |
| Median compensation per company              | ✅         | ✅    | ❌          | ❌        | **YES**              |
| Level distribution (how many L3, L4, etc.)   | ✅         | ❌    | ❌          | ❌        | **YES**              |
| Compare two salaries (base, bonus, stock, level diff) | ✅  | ❌    | ❌          | ❌        | **YES**              |
| Salary table with filters (company, role, level, location) | ✅ | ✅ | ✅ | ✅ | **YES** |
| User authentication                          | ✅         | ✅    | ❌          | ✅        | **NO** (spec forbids) |
| Reviews / ratings                            | ❌         | ❌    | ✅          | ✅        | **NO** (spec forbids) |
| CSV import                                   | ❌         | ❌    | ❌          | ❌        | **OPTIONAL** (not required) |
| Confidence score on submissions              | ✅         | ❌    | ❌          | ❌        | **YES** (optional) |
| Normalize company names (case, spaces)       | ✅         | ❌    | ❌          | ❌        | **YES**              |
| Reject invalid data (strict validation)      | ✅         | ❌    | ❌          | ❌        | **YES**              |

---

## 4. Gaps in Existing Platforms (What Our System Improves)

| Gap                                                | Our Solution                                                             |
|----------------------------------------------------|--------------------------------------------------------------------------|
| No level standardization (6figr, AmbitionBox, Glassdoor) | Enforce level field; normalise user input to L3/L4/L5 etc.           |
| No median compensation per company (AmbitionBox, Glassdoor) | `/company/:company` API returns median total compensation.         |
| No level distribution (most platforms)             | Show how many L3, L4, L5 records per company.                           |
| Comparison limited to titles (6figr, etc.)         | Compare two specific salaries side‑by‑side, including level difference. |
| Messy or missing location filters                  | Full location filter and partial match search.                          |
| Weak validation (accepts bad data)                 | Strict validation on `/ingest-salary`: missing fields → reject; default bonus/stock to 0. |
| No company name normalisation                      | Lowercase, trim, remove special chars → e.g., "Google", " google " → "google". |

---

## 5. How Our System Follows the Core Principle

**Structured → Comparable → Decision‑ready**

- **Structured**: Every salary record has a standardised level, normalised company, and computed total compensation.  
- **Comparable**: Median, level distribution, and two‑salary comparison allow apples‑to‑apples evaluation.  
- **Decision‑ready**: Users can answer “Should I accept L4 at Google or L4 at Microsoft?” based on real data.

---

## 6. Creative Freedom (10–20% improvements over reference platforms)

- **Improved filtering UX** – partial search on all fields (company, role, level, location).  
- **Simplified flow** – company quick search from navbar; direct company lookup without extra clicks.  
- **Clean UI** – no ads, no marketing clutter, fast Tailwind design.  
- **Dual submission** – both form and JSON paste for adding salaries.

---

## 7. Conclusion

Research confirms that successful compensation intelligence requires **levels as the key entity**, **structured data**, and **decision‑ready outputs**. Our system implements these principles while avoiding the pitfalls of raw salary listing sites. All mandatory features are built; no prohibited features (auth, reviews, chat) are present.