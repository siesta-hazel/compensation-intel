# Compensation Intelligence System

> **Track C** – Production-grade compensation insights platform inspired by Levels.fyi  
> Built for the Full Stack Developer Internship Demo Task

## 🎯 Overview

A **levels-based compensation intelligence system** that helps users compare software engineer salaries across companies using standardized levels (L3, L4, L5). Unlike raw salary listing sites, this system provides structured, comparable, and decision-ready insights.

**Live Demo:** [[https://your-vercel-url.vercel.app](https://compensation-system-black.vercel.app/)](https://your-vercel-url.vercel.app)  
**Research Document:** [RESEARCH.md](./RESEARCH.md)

---

## ✨ Key Features

- **Level‑first approach** – Compensation tied to standardised levels (L3/L4/L5)
- **Salary table** – Filter by company, role, level, location; sortable columns; pagination (20 rows/page)
- **Company page** – Median compensation, level distribution, average compensation bar chart
- **Compare tool** – Side‑by‑side comparison of two salaries (base, bonus, stock, total, level difference)
- **Add salary** – User‑friendly form + JSON paste (strict validation, normalisation)
- **Dynamic home stats** – Real count of tracked companies and levels present
- **Responsive design** – Tailwind CSS, mobile‑ready

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 14 (App Router), React, Tailwind CSS |
| Backend API | Next.js API routes (Node.js)        |
| Database    | PostgreSQL + Prisma ORM             |
| Charts      | Chart.js + react-chartjs-2          |
| Deployment  | Vercel + Neon (or any PostgreSQL)   |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud – [Neon](https://neon.tech) recommended)

### 1. Clone the repository
```bash
git clone https://github.com/siesta-hazel/compensation-intel.git
cd compensation-intel
