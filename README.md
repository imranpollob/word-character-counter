# WordCounterPro — Online Word & Character Counter

> A high-performance, real-time, privacy-first online word and character counter with reading time, speaking time, custom limit tracking, and SEO optimization. Designed for seamless deployment on **GitHub Pages**.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React 19](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)
![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)
![100% Private](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald.svg)

---

## ✨ Features (Phases 1 & 2 MVP)

- ⚡ **Live Real-Time Counting**:
  - **Words**: Intelligent whitespace & token parsing
  - **Characters (with spaces)**: Total keystrokes & glyphs
  - **Characters (without spaces)**: Keystrokes excluding whitespace
  - **Sentences**: Smart boundary detection ignoring abbreviations (*Dr.*, *Mr.*, *vs.*) and decimals (*3.14*)
  - **Paragraphs & Lines**: Dynamic block tracking
- ⏱️ **Reading & Speaking Time**:
  - **Reading speed**: Standard 225 WPM (Words Per Minute)
  - **Speaking speed**: Standard 130 WPM
- 🎯 **Custom Limits & Progress Bar**:
  - Word or Character limit targets
  - Visual status progress bar with threshold color transitions (Normal → Amber Warning at 80% → Red Alert at 100%+)
  - Dynamic Remaining / Exceeded badge
  - Quick-preset shortcuts (X/Twitter 280, Threads 500, Instagram 2,200, LinkedIn 3,000, SEO tags, Essays)
- 🔒 **100% Privacy Guarantee**:
  - All text is processed entirely inside your browser via client-side JavaScript.
  - Zero server transmission, zero third-party telemetry, zero external tracking.
- 💾 **Local Autosave**:
  - Automatic debounced persistence to `localStorage`. Your draft restores seamlessly upon reload.
  - Clear with quick **Undo** recovery to prevent accidental data loss.
- 🌓 **Modern Responsive UI & Theming**:
  - Dark Mode, Light Mode, and System Preference synchronization.
  - Fluid mobile-friendly layout and distraction-free typography.

---

## 🔍 SEO & Search Engine Dominance

WordCounterPro is built from the ground up for organic search visibility:
- **Schema.org Structured Data**:
  - `WebApplication` JSON-LD schema declaring a free, browser-based utility tool.
  - `FAQPage` JSON-LD schema for rich expandable FAQ search snippets on Google.
- **Full Meta & Open Graph Coverage**:
  - High-intent search title and meta description.
  - Social media cards for X/Twitter, LinkedIn, Facebook, and Discord previews.
- **Semantic Crawler Markup**:
  - Informative guides, platform limit tables, and FAQs in pre-rendered semantic HTML.
- **Search Engine Discovery**:
  - Automated `robots.txt` and `sitemap.xml` generated directly in the distribution build.

---

## 🚀 Deploying to GitHub Pages (`github.io`)

This project is configured out-of-the-box for GitHub Pages:

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit of WordCounterPro"
   git branch -M main
   git remote add origin https://github.com/imranpollob/word-character-counter.git
   git push -u origin main
   ```

2. **Enable GitHub Pages in your Repository Settings**:
   - Go to your repository on GitHub: `Settings` → `Pages`.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
   - The included `.github/workflows/deploy.yml` will automatically build and deploy the application on every push to `main`!

3. **Visit your live URL**:
   ```
   https://imranpollob.github.io/word-character-counter/
   ```

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ (tested on v22)
- npm 9+

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Run Unit Tests (Vitest)
```bash
npm test
```

### Build for Production
```bash
npm run build
```

---

## 🗺️ Roadmap Ahead

- **Phase 3 (Text Analysis)**: Unique words, vocabulary diversity (TTR), average word/sentence length, longest word/sentence, keyword frequency and density tables, 1/2/3-word n-gram phrases.
- **Phase 4 (Writing Quality + Accuracy)**: Flesch Reading Ease score, Flesch-Kincaid Grade Level, long-sentence diagnostics, Unicode-aware grapheme/emoji counting via `Intl.Segmenter`, multilingual word segmentation (CJK).
- **Phase 5 (Advanced Tools)**: Text case conversion, whitespace cleanup, find & replace, `.docx` / `.md` / `.txt` file import and export.

---

## 📄 License

MIT License — free for personal and commercial use.

