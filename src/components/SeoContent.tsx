import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, BookOpen, Share2, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does the live word and character counter work?',
    answer:
      'The counter processes your text instantly directly inside your web browser. As you type, paste, or delete text, client-side algorithms calculate words, characters with spaces, characters without spaces, sentences, paragraphs, and reading duration in real time without transmitting data over the internet.',
  },
  {
    question: 'Is my text private and secure?',
    answer:
      'Yes, 100%. All processing is strictly local to your browser. Your text is never sent over any network, never stored on remote servers, and never collected or tracked.',
  },
  {
    question: 'What is the difference between characters with spaces and without spaces?',
    answer:
      'Characters with spaces includes letters, numbers, punctuation marks, and whitespace (spaces, tabs, line breaks). Characters without spaces counts only visible symbols and glyphs, excluding whitespace. Many academic papers, translations, and publication limits require character counts without spaces.',
  },
  {
    question: 'What is Vocabulary Diversity and how is it calculated?',
    answer:
      'Vocabulary Diversity (Type-Token Ratio) measures the lexical richness of your writing using the formula: (Unique Words ÷ Total Words) × 100. A higher percentage indicates rich, varied word choice, while a lower percentage indicates word repetition.',
  },
  {
    question: 'Does this counter support languages other than English?',
    answer:
      'Yes. WordCounterPro provides universal multilingual support across all major world writing systems—including Bangla, Hindi, Arabic, Spanish, French, Cyrillic, Chinese, and Japanese. It intelligently handles language-specific sentence markers (such as Bengali/Hindi Dari "।", Arabic "؟", and CJK "。") and accurately parses unspaced Asian scripts.',
  },
  {
    question: 'How are emojis and accented characters counted?',
    answer:
      'Emojis and accented letters are counted using native grapheme cluster segmentation. Multi-codepoint emojis (such as 👨‍👩‍👧‍👦, flags 🇺🇸, and skin-tone modifiers 👍🏽) count accurately as 1 visual character, ensuring exact compliance with character limits on social platforms.',
  },
  {
    question: 'How are reading time and speaking time calculated?',
    answer:
      'Reading time is based on the average adult silent reading rate of 225 words per minute (WPM). Speaking time is based on standard conversational oral presentation speed of 130 words per minute.',
  },
  {
    question: 'How does sentence counting handle abbreviations and decimals?',
    answer:
      'Our parsing algorithm protects abbreviations (such as Dr., Mr., vs., e.g., i.e.) and decimal numbers (such as 3.14) so they are preserved without creating false sentence boundaries.',
  },
];

const PLATFORM_LIMITS = [
  { platform: 'X / Twitter', limit: '280 characters', note: 'Standard tweet limit' },
  { platform: 'Threads', limit: '500 characters', note: 'Single post length' },
  { platform: 'LinkedIn Post', limit: '3,000 characters', note: 'Optimal: 150-300 words' },
  { platform: 'Instagram Caption', limit: '2,200 characters', note: 'Truncated in feed after 125 chars' },
  { platform: 'SEO Title Tag', limit: '50 – 60 characters', note: 'Prevents Google SERP truncation' },
  { platform: 'SEO Meta Description', limit: '150 – 160 characters', note: 'Optimal search snippet length' },
  { platform: 'Google Ads Headline', limit: '30 characters', note: 'Responsive search ads' },
  { platform: 'TikTok Description', limit: '2,200 characters', note: 'Expanded caption limit' },
];

export const SeoContent: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="mt-14 border-t border-slate-300 dark:border-slate-800 pt-10 text-slate-800 dark:text-slate-200">
      {/* Informational Intro */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mb-4 tracking-tight">
          Why Use WordCounterPro?
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
          Whether you are writing an academic essay, drafting a novel chapter, composing social media posts,
          or optimizing SEO meta tags, tracking your word and character count is critical. WordCounterPro provides
          instant, accurate, and completely private text statistics without distracting ads or lag.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-950 dark:text-white mb-1.5">Live Core &amp; Vocab Metrics</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Real-time calculation of words, characters (with/without spaces), sentences, paragraphs, reading/speaking time, unique words, and vocabulary diversity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-950 dark:text-white mb-1.5">100% Private &amp; Offline</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Zero network upload. All processing runs directly in your browser so confidential notes and drafts never leave your device.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-3">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-950 dark:text-white mb-1.5">Target Limit Allowance</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Track word or character targets with a fuel-gauge progress bar that reduces as text is added, alerting you in emerald, amber, and rose-red.
            </p>
          </div>
        </div>
      </div>

      {/* Social Media Character Limits Reference Table */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mb-3">
          Popular Social Media & SEO Character Limits
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Quick reference for common character constraints across platforms:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-xs uppercase font-bold text-slate-900 dark:text-slate-100">
              <tr>
                <th className="px-4 py-3.5">Platform</th>
                <th className="px-4 py-3.5">Character Limit</th>
                <th className="px-4 py-3.5">Best Practice / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {PLATFORM_LIMITS.map((item) => (
                <tr key={item.platform} className="hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-950 dark:text-white">{item.platform}</td>
                  <td className="px-4 py-3 font-bold text-brand-700 dark:text-brand-300">{item.limit}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) with Schema Alignment */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <div
              key={faq.question}
              className="border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="font-bold text-slate-950 dark:text-white text-sm sm:text-base">
                  {faq.question}
                </span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-700 dark:text-slate-200 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-700 dark:text-slate-200 shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-4 pt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
