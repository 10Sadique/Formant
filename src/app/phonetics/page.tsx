"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Volume2,
  Search,
  BookOpen,
  BookA,
  Sparkles,
  Check,
  Copy,
  AlertTriangle,
  ArrowRight,
  CornerDownRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  VolumeX,
} from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import {
  PHONETIC_ENTRIES,
  resolveSoundEntry,
  type PhoneticEntry,
} from "@/lib/phonetics/phonetic-dictionary";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { id: "all", label: "All Symbols", count: 12 },
  { id: "r_and_vowels", label: "American R & Vowels", count: 4 },
  { id: "consonants_th", label: "Consonants & TH", count: 4 },
  { id: "connected_speech", label: "Connected Speech", count: 3 },
  { id: "prosody", label: "Stress & Rhythm", count: 1 },
];

function PhoneticsGuideContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { speakReference } = useAccentLab();

  const soundParam = searchParams.get("sound");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);
  const [playingText, setPlayingText] = useState<string | null>(null);

  // Initialize selected entry from URL search param if provided, otherwise default to first entry
  const initialResolved = soundParam ? resolveSoundEntry(soundParam) : null;
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    initialResolved ? initialResolved.id : PHONETIC_ENTRIES[0].id
  );

  // Sync selection if URL param changes
  useEffect(() => {
    if (soundParam) {
      const match = resolveSoundEntry(soundParam);
      if (match) {
        setSelectedEntryId(match.id);
      }
    }
  }, [soundParam]);

  // Handle entry selection and sync URL query parameter without scrolling
  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
    router.replace(`/phonetics?sound=${id}`, { scroll: false });
  };

  const handleCopySymbol = (symbol: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(symbol);
      setCopiedSymbol(symbol);
      setTimeout(() => setCopiedSymbol(null), 2000);
    }
  };

  const handlePlayAudio = (text: string, rate: number = 0.9) => {
    setPlayingText(text);
    speakReference(text, rate);
    setTimeout(() => {
      setPlayingText(null);
    }, Math.max(1200, text.split(" ").length * 550));
  };

  // Filter entries based on search query and category
  const filteredEntries = useMemo(() => {
    return PHONETIC_ENTRIES.filter((entry) => {
      const matchesCategory =
        selectedCategory === "all" || entry.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        entry.symbol.toLowerCase().includes(q) ||
        entry.plainName.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.anchorWords.some((w) => w.word.toLowerCase().includes(q)) ||
        entry.practicePhrases.some((p) => p.phrase.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeEntry = useMemo(() => {
    const found = filteredEntries.find((e) => e.id === selectedEntryId);
    return found || filteredEntries[0] || PHONETIC_ENTRIES[0];
  }, [filteredEntries, selectedEntryId]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Page Header with Editorial Hierarchy */}
      <div className="border-b border-[#E5E0D5] pb-6 dark:border-[#2E2D29]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded border border-[#1B4332]/30 bg-[#E9F2EE] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#1B4332] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35 dark:text-[#6EE7B7]">
                <BookA className="h-3 w-3" />
                Acoustic &amp; IPA Reference Studio
              </span>
              <span className="font-mono text-xs text-[#78756E] dark:text-[#9E9A90]">
                • General American English
              </span>
            </div>
            <h1 className="mt-2.5 font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] dark:text-[#F3EFE6]">
              Phonetic &amp; Symbol Pronunciation Guide
            </h1>
            <p className="mt-2 max-w-3xl font-sans text-xs sm:text-sm text-[#4A4842] leading-relaxed dark:text-[#B8B3A8]">
              Non-native English speakers often find phonetic notations like{" "}
              <code className="rounded bg-[#EFECE4] px-1 py-0.5 font-mono font-bold text-[#1B4332] dark:bg-[#262420] dark:text-[#6EE7B7]">
                /ɹ, ɝ, ɚ/
              </code>
              ,{" "}
              <code className="rounded bg-[#EFECE4] px-1 py-0.5 font-mono font-bold text-[#1B4332] dark:bg-[#262420] dark:text-[#6EE7B7]">
                C‿V
              </code>
              ,{" "}
              <code className="rounded bg-[#EFECE4] px-1 py-0.5 font-mono font-bold text-[#1B4332] dark:bg-[#262420] dark:text-[#6EE7B7]">
                /θ/ &amp; /ð/
              </code>
              , and{" "}
              <code className="rounded bg-[#EFECE4] px-1 py-0.5 font-mono font-bold text-[#1B4332] dark:bg-[#262420] dark:text-[#6EE7B7]">
                /ɾ/
              </code>{" "}
              confusing. This guide demystifies every symbol with plain-English names,
              step-by-step physical mouth positions, live dual-speed audio examples, and connected speech phrases.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                Return to Dashboard
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/lessons">
                Browse Lessons
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Horizontal Symbol Strip */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#78756E] dark:text-[#9E9A90]">
              Quick Symbol Picker (12 Core Sounds)
            </span>
            <span className="text-xs text-[#78756E] dark:text-[#9E9A90]">
              Click any symbol to inspect
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {PHONETIC_ENTRIES.map((entry) => {
              const isSelected = entry.id === activeEntry?.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => handleSelectEntry(entry.id)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? "border border-[#1B4332] bg-[#1B4332] text-[#FFFFFF] dark:border-[#6EE7B7] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                      : "border border-[#E5E0D5] bg-[#FFFFFF] text-[#141413] hover:border-[#1B4332] hover:bg-[#F4F1EA] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:border-[#6EE7B7]"
                  }`}
                >
                  <span>{entry.symbol}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78756E] dark:text-[#9E9A90]" />
          <input
            type="text"
            placeholder="Search symbol, sound name, or example (e.g. 'th', 'flap', 'r', 'water')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] pl-9 pr-3.5 py-2 text-xs sm:text-sm text-[#141413] placeholder:text-[#8C8577] focus:border-[#1B4332] focus:outline-none dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
                  isCatActive
                    ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                    : "border border-[#E5E0D5] bg-[#F4F1EA] text-[#4A4842] hover:text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#B8B3A8] dark:hover:text-[#F3EFE6]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isCatActive
                      ? "bg-white/20 text-[#FFFFFF]"
                      : "bg-[#EAE5DA] text-[#78756E] dark:bg-[#262420] dark:text-[#9E9A90]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Workspace: Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sound Selector Ledger (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#78756E] dark:text-[#9E9A90]">
              Showing {filteredEntries.length} Symbol{filteredEntries.length !== 1 ? "s" : ""}
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#B84A27] hover:underline dark:text-[#F4A261]"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredEntries.map((entry) => {
              const isSelected = entry.id === activeEntry?.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => handleSelectEntry(entry.id)}
                  className={`w-full text-left rounded-xl p-4 transition border ${
                    isSelected
                      ? "border-[#1B4332] bg-[#FFFFFF] dark:border-[#6EE7B7] dark:bg-[#1E1E1B]"
                      : "border-[#E5E0D5] bg-[#FFFFFF] hover:border-[#D5CFC2] hover:bg-[#F4F1EA] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:hover:border-[#35332E] dark:hover:bg-[#181816]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-base font-bold text-[#1B4332] dark:text-[#6EE7B7]">
                      {entry.symbol}
                    </span>
                    <span className="rounded bg-[#F4F1EA] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#78756E] border border-[#E5E0D5] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#9E9A90]">
                      {entry.categoryLabel}
                    </span>
                  </div>

                  <h3 className="mt-1.5 font-serif text-sm font-semibold text-[#141413] dark:text-[#F3EFE6] line-clamp-1">
                    {entry.plainName}
                  </h3>

                  <p className="mt-1 text-xs text-[#78756E] dark:text-[#9E9A90] line-clamp-2">
                    {entry.summary}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 border-t border-[#EFECE4] pt-2 text-[11px] text-[#4A4842] dark:border-[#2E2D29] dark:text-[#B8B3A8]">
                    <span className="font-semibold">Examples:</span>
                    <span className="font-mono text-[#1B4332] dark:text-[#6EE7B7] truncate">
                      {entry.anchorWords.map((w) => w.word).slice(0, 3).join(", ")}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredEntries.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#E5E0D5] p-8 text-center text-xs text-[#78756E] dark:border-[#2E2D29] dark:text-[#9E9A90]">
                No symbols found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In-Depth Master Articulatory Studio (lg:col-span-8) */}
        <div className="lg:col-span-8">
          {activeEntry ? (
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 sm:p-8 space-y-8 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
              {/* Sound Header & Dual Speed Audio Toolbar */}
              <div className="border-b border-[#E5E0D5] pb-6 dark:border-[#2E2D29]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl border border-[#1B4332]/30 bg-[#E9F2EE] px-4 py-3 font-mono text-3xl sm:text-4xl font-bold text-[#1B4332] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35 dark:text-[#6EE7B7] shrink-0">
                      {activeEntry.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#F4F1EA] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#78756E] border border-[#E5E0D5] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#9E9A90]">
                          {activeEntry.categoryLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopySymbol(activeEntry.symbol)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#78756E] hover:text-[#141413] dark:text-[#9E9A90] dark:hover:text-[#F3EFE6]"
                          title="Copy IPA symbol"
                        >
                          {copiedSymbol === activeEntry.symbol ? (
                            <>
                              <Check className="h-3 w-3 text-[#1B4332] dark:text-[#6EE7B7]" />
                              <span className="text-[#1B4332] dark:text-[#6EE7B7]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Symbol</span>
                            </>
                          )}
                        </button>
                      </div>
                      <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-normal text-[#141413] dark:text-[#F3EFE6]">
                        {activeEntry.plainName}
                      </h2>
                    </div>
                  </div>

                  {/* Dual Speed Quick Listen Toolbar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        handlePlayAudio(
                          activeEntry.anchorWords.map((w) => w.word).join(", "),
                          1.0
                        )
                      }
                      className="gap-1.5 text-xs"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Listen All (1.0x)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePlayAudio(
                          activeEntry.anchorWords.map((w) => w.word).join(", "),
                          0.75
                        )
                      }
                      className="gap-1.5 text-xs border-[#D2CBB8] dark:border-[#35332E]"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" />
                      Slow Motion (0.75x)
                    </Button>
                  </div>
                </div>

                <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-[#141413] dark:text-[#F3EFE6]">
                  {activeEntry.summary}
                </p>

                {/* Empathetic Non-Native Perspective Box */}
                <div className="mt-4 rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 text-xs sm:text-sm text-[#4A4842] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#B8B3A8]">
                  <strong className="font-semibold text-[#141413] dark:text-[#F3EFE6] block mb-1">
                    💡 Why non-native speakers find this tricky:
                  </strong>
                  <p className="leading-relaxed">
                    {activeEntry.whyItMattersForNonNatives}
                  </p>
                </div>
              </div>

              {/* Physical Mouth & Articulatory Mechanics Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7] flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Physical Mouth &amp; Articulatory Mechanics
                  </h3>
                  <span className="text-[11px] text-[#78756E] dark:text-[#9E9A90]">
                    Acoustic Biomechanics
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#78756E] dark:text-[#9E9A90]">
                      Tongue Position
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#141413] dark:text-[#F3EFE6] leading-relaxed">
                      {activeEntry.mouthMechanics.tongue}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#78756E] dark:text-[#9E9A90]">
                      Vocal Cords
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#1B4332] dark:text-[#6EE7B7] leading-relaxed">
                      {activeEntry.mouthMechanics.vocalCords}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#78756E] dark:text-[#9E9A90]">
                      Lips &amp; Jaw Drop
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#141413] dark:text-[#F3EFE6] leading-relaxed">
                      {activeEntry.mouthMechanics.lipsAndJaw}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#B84A27]/30 bg-[#F9ECE8] p-4 dark:border-[#F4A261]/30 dark:bg-[#B84A27]/20">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261]">
                      Golden Articulatory Rule
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#B84A27] dark:text-[#F4A261] leading-relaxed">
                      {activeEntry.mouthMechanics.goldenRule}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Anchor Words Soundboard */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413] dark:text-[#F3EFE6] flex items-center gap-1.5">
                    Anchor Words &amp; Dual-Speed Audio Soundboard
                  </h3>
                  <span className="text-[11px] text-[#78756E] dark:text-[#9E9A90]">
                    Click play or word to listen
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeEntry.anchorWords.map((anchor, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3.5 flex flex-col justify-between hover:border-[#1B4332] transition dark:border-[#2E2D29] dark:bg-[#181816] dark:hover:border-[#6EE7B7]"
                    >
                      <div>
                        <div className="flex items-baseline justify-between gap-1">
                          <span className="font-serif font-semibold text-base text-[#141413] dark:text-[#F3EFE6]">
                            {anchor.word}
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#1B4332] dark:text-[#6EE7B7]">
                            {anchor.ipa}
                          </span>
                        </div>
                        {anchor.meaningOrContext && (
                          <p className="mt-1 text-[11px] text-[#78756E] dark:text-[#9E9A90] line-clamp-1">
                            {anchor.meaningOrContext}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-[#EFECE4] pt-2 dark:border-[#2E2D29]">
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(anchor.word, 0.75)}
                          title="Listen slowly (0.75x)"
                          className="rounded-md border border-[#E5E0D5] bg-[#FFFFFF] px-2 py-1 font-mono text-[10px] font-semibold text-[#78756E] hover:border-[#1B4332] hover:text-[#1B4332] transition dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#9E9A90] dark:hover:border-[#6EE7B7] dark:hover:text-[#6EE7B7]"
                        >
                          0.75x
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(anchor.word, 1.0)}
                          aria-label={`Listen to ${anchor.word}`}
                          className="inline-flex items-center gap-1 rounded-md border border-[#1B4332]/30 bg-[#E9F2EE] px-2.5 py-1 text-xs font-semibold text-[#1B4332] hover:bg-[#1B4332] hover:text-[#FFFFFF] transition dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35 dark:text-[#6EE7B7] dark:hover:bg-[#265C45] dark:hover:text-[#FFFFFF]"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>1.0x</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Speech Phrases in Real Sentences */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413] dark:text-[#F3EFE6]">
                  Connected Speech &amp; Real-World Phrases
                </h3>
                <div className="space-y-3">
                  {activeEntry.practicePhrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:border-[#2E2D29] dark:bg-[#181816]"
                    >
                      <div className="space-y-1">
                        <p className="font-serif text-base font-medium text-[#141413] dark:text-[#F3EFE6]">
                          "{phrase.phrase}"
                        </p>
                        <p className="font-mono text-xs text-[#1B4332] dark:text-[#6EE7B7]">
                          [{phrase.phoneticBreakdown}]
                        </p>
                        <p className="text-xs text-[#78756E] dark:text-[#9E9A90]">
                          💡 {phrase.tip}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(phrase.phrase, 0.78)}
                          className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-2.5 py-2 font-mono text-xs text-[#78756E] hover:text-[#141413] hover:border-[#1B4332] transition dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#9E9A90] dark:hover:text-[#F3EFE6]"
                        >
                          0.78x
                        </button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayAudio(phrase.phrase, 0.95)}
                          className="gap-1.5 text-xs"
                        >
                          <Volume2 className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" />
                          Listen Phrase
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Pitfalls for Non-Native Speakers */}
              {activeEntry.nativePitfalls.length > 0 && (
                <div className="rounded-xl border border-[#B84A27]/25 bg-[#F9ECE8]/60 p-5 dark:border-[#F4A261]/25 dark:bg-[#B84A27]/15">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261] flex items-center gap-1.5 mb-2.5">
                    <AlertTriangle className="h-4 w-4" />
                    Common Pitfalls for Non-Native Speakers to Avoid
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#141413] dark:text-[#F3EFE6]">
                    {activeEntry.nativePitfalls.map((pitfall, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-[#B84A27] dark:text-[#F4A261]">
                          ×
                        </span>
                        <span className="leading-relaxed">{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* 4. Complete General American Sound Reference Table */}
      <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
        <div className="border-b border-[#E5E0D5] pb-4 mb-6 dark:border-[#2E2D29]">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7]">
            SYNTHESIS TABLE
          </span>
          <h2 className="mt-1 font-serif text-2xl font-normal text-[#141413] dark:text-[#F3EFE6]">
            General American Phonetic Chart &amp; At-a-Glance Comparison
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#78756E] dark:text-[#9E9A90]">
            Compare all 12 key American phonemes, voicing states, and primary articulatory rules side-by-side.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E0D5] text-[#78756E] dark:border-[#2E2D29] dark:text-[#9E9A90]">
                <th className="pb-3 font-mono font-semibold uppercase">IPA Symbol</th>
                <th className="pb-3 font-semibold">Plain English Name</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Voicing</th>
                <th className="pb-3 font-semibold">Key Anchor Words</th>
                <th className="pb-3 font-semibold">Golden Rule Cue</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE4] dark:divide-[#2E2D29]">
              {PHONETIC_ENTRIES.map((entry) => {
                const isSelected = entry.id === activeEntry?.id;
                return (
                  <tr
                    key={entry.id}
                    className={`transition hover:bg-[#F4F1EA] dark:hover:bg-[#181816] ${
                      isSelected ? "bg-[#FBF9F5] dark:bg-[#161614]" : ""
                    }`}
                  >
                    <td className="py-3.5 font-mono text-sm font-bold text-[#1B4332] dark:text-[#6EE7B7]">
                      {entry.symbol}
                    </td>
                    <td className="py-3.5 font-serif font-medium text-[#141413] dark:text-[#F3EFE6]">
                      {entry.plainName}
                    </td>
                    <td className="py-3.5">
                      <span className="rounded bg-[#F4F1EA] px-2 py-0.5 font-mono text-[10px] uppercase text-[#78756E] border border-[#E5E0D5] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#9E9A90]">
                        {entry.categoryLabel}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#4A4842] dark:text-[#B8B3A8]">
                      {entry.mouthMechanics.vocalCords.includes("Voiced") ||
                      entry.mouthMechanics.vocalCords.includes("Vibrating") ? (
                        <span className="font-semibold text-[#1B4332] dark:text-[#6EE7B7]">
                          Voiced
                        </span>
                      ) : entry.mouthMechanics.vocalCords.includes("SILENT") ||
                        entry.mouthMechanics.vocalCords.includes("Voiceless") ? (
                        <span className="font-semibold text-[#B84A27] dark:text-[#F4A261]">
                          Voiceless
                        </span>
                      ) : (
                        <span>Contextual</span>
                      )}
                    </td>
                    <td className="py-3.5 font-mono text-[#4A4842] dark:text-[#B8B3A8]">
                      {entry.anchorWords.map((w) => w.word).slice(0, 3).join(", ")}
                    </td>
                    <td className="py-3.5 max-w-xs truncate text-[#78756E] dark:text-[#9E9A90]">
                      {entry.mouthMechanics.goldenRule}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectEntry(entry.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-md border border-[#E5E0D5] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#1B4332] hover:bg-[#E9F2EE] transition dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#6EE7B7] dark:hover:bg-[#265C45]/35"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PhoneticsGuidePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-[#78756E] dark:text-[#9E9A90]">
          Loading Phonetics Guide...
        </div>
      }
    >
      <PhoneticsGuideContent />
    </Suspense>
  );
}
