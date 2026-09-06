# WordCounterPro

A fast, clean, and private online word and character counter. No ads, no tracking, no bloat.

👉 **[Use it live](https://imranpollob.github.io/word-character-counter/)**

---

## Why this exists

Most online word counters are crammed with banner ads, slow scripts, or break when you paste non-English text and emojis. 

WordCounterPro was built to do one thing well: give you instant, accurate stats on your writing with a clean, distraction-free interface.

### What it does:
- **Instant Core Counts**: Words, characters (with and without spaces), sentences, paragraphs, and lines as you type.
- **Vocabulary Insights**: Tracks unique words, vocabulary diversity (Type-Token Ratio), average word/sentence length, and your longest words.
- **Truly Multilingual**: Full support for any language — English, বাংলা (Bangla), हिन्दी (Hindi), العربية (Arabic), Español, Français, 中文 (Chinese), 日本語 (Japanese), and more. Handles native punctuation like Dari (`।`) and unspaced scripts automatically.
- **Emoji-Accurate**: Uses native grapheme segmentation so emojis (like 👨‍👩‍👧‍👦, 👍🏽, or 🇺🇸) count as 1 character, not 4 or 11.
- **Reading & Speaking Pace**: Estimates silent reading (225 WPM) and speaking presentation time (130 WPM), with interactive `?` tooltips showing how they're calculated.
- **Target Limit Tracker**: Set a target word or character goal. A depletion bar counts down your allowance in emerald, amber, and red.
- **100% Private**: Everything runs locally in your browser. Nothing you write ever touches a server.
- **Dark & Light Mode**: Clean, high-contrast design that respects your system preferences.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Tooling**: Vite + Vitest
- **Deployment**: GitHub Pages (via GitHub Actions)

---

## Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/imranpollob/word-character-counter.git
   cd word-character-counter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```

4. **Run unit tests**:
   ```bash
   npm test
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## License

MIT — feel free to use and modify for personal or commercial projects.
