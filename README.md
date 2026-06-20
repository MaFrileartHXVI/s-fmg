# Spatial-Based Fleet Manifest Generator (S-FMG)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat&logo=supabase)](https://supabase.com/)

S-FMG is a specialized, interactive spatial synthetic data generator designed to support route optimization research for
last-mile delivery segments. It is specifically tailored to model datasets for the **Multi-Trip Capacitated Vehicle
Routing Problem with Time Windows (MT-CVRPTW)** using real-world spatial coordinate points mapped from the Telaga Murni
residential area (Blok A to Blok E).

The application enables researchers to map coordinates interactively using a digital map viewport, persist them into a
spatial database engine, and generate daily manifest variations. These variations can be exported into a flat
spreadsheet structure to serve as raw mathematical inputs for algorithmic benchmarking engines (*Greedy Nearest
Neighbor* vs. *Genetic Algorithm*).

---

## 📌 Problem Constraints & Computational Parameters

The simulation model enforces the following fixed operational constraints:

* **Fleet:** 1 single motorcycle unit (1 courier).
* **Capacity:** Maximum of 40 package units per trip (rit).
* **Time Windows:** Operational hours start at 08:00 WIB with a hard deadline for consumer delivery at 17:00 WIB.
* **Service Time:** A constant duration of 3 minutes per household visit.
* **Turnaround Time (Depot Wait Time):** A constant 5-minute delay at the depot for re-loading packages whenever the
  courier switches trips (assuming the next trip's packages are pre-sorted).

---

## 🛠️ Tech Stack Architecture

The system utilizes a modern, tightly integrated, single-ecosystem stack to maximize rendering performance and ensure
frictionless data handling:

* **Core Framework:** Next.js v16 (App Router) & React v19.
* **UI Components & Styling:** Tailwind CSS v4 & shadcn/ui (Tabs, Table, Form).
* **Interactive Map Engine:** React-Leaflet & OpenStreetMap (OSM) Basemap Tiles.
* **Spatial Backend & Database:** Supabase (PostgreSQL powered by the PostGIS Extension).
* **Data Exporter:** XLSX (SheetJS) for lightning-fast, client-side spreadsheet compilation.

---

## 📜 License & Citation

This project is licensed under the **MIT License**. This codebase and its real-world spatial dataset structure are
open-access. You are free to modify, distribute, and cite this system to advance future cyber-physical routing
optimization research.