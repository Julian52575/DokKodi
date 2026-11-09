# DokKodi — Brand Guidelines

> A **Cinematic Dark Mode** experience: a minimalist, immersive interface designed to showcase movie posters and album covers without straining the eyes in a dark room.

## 1. Brand Identity

- **Brand name:** DokKodi
- **Visual concept:** a dark, minimalist, and immersive interface.
- **Look and feel:** subtly rounded elements and depth effects make the selected (*focused*) item immediately recognizable, even from 3 metres away.

## 2. Color Palette

The original guidelines specify a minimum contrast ratio of **4.5:1 for body text**.

| Role | Preview | Name | Hex Code | Usage |
|---|:---:|---|---|---|
| Primary background | <span style="display:inline-block;width:3em;height:1.4em;background:#0F1117;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Deep black / Night | `#0F1117` | Main background, suitable for OLED/LCD screens and use in a dark room. |
| Secondary background | <span style="display:inline-block;width:3em;height:1.4em;background:#1E222D;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Anthracite gray | `#1E222D` | Cards, containers, sidebars, and modals. |
| Accent color | <span style="display:inline-block;width:3em;height:1.4em;background:#3B82F6;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Electric blue | `#3B82F6` | Links, progress indicators, and status badges. |
| Focus color | <span style="display:inline-block;width:3em;height:1.4em;background:#F59E0B;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Bright amber | `#F59E0B` | Active selection, outline, or highly visible highlight. |
| Primary text | <span style="display:inline-block;width:3em;height:1.4em;background:#FFFFFF;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Pure white | `#FFFFFF` | Headings and interface text. |
| Secondary text | <span style="display:inline-block;width:3em;height:1.4em;background:#9CA3AF;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Light gray | `#9CA3AF` | Metadata: runtime, year, cast, and genres. |
| Error / alert | <span style="display:inline-block;width:3em;height:1.4em;background:#EF4444;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Coral red | `#EF4444` | Deletions, error messages, and restrictions (child profile). |

**Accessibility — High-contrast mode**

| Role | Preview | Hex Code | Usage |
|---|:---:|---|---|
| High-contrast background | <span style="display:inline-block;width:3em;height:1.4em;background:#000000;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | `#000000` | Replaces the background with pure black. |
| High-contrast focus | <span style="display:inline-block;width:3em;height:1.4em;background:#FFFF00;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | `#FFFF00` | Bright yellow focus outlines. |

> **Accessibility note:** information must never be conveyed through color alone.

## 3. Typography

The guidelines recommend a modern sans-serif typeface that is easy to read on large screens: **Inter** or **SF Pro Display**.

### Typeface Previews

> The previews below use whichever fonts are available in the viewing environment. To see the exact rendering of Inter or SF Pro Display, the font must be installed or loaded by the software displaying this Markdown file.

**Inter — recommended typeface**

<div style="font-family:Inter, sans-serif">
  <div style="font-size:2em;font-weight:700">DokKodi — Bold headings</div>
  <div style="font-size:1.5em;font-weight:600">Continue Watching — Semi-Bold</div>
  <div style="font-size:1.2em;font-weight:500">Recently Added — Medium</div>
  <div style="font-size:1em;font-weight:400;line-height:1.5">Discover your movies, TV shows, albums, and podcasts in an immersive interface.</div>
</div>

**SF Pro Display — recommended alternative**

<div style="font-family:'SF Pro Display', sans-serif">
  <div style="font-size:2em;font-weight:700">DokKodi — Bold headings</div>
  <div style="font-size:1.5em;font-weight:600">Continue Watching — Semi-Bold</div>
  <div style="font-size:1.2em;font-weight:500">Recently Added — Medium</div>
  <div style="font-size:1em;font-weight:400;line-height:1.5">Discover your movies, TV shows, albums, and podcasts in an immersive interface.</div>
</div>

### TV Typography Scale (1080p / 4K)

| Element | Size | Weight | Example / usage |
|---|---:|---|---|
| Main heading (H1) | 48 px | Bold (700) | Movie or TV show title on the details page. |
| Section heading (H2) | 32 px | Semi-Bold (600) | “Continue Watching”, “Recently Added”. |
| Card heading (H3) | 24 px | Medium (500) | Media title in grids. |
| Body text / summary | 20 px | Regular (400) | Minimum line height of 1.5. |
| Captions / metadata | 16 px | Medium (500) | Year, genre, runtime. |

## 4. UI/UX — Focus System and “10-Foot” Interface

The entire interface can be navigated using keyboard arrow keys or a remote control.

### Media Card (Poster / Movie)

- **Default state:** transparent border and 90% opacity.
- **Focused (selected) state:**
  - Outer border: `3px solid #F59E0B` (amber).
  - Scaling: `transform: scale(1.08)`, with a smooth animation that can be disabled in accessibility settings.
  - Drop shadow: `box-shadow: 0 10px 25px rgba(0,0,0,0.8)`.

### Action Buttons (Play, Resume, Options)

- Rounded corners: `border-radius: 12px`.
- Selected state: bright background (`#3B82F6` or `#F59E0B`) with black text for maximum contrast.

### Video Player (OSD — On-Screen Display)

- Minimal interface that disappears after 3 seconds of inactivity.
- Progress bar 8 px high.
- Subtitle size and backgrounds can be customized in settings.

## 5. Home Screen Layout

### Main Area

- **“Featured / In Progress” banner:** occupies the upper third of the screen and lets users resume the last-played media directly, with its progress bar.
- **Horizontal carousels:** horizontally scrolling lists for recently added content, popular TV shows, and recent podcasts.

## 6. Built-in Accessibility (WCAG 2.2 AA)

- **High-contrast mode:** setting to use a pure black background (`#000000`) and bright yellow focus outlines (`#FFFF00`).
- **Animations:** global option to disable zoom effects and focus transitions.
- **Dynamic text size:** option to increase the overall text size by **+20%** or **+40%**.
