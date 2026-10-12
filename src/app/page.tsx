"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  AudioLines,
  BookOpen,
  CheckCircle2,
  Compass,
  GitCompare,
  Layers,
  Mic,
  Moon,
  Play,
  Sparkles,
  Sun,
  Target,
  Volume2,
} from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import { Button } from "@/components/ui/button";

interface SpecimenItem {
  id: string;
  badge: string;
  title: string;
  ipaSymbol: string;
  sentence: string;
  ipaTranscription: string;
  highlightedWords: { word: string; ipa: string; focus: boolean }[];
  commonHabit: string;
  physicalAdjustment: string;
  mouthCues: {
    tongue: string;
    jaw: string;
    airflow: string;
  };
  baselineScore: number;
  afterScore: number;
}

const INTERACTIVE_SPECIMENS: SpecimenItem[] = [
  {
    id: "am_r",
    badge: "Consonant Precision",
    title: "American /ɹ/ Resonance",
    ipaSymbol: "/ɹ/ • /ɝ/",
    sentence: "The quarterly report requires a thorough review.",
    ipaTranscription: "/ðə ˈkwɔɹɾɚli ɹɪˈpɔɹt ɹɪˈkwaɪɚz ə ˈθɝoʊ ɹɪˈvju/",
    highlightedWords: [
      { word: "The", ipa: "ðə", focus: false },
      { word: "quarterly", ipa: "ˈkwɔɹɾɚli", focus: true },
      { word: "report", ipa: "ɹɪˈpɔɹt", focus: true },
      { word: "requires", ipa: "ɹɪˈkwaɪɚz", focus: true },
      { word: "a", ipa: "ə", focus: false },
      { word: "thorough", ipa: "ˈθɝoʊ", focus: true },
      { word: "review.", ipa: "ɹɪˈvju", focus: true },
    ],
    commonHabit:
      "Tapping the tongue tip against the roof of the mouth or dropping the rhotic sound at the end of syllables.",
    physicalAdjustment:
      "Anchor the back sides of your tongue gently against your upper molars and curl or bunch the tongue tip slightly back without touching the palate.",
    mouthCues: {
      tongue: "Bunched mid-palate, zero roof contact",
      jaw: "Relaxed with slight lip rounding",
      airflow: "Continuous resonant vocal airflow",
    },
    baselineScore: 58,
    afterScore: 89,
  },
  {
    id: "flap_t",
    badge: "Connected Speech",
    title: "Intervocalic Flap /ɾ/ Flow",
    ipaSymbol: "/ɾ/",
    sentence: "We scheduled a better meeting for later on Saturday.",
    ipaTranscription: "/wi ˈskɛdʒʊld ə ˈbɛɾɚ ˈmiɾɪŋ fɚ ˈleɪɾɚ ɑn ˈsæɾɚdeɪ/",
    highlightedWords: [
      { word: "We", ipa: "wi", focus: false },
      { word: "scheduled", ipa: "ˈskɛdʒʊld", focus: false },
      { word: "a", ipa: "ə", focus: false },
      { word: "better", ipa: "ˈbɛɾɚ", focus: true },
      { word: "meeting", ipa: "ˈmiɾɪŋ", focus: true },
      { word: "for", ipa: "fɚ", focus: false },
      { word: "later", ipa: "ˈleɪɾɚ", focus: true },
      { word: "on", ipa: "ɑn", focus: false },
      { word: "Saturday.", ipa: "ˈsæɾɚdeɪ", focus: true },
    ],
    commonHabit:
      "Releasing a sharp, aspirated /t/ puff of air between vowels, which breaks phrase momentum.",
    physicalAdjustment:
      "Brush the very tip of your tongue against the gum ridge for a fraction of a second while keeping your vocal cords vibrating.",
    mouthCues: {
      tongue: "Quick 25ms bounce on the alveolar ridge",
      jaw: "Steady and open across both syllables",
      airflow: "Unbroken voicing from vowel to vowel",
    },
    baselineScore: 52,
    afterScore: 86,
  },
  {
    id: "rhythm",
    badge: "Sentence Melody & Timing",
    title: "Stress-Timed Rhythm & Reduction",
    ipaSymbol: "/ə/",
    sentence: "We should have been able to confirm the schedule.",
    ipaTranscription: "/wi ˈʃʊdəv bɪn ˈeɪbəl tə kənˈfɝm ðə ˈskɛdʒʊl/",
    highlightedWords: [
      { word: "We", ipa: "wi", focus: false },
      { word: "should have", ipa: "ˈʃʊdəv", focus: true },
      { word: "been", ipa: "bɪn", focus: false },
      { word: "able", ipa: "ˈeɪbəl", focus: true },
      { word: "to", ipa: "tə", focus: true },
      { word: "confirm", ipa: "kənˈfɝm", focus: true },
      { word: "the", ipa: "ðə", focus: false },
      { word: "schedule.", ipa: "ˈskɛdʒʊl", focus: true },
    ],
    commonHabit:
      "Giving every single word equal length and volume, making key ideas harder for listeners to catch.",
    physicalAdjustment:
      "Stretch and elevate pitch on content words ('able', 'confirm', 'schedule') while compressing helper words ('have', 'to', 'the') into quick schwa /ə/ syllables.",
    mouthCues: {
      tongue: "Neutral center position on unstressed words",
      jaw: "Wider opening only on primary stressed syllables",
      airflow: "Wave-like contrast between stressed and reduced beats",
    },
    baselineScore: 61,
    afterScore: 88,
  },
  {
    id: "th_sounds",
    badge: "Dental Clarity",
    title: "Voiced & Voiceless /θ, ð/",
    ipaSymbol: "/θ/ • /ð/",
    sentence: "They thought through all three thousand options together.",
    ipaTranscription: "/ðeɪ ˈθɔt θɹu ɔl ˈθɹi ˈθaʊzənd ˈɑpʃənz təˈɡɛðɚ/",
    highlightedWords: [
      { word: "They", ipa: "ðeɪ", focus: true },
      { word: "thought", ipa: "ˈθɔt", focus: true },
      { word: "through", ipa: "θɹu", focus: true },
      { word: "all", ipa: "ɔl", focus: false },
      { word: "three", ipa: "ˈθɹi", focus: true },
      { word: "thousand", ipa: "ˈθaʊzənd", focus: true },
      { word: "options", ipa: "ˈɑpʃənz", focus: false },
      { word: "together.", ipa: "təˈɡɛðɚ", focus: true },
    ],
    commonHabit:
      "Substituting a hard /d/ or /t/ stop instead of allowing air to glide smoothly past the upper teeth.",
    physicalAdjustment:
      "Rest the flat tip of your tongue lightly against the bottom edge of your upper front teeth and let a steady stream of air pass through.",
    mouthCues: {
      tongue: "Lightly visible between upper and lower teeth",
      jaw: "Slightly parted, never clamped shut",
      airflow: "Soft continuous friction (voiced /ð/ vs breathy /θ/)",
    },
    baselineScore: 64,
    afterScore: 91,
  },
];

const CURRICULUM_PILLARS = [
  {
    category: "Segmental Sounds",
    count: "8 Core Skills",
    description:
      "Master high-impact vowels and consonants that distinguish meaning in everyday and professional conversations.",
    examples: [
      { name: "American /ɹ/ & R-Colored Vowels", ipa: "/ɹ, ɝ, ɚ/", sample: "work • quarter • further" },
      { name: "Tense vs. Lax Vowel Contrasts", ipa: "/iː/ vs /ɪ/", sample: "leave vs live •reach vs rich" },
      { name: "Dental Fricatives", ipa: "/θ/ & /ð/", sample: "think • method • although" },
      { name: "Voiced Word-Final Consonants", ipa: "/z, d, v/", sample: "phase • resolved •save" },
    ],
  },
  {
    category: "Prosody & Melody",
    count: "5 Core Skills",
    description:
      "Shape how listeners perceive your confidence, structure, and emphasis across multi-syllable words and complex thoughts.",
    examples: [
      { name: "Multi-Syllable Word Stress", ipa: "ˈprimary", sample: "deVELopment • eCONomy" },
      { name: "Nuclear Sentence Focus", ipa: "↗ Pitch Peak", sample: "Highlighting the new information" },
      { name: "Thought-Group Pausing", ipa: "| Phrase Break", sample: "Pausing naturally between clauses" },
      { name: "Statement vs. Question Intonation", ipa: "↘ vs ↗", sample: "Clear finality vs open inquiry" },
    ],
  },
  {
    category: "Connected Speech",
    count: "5 Core Skills",
    description:
      "Bridge words smoothly so your speech flows at a natural conversational pace without sounding choppy or rushed.",
    examples: [
      { name: "Intervocalic Flap /ɾ/", ipa: "/ɾ/", sample: "water • better • put it on" },
      { name: "Function-Word Schwa Reduction", ipa: "/ə/", sample: "to (/tə/) • for (/fɚ/) • can (/kən/)" },
      { name: "Consonant-to-Vowel Linking", ipa: "C‿V", sample: "pick_it_up • hold_on" },
      { name: "Stop-Consonant Glottal Holding", ipa: "/t̚/", sample: "not yet • right now • feedback" },
    ],
  },
];

const EIGHT_STAGE_LOOP = [
  { step: "01", name: "Articulatory Guide", detail: "Understand exact tongue, jaw, and lip placement." },
  { step: "02", name: "Hear the Contrast", detail: "Compare target pronunciation against common habits." },
  { step: "03", name: "Minimal Pair Ear Training", detail: "Sharpen perception before speaking aloud." },
  { step: "04", name: "Guided Word Imitation", detail: "Practice isolated target words with instant feedback." },
  { step: "05", name: "Sentence Shadowing", detail: "Match rhythm, linking, and intonation in full phrases." },
  { step: "06", name: "Contextual Production", detail: "Speak naturally in realistic workplace scenarios." },
  { step: "07", name: "Spontaneous Response", detail: "Apply the skill in unscripted 60-second answers." },
  { step: "08", name: "Progress Verification", detail: "Compare your before and after recordings side by side." },
];

export default function LandingPage() {
  const { authUser, speakReference, theme, toggleTheme } = useAccentLab();
  const [selectedSpecimenIdx, setSelectedSpecimenIdx] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const specimen = INTERACTIVE_SPECIMENS[selectedSpecimenIdx];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6] overflow-x-hidden">
      {/* Sticky Seamless Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E5E0D5] bg-[#FBF9F5]/95 backdrop-blur dark:border-[#2E2D29] dark:bg-[#111110]/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45] dark:text-[#FFFFFF]">
              <Activity className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#141413] dark:text-[#F3EFE6]">
              Formant
            </span>
          </Link>

          <nav
            aria-label="Landing Page Navigation"
            className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#4A4842] dark:text-[#B8B3A8]"
          >
            <a href="#interactive-demo" className="hover:text-[#141413] dark:hover:text-[#F3EFE6] transition-colors">
              Interactive Specimen
            </a>
            <a href="#methodology" className="hover:text-[#141413] dark:hover:text-[#F3EFE6] transition-colors">
              Why It Works
            </a>
            <a href="#curriculum" className="hover:text-[#141413] dark:hover:text-[#F3EFE6] transition-colors">
              18-Skill Matrix
            </a>
            <a href="#daily-loop" className="hover:text-[#141413] dark:hover:text-[#F3EFE6] transition-colors">
              8-Step Practice Loop
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-[#F4A261]" aria-hidden="true" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" aria-hidden="true" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </Button>

            {authUser.isAuthenticated ? (
              <Button asChild size="sm">
                <Link href="/dashboard">
                  Open Studio
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">
                    Get started
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle section navigation"
              className="md:hidden inline-flex h-9 px-2.5 items-center justify-center rounded-lg border border-[#D2CBB8] bg-[#FFFFFF] text-xs font-semibold text-[#141413] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
            >
              {mobileNavOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden border-t border-[#E5E0D5] bg-[#F4F1EA] px-4 py-3 space-y-2 dark:border-[#2E2D29] dark:bg-[#181816]">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <a
                href="#interactive-demo"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-2 text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
              >
                Interactive Specimen
              </a>
              <a
                href="#methodology"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-2 text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
              >
                Why It Works
              </a>
              <a
                href="#curriculum"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-2 text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
              >
                18-Skill Matrix
              </a>
              <a
                href="#daily-loop"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-2 text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
              >
                8-Step Loop
              </a>
            </div>
            {!authUser.isAuthenticated && (
              <div className="pt-1">
                <Button asChild variant="outline" size="sm" className="w-full justify-center">
                  <Link href="/login" onClick={() => setMobileNavOpen(false)}>
                    Sign in to existing account
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section: Editorial Monograph + Interactive Phonetic Console */}
      <section className="border-b border-[#E5E0D5] py-10 sm:py-20 dark:border-[#2E2D29]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-10 lg:gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Column (7 cols): Editorial Thesis & Actions */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              <div className="inline-flex items-center gap-2 rounded-md border border-[#D2CBB8] bg-[#F4F1EA] px-3 py-1 text-[11px] sm:text-xs font-semibold text-[#1B4332] dark:border-[#35332E] dark:bg-[#181816] dark:text-[#6EE7B7]">
                <AudioLines className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Personal Pronunciation, Prosody &amp; Clarity Coach</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#141413] dark:text-[#F3EFE6] leading-[1.1]">
                Speak English with{" "}
                <span className="italic text-[#1B4332] dark:text-[#6EE7B7] underline decoration-[#D2CBB8] dark:decoration-[#35332E] underline-offset-8">
                  unmistakable clarity
                </span>{" "}
                and natural rhythm.
              </h1>

              <p className="text-sm sm:text-lg text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed max-w-2xl">
                Most apps give you a vague percentage score and tell you to
                &ldquo;try again.&rdquo;{" "}
                <strong className="font-semibold text-[#141413] dark:text-[#F3EFE6]">Formant</strong>{" "}
                diagnoses your speech across 18 phonetic and prosodic skills,
                then guides you through physical tongue, jaw, and breath
                adjustments tailored to your native language background.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto justify-center px-6"
                >
                  <Link href={authUser.isAuthenticated ? "/assessment" : "/register"}>
                    <Mic className="h-4 w-4" aria-hidden="true" />
                    Start Your Speech Assessment
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto justify-center"
                >
                  <Link href={authUser.isAuthenticated ? "/dashboard" : "/login"}>
                    {authUser.isAuthenticated ? "View Your Dashboard" : "Sign in to your account"}
                  </Link>
                </Button>
              </div>

              {/* Architectural Proof Strip */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 border-t border-[#E5E0D5] pt-6 sm:pt-7 dark:border-[#2E2D29]">
                <div>
                  <div className="font-serif text-xl sm:text-3xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
                    18 Skills
                  </div>
                  <p className="mt-1 text-[11px] sm:text-xs text-[#78756E] dark:text-[#9E9A90]">
                    Vowels, consonants, stress, intonation &amp; linking
                  </p>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#1B4332] dark:text-[#6EE7B7]">
                    L1-Aware
                  </div>
                  <p className="mt-1 text-xs text-[#78756E] dark:text-[#9E9A90]">
                    Calibrated to your native language habits
                  </p>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#B84A27] dark:text-[#F4A261]">
                    10 Mins
                  </div>
                  <p className="mt-1 text-xs text-[#78756E] dark:text-[#9E9A90]">
                    Structured 8-step daily practice sessions
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Interactive Live Phonetic Specimen Explorer */}
            <div id="interactive-demo" className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#78756E] dark:text-[#9E9A90]">
                      Interactive Coaching Specimen
                    </span>
                    <h2 className="mt-0.5 font-serif text-lg font-semibold text-[#141413] dark:text-[#F3EFE6]">
                      Try a Live Phonetic Breakdown
                    </h2>
                  </div>
                  <span className="rounded-md border border-[#D2CBB8] bg-[#F4F1EA] px-2.5 py-1 font-mono text-xs font-semibold text-[#1B4332] dark:border-[#35332E] dark:bg-[#181816] dark:text-[#6EE7B7]">
                    {specimen.ipaSymbol}
                  </span>
                </div>

                {/* Specimen Selector Tabs */}
                <div
                  role="tablist"
                  aria-label="Select pronunciation skill specimen"
                  className="mt-4 grid grid-cols-2 gap-1.5"
                >
                  {INTERACTIVE_SPECIMENS.map((item, idx) => {
                    const active = idx === selectedSpecimenIdx;
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={active}
                        type="button"
                        onClick={() => setSelectedSpecimenIdx(idx)}
                        className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                          active
                            ? "border-[#1B4332] bg-[#1B4332] text-[#FBF9F5] dark:border-[#265C45] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                            : "border-[#E5E0D5] bg-[#FBF9F5] text-[#4A4842] hover:border-[#D2CBB8] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#B8B3A8] dark:hover:border-[#35332E]"
                        }`}
                      >
                        <div className="truncate">{item.title}</div>
                        <div
                          className={`mt-0.5 font-mono text-[10px] ${
                            active ? "text-[#E9F2EE] dark:text-[#FFFFFF]" : "text-[#78756E] dark:text-[#9E9A90]"
                          }`}
                        >
                          {item.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Practice Sentence & Audio Trigger */}
                <div className="mt-4 rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#78756E] dark:text-[#9E9A90]">
                      Practice Phrase
                    </span>
                    <button
                      type="button"
                      onClick={() => speakReference(specimen.sentence, 0.94)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#1B4332] bg-white px-2.5 py-1 text-xs font-semibold text-[#1B4332] hover:bg-[#E9F2EE] transition-colors dark:border-[#265C45] dark:bg-[#1E1E1B] dark:text-[#6EE7B7] dark:hover:bg-[rgba(38,92,69,0.35)]"
                    >
                      <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Listen to Reference
                    </button>
                  </div>

                  {/* Word-by-word IPA alignment pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {specimen.highlightedWords.map((hw, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border px-2.5 py-1.5 ${
                          hw.focus
                            ? "border-[#1B4332] bg-[#E9F2EE] dark:border-[#265C45] dark:bg-[rgba(38,92,69,0.35)]"
                            : "border-[#E5E0D5] bg-white dark:border-[#2E2D29] dark:bg-[#1E1E1B]"
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#141413] dark:text-[#F3EFE6]">
                          {hw.word}
                        </div>
                        <div className={`font-mono text-[10px] ${hw.focus ? "text-[#1B4332] dark:text-[#6EE7B7]" : "text-[#78756E] dark:text-[#9E9A90]"}`}>
                          /{hw.ipa}/
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Physical Articulatory Coaching Box */}
                <div className="mt-4 space-y-3 rounded-xl border border-[#E5E0D5] bg-[#F4F1EA] p-4 dark:border-[#2E2D29] dark:bg-[#161614]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261]">
                      Common Habit
                    </span>
                    <p className="mt-0.5 text-xs text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
                      {specimen.commonHabit}
                    </p>
                  </div>

                  <div className="border-t border-[#E5E0D5] pt-2.5 dark:border-[#2E2D29]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7]">
                      Physical Articulatory Adjustment
                    </span>
                    <p className="mt-0.5 text-xs font-medium text-[#141413] dark:text-[#F3EFE6] leading-relaxed">
                      {specimen.physicalAdjustment}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-[#E5E0D5] pt-2.5 text-[11px] dark:border-[#2E2D29]">
                    <div>
                      <span className="block font-bold text-[#78756E] dark:text-[#9E9A90]">Tongue</span>
                      <span className="text-[#141413] dark:text-[#F3EFE6]">{specimen.mouthCues.tongue}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-[#78756E] dark:text-[#9E9A90]">Jaw &amp; Lips</span>
                      <span className="text-[#141413] dark:text-[#F3EFE6]">{specimen.mouthCues.jaw}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-[#78756E] dark:text-[#9E9A90]">Voice Flow</span>
                      <span className="text-[#141413] dark:text-[#F3EFE6]">{specimen.mouthCues.airflow}</span>
                    </div>
                  </div>
                </div>

                {/* Measurable Improvement Bar */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E5E0D5] bg-white px-4 py-3 text-xs dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                  <div>
                    <span className="text-[#78756E] dark:text-[#9E9A90]">Typical 4-Week Progression:</span>
                    <div className="mt-0.5 font-mono font-bold text-[#141413] dark:text-[#F3EFE6]">
                      Day 1: {specimen.baselineScore}/100 → Week 4:{" "}
                      <span className="text-[#1B4332] dark:text-[#6EE7B7]">{specimen.afterScore}/100</span>
                    </div>
                  </div>
                  <span className="rounded-md bg-[#E9F2EE] border border-[#1B4332]/30 px-2.5 py-1 font-mono text-xs font-bold text-[#1B4332] dark:bg-[rgba(38,92,69,0.35)] dark:border-[#265C45] dark:text-[#6EE7B7]">
                    +{specimen.afterScore - specimen.baselineScore} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Why It Works — 3-Column Architectural Comparison */}
      <section id="methodology" className="border-b border-[#E5E0D5] py-16 sm:py-20 dark:border-[#2E2D29]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#1B4332] dark:text-[#6EE7B7]">
              Designed for Real-World Speaking
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#141413] dark:text-[#F3EFE6]">
              Why phonetic coaching beats generic pronunciation scores.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
              Knowing that a word sounded &ldquo;72% accurate&rdquo; doesn&apos;t tell you how
              to fix it. Formant breaks every recording down into physical,
              repeatable mechanics.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 flex flex-col justify-between dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D2CBB8] bg-[#F4F1EA] text-[#1B4332] dark:border-[#35332E] dark:bg-[#181816] dark:text-[#6EE7B7]">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
                  1. Physical Mouth &amp; Tongue Cues
                </h3>
                <p className="mt-2 text-sm text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
                  Instead of guessing how a sound is made, you get clear
                  instructions on tongue contact, jaw height, lip rounding, and
                  vocal cord vibration for every target sound.
                </p>
              </div>
              <div className="mt-6 border-t border-[#E5E0D5] pt-4 font-mono text-xs text-[#1B4332] dark:border-[#2E2D29] dark:text-[#6EE7B7]">
                Simple &amp; Detailed feedback modes included
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 flex flex-col justify-between dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D2CBB8] bg-[#F4F1EA] text-[#1B4332] dark:border-[#35332E] dark:bg-[#181816] dark:text-[#6EE7B7]">
                  <Compass className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
                  2. Ranked by Real Intelligibility Impact
                </h3>
                <p className="mt-2 text-sm text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
                  We don&apos;t waste your time on rare exceptions. Your daily practice
                  queue prioritizes the sounds and stress patterns that have the
                  highest impact on listener comprehension.
                </p>
              </div>
              <div className="mt-6 border-t border-[#E5E0D5] pt-4 font-mono text-xs text-[#1B4332] dark:border-[#2E2D29] dark:text-[#6EE7B7]">
                Personalized to your L1 transfer profile
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 flex flex-col justify-between dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D2CBB8] bg-[#F4F1EA] text-[#B84A27] dark:border-[#35332E] dark:bg-[#181816] dark:text-[#F4A261]">
                  <GitCompare className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
                  3. Audible Before &amp; After Proof
                </h3>
                <p className="mt-2 text-sm text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
                  Every baseline and weekly reassessment is saved in your archive
                  so you can play your Day 1 recording side-by-side with your
                  latest attempt and hear the difference yourself.
                </p>
              </div>
              <div className="mt-6 border-t border-[#E5E0D5] pt-4 font-mono text-xs text-[#B84A27] dark:border-[#2E2D29] dark:text-[#F4A261]">
                Side-by-side waveform &amp; audio comparison
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The 18-Skill Phonetic & Prosodic Matrix */}
      <section id="curriculum" className="border-b border-[#E5E0D5] py-16 sm:py-20 bg-[#F4F1EA] dark:border-[#2E2D29] dark:bg-[#181816]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#1B4332] dark:text-[#6EE7B7]">
                Complete Spoken-English Taxonomy
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#141413] dark:text-[#F3EFE6]">
                Three dimensions of natural speech.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A4842] dark:text-[#B8B3A8] max-w-md">
              True spoken fluency combines individual sounds, syllable stress,
              and smooth word-to-word transitions.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {CURRICULUM_PILLARS.map((pillar) => (
              <div
                key={pillar.category}
                className="rounded-2xl border border-[#E5E0D5] bg-white p-6 flex flex-col justify-between dark:border-[#2E2D29] dark:bg-[#1E1E1B]"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3 dark:border-[#2E2D29]">
                    <h3 className="font-serif text-xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
                      {pillar.category}
                    </h3>
                    <span className="rounded-md border border-[#D2CBB8] bg-[#FBF9F5] px-2.5 py-0.5 font-mono text-xs font-semibold text-[#1B4332] dark:border-[#35332E] dark:bg-[#181816] dark:text-[#6EE7B7]">
                      {pillar.count}
                    </span>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
                    {pillar.description}
                  </p>

                  <div className="mt-5 space-y-2.5">
                    {pillar.examples.map((ex) => (
                      <div
                        key={ex.name}
                        className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#181816]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#141413] dark:text-[#F3EFE6]">
                            {ex.name}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#1B4332] dark:text-[#6EE7B7]">
                            {ex.ipa}
                          </span>
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-[#78756E] dark:text-[#9E9A90]">
                          {ex.sample}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: The 8-Step Daily Practice Architecture */}
      <section id="daily-loop" className="border-b border-[#E5E0D5] py-16 sm:py-20 dark:border-[#2E2D29]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#B84A27] dark:text-[#F4A261]">
              Structured 10-Minute Sessions
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#141413] dark:text-[#F3EFE6]">
              From ear training to spontaneous speaking in 8 steps.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
              Every lesson follows a proven progression so new pronunciation
              habits carry over into real meetings, interviews, and daily
              conversations.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EIGHT_STAGE_LOOP.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-[#E5E0D5] bg-white p-5 dark:border-[#2E2D29] dark:bg-[#1E1E1B]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1B4332] dark:text-[#6EE7B7]">
                    STEP {item.step}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-[#D2CBB8] dark:text-[#4A4842]" aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-serif text-lg font-semibold text-[#141413] dark:text-[#F3EFE6]">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-xs text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Call-to-Action Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="rounded-2xl border border-[#1B4332] bg-[#1B4332] p-8 sm:p-12 text-[#FBF9F5] dark:border-[#265C45] dark:bg-[#1B382B]">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="inline-block rounded border border-[#E9F2EE]/30 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-widest text-[#E9F2EE]">
                  Ready in 3 Minutes
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#FBF9F5] dark:text-[#FFFFFF]">
                  Discover your top 3 pronunciation priorities today.
                </h2>
                <p className="text-sm sm:text-base text-[#E9F2EE]/85 leading-relaxed max-w-xl">
                  Create your account, select your native language, and complete
                  a short baseline reading to unlock your personalized training
                  plan.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full bg-[#FBF9F5] text-[#141413] border-[#FBF9F5] hover:bg-[#F4F1EA] dark:bg-[#FFFFFF] dark:text-[#111110] dark:border-[#FFFFFF] dark:hover:bg-[#E5E0D5]"
                >
                  <Link href={authUser.isAuthenticated ? "/assessment" : "/register"}>
                    Create Your Free Account
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="w-full text-[#FBF9F5] border border-[#E9F2EE]/30 hover:bg-[#143325] hover:text-[#FBF9F5] dark:text-[#FFFFFF] dark:hover:bg-[#163023]"
                >
                  <Link href="/login">Sign in to existing account</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-[#E5E0D5] bg-[#F4F1EA] py-8 dark:border-[#2E2D29] dark:bg-[#181816]">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-8 text-xs text-[#78756E] dark:text-[#9E9A90]">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45] dark:text-[#FFFFFF]">
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <span className="font-serif text-sm font-bold text-[#141413] dark:text-[#F3EFE6]">
              Formant
            </span>
            <span>— Spoken-English Pronunciation &amp; Prosody Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-[#141413] dark:hover:text-[#F3EFE6]">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-[#141413] dark:hover:text-[#F3EFE6]">
              Create account
            </Link>
            <Link href="/dashboard" className="hover:text-[#141413] dark:hover:text-[#F3EFE6]">
              Studio Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
