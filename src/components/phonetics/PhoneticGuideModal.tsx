"use client";

import React, { useState, useMemo } from "react";
import {
  Volume2,
  Search,
  BookOpen,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import {
  PHONETIC_ENTRIES,
  type PhoneticEntry,
} from "@/lib/phonetics/phonetic-dictionary";

interface PhoneticGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEntryId?: string;
}

export function PhoneticGuideModal({
  open,
  onOpenChange,
  initialEntryId,
}: PhoneticGuideModalProps) {
  const { speakReference } = useAccentLab();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    initialEntryId || PHONETIC_ENTRIES[0].id
  );

  // Sync selectedEntryId if initialEntryId changes
  React.useEffect(() => {
    if (initialEntryId) {
      setSelectedEntryId(initialEntryId);
    }
  }, [initialEntryId]);

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
        entry.anchorWords.some((w) => w.word.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const currentEntry = useMemo(() => {
    const found = filteredEntries.find((e) => e.id === selectedEntryId);
    return found || filteredEntries[0] || PHONETIC_ENTRIES[0];
  }, [filteredEntries, selectedEntryId]);

  const categories = [
    { id: "all", label: "All Symbols" },
    { id: "r_and_vowels", label: "American R & Vowels" },
    { id: "consonants_th", label: "Consonants & TH" },
    { id: "connected_speech", label: "Connected Speech" },
    { id: "prosody", label: "Stress & Rhythm" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="p-6 border-b border-[#E5E0D5] bg-[#FBF9F5] dark:border-[#2E2D29] dark:bg-[#161614]">
          <DialogHeader className="border-0 p-0 text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded border border-[#1B4332]/30 bg-[#E9F2EE] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#1B4332] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35 dark:text-[#6EE7B7]">
                <BookOpen className="h-3 w-3" />
                Pronunciation Demystifier
              </span>
              <span className="font-mono text-xs text-[#78756E] dark:text-[#9E9A90]">
                • For Non-Native English Speakers
              </span>
            </div>
            <DialogTitle className="mt-1.5 text-2xl font-normal">
              General American Phonetic &amp; Symbol Guide
            </DialogTitle>
            <DialogDescription className="mt-1">
              Demystifying phonetic symbols like{" "}
              <code className="font-mono font-bold text-[#1B4332] dark:text-[#6EE7B7]">/ɹ, ɝ, ɚ/</code>,{" "}
              <code className="font-mono font-bold text-[#1B4332] dark:text-[#6EE7B7]">C‿V</code>,{" "}
              <code className="font-mono font-bold text-[#1B4332] dark:text-[#6EE7B7]">/θ/ &amp; /ð/</code>,{" "}
              and <code className="font-mono font-bold text-[#1B4332] dark:text-[#6EE7B7]">/ɾ/</code> with physical mouth cues and live native audio.
            </DialogDescription>
          </DialogHeader>

          {/* Search & Category Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#78756E] dark:text-[#9E9A90]" />
              <input
                type="text"
                placeholder="Search symbol, sound name, or example (e.g. 'th', 'linking', 'r')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] pl-8 pr-3 py-1.5 text-xs text-[#141413] placeholder:text-[#8C8577] focus:border-[#1B4332] focus:outline-none dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    selectedCategory === cat.id
                      ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                      : "bg-[#F4F1EA] text-[#4A4842] hover:text-[#141413] dark:bg-[#1E1E1B] dark:text-[#B8B3A8] dark:hover:text-[#F3EFE6]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Body: Left sidebar selector + Right detail view */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          {/* Symbols Sidebar List */}
          <div className="md:col-span-4 border-r border-[#E5E0D5] bg-[#F4F1EA] dark:border-[#2E2D29] dark:bg-[#161614] overflow-y-auto max-h-[300px] md:max-h-[520px] p-2 space-y-1">
            {filteredEntries.map((entry) => {
              const isSelected = entry.id === currentEntry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedEntryId(entry.id)}
                  className={`w-full text-left rounded-lg p-3 transition flex items-start justify-between gap-2 ${
                    isSelected
                      ? "bg-[#FFFFFF] border border-[#1B4332] dark:bg-[#1E1E1B] dark:border-[#6EE7B7]/50"
                      : "hover:bg-[#EAE5DA] text-[#4A4842] dark:text-[#B8B3A8] dark:hover:bg-[#22211E]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#1B4332] dark:text-[#6EE7B7]">
                        {entry.symbol}
                      </span>
                      <span className="rounded bg-[#EFECE4] px-1.5 py-0.2 text-[9px] font-semibold uppercase text-[#78756E] dark:bg-[#262420] dark:text-[#9E9A90]">
                        {entry.categoryLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-serif font-medium text-[#141413] dark:text-[#F3EFE6] truncate">
                      {entry.plainName}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredEntries.length === 0 && (
              <div className="p-4 text-center text-xs text-[#78756E] dark:text-[#9E9A90]">
                No symbols found matching "{searchQuery}".
              </div>
            )}
          </div>

          {/* Active Sound Detail View */}
          <div className="md:col-span-8 overflow-y-auto max-h-[520px] p-6 space-y-6 bg-[#FFFFFF] dark:bg-[#1E1E1B]">
            {currentEntry ? (
              <>
                {/* Symbol Title & Plain English Meaning */}
                <div className="border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-[#1B4332]/30 bg-[#E9F2EE] px-4 py-2 font-mono text-2xl font-bold text-[#1B4332] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35 dark:text-[#6EE7B7]">
                        {currentEntry.symbol}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#141413] dark:text-[#F3EFE6]">
                          {currentEntry.plainName}
                        </h3>
                        <p className="text-xs text-[#78756E] dark:text-[#9E9A90]">
                          Category: {currentEntry.categoryLabel}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        speakReference(
                          currentEntry.anchorWords.map((w) => w.word).join(", "),
                          0.9
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-3.5 py-2 text-xs font-semibold text-[#FFFFFF] hover:bg-[#133024] dark:bg-[#265C45] dark:hover:bg-[#1E4A37] transition"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Listen All Anchor Words
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#141413] dark:text-[#F3EFE6]">
                    {currentEntry.summary}
                  </p>

                  <div className="mt-3 rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-3 text-xs text-[#4A4842] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#B8B3A8]">
                    <strong className="text-[#141413] dark:text-[#F3EFE6]">
                      Why it matters for non-native speakers:{" "}
                    </strong>
                    {currentEntry.whyItMattersForNonNatives}
                  </div>
                </div>

                {/* Step-by-Step Mouth & Articulatory Mechanics */}
                <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7] flex items-center gap-1.5 mb-3">
                    <Sparkles className="h-3.5 w-3.5" />
                    Physical Mouth &amp; Articulatory Mechanics
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] p-3 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                      <span className="font-bold text-[#141413] dark:text-[#F3EFE6]">
                        Tongue Position:
                      </span>
                      <p className="mt-1 text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
                        {currentEntry.mouthMechanics.tongue}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] p-3 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                      <span className="font-bold text-[#141413] dark:text-[#F3EFE6]">
                        Vocal Cords:
                      </span>
                      <p className="mt-1 font-semibold text-[#1B4332] dark:text-[#6EE7B7]">
                        {currentEntry.mouthMechanics.vocalCords}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] p-3 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                      <span className="font-bold text-[#141413] dark:text-[#F3EFE6]">
                        Lips &amp; Jaw:
                      </span>
                      <p className="mt-1 text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
                        {currentEntry.mouthMechanics.lipsAndJaw}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#B84A27]/30 bg-[#F9ECE8] p-3 dark:border-[#F4A261]/30 dark:bg-[#B84A27]/20">
                      <span className="font-bold text-[#B84A27] dark:text-[#F4A261]">
                        Golden Rule:
                      </span>
                      <p className="mt-1 text-[#B84A27] dark:text-[#F4A261] font-medium leading-relaxed">
                        {currentEntry.mouthMechanics.goldenRule}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Anchor Words with Live Pronunciation Audio */}
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413] dark:text-[#F3EFE6] mb-2.5">
                    Anchor Words &amp; Interactive Audio (Click to Listen)
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {currentEntry.anchorWords.map((anchor, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-2.5 flex items-center justify-between gap-2 hover:border-[#1B4332] transition dark:border-[#2E2D29] dark:bg-[#181816] dark:hover:border-[#6EE7B7]"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-semibold text-sm text-[#141413] dark:text-[#F3EFE6]">
                              {anchor.word}
                            </span>
                            <span className="font-mono text-[11px] text-[#1B4332] dark:text-[#6EE7B7]">
                              {anchor.ipa}
                            </span>
                          </div>
                          {anchor.meaningOrContext && (
                            <p className="text-[10px] text-[#78756E] dark:text-[#9E9A90] truncate">
                              {anchor.meaningOrContext}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => speakReference(anchor.word, 0.9)}
                          aria-label={`Listen to ${anchor.word}`}
                          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E0D5] bg-[#FFFFFF] text-[#1B4332] hover:bg-[#E9F2EE] transition dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#6EE7B7] dark:hover:bg-[#265C45]/35"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Phrases in Connected Speech */}
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413] dark:text-[#F3EFE6] mb-2.5">
                    Practice Phrases in Connected Speech
                  </h4>
                  <div className="space-y-2">
                    {currentEntry.practicePhrases.map((phrase, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-3 flex flex-wrap items-center justify-between gap-3 dark:border-[#2E2D29] dark:bg-[#181816]"
                      >
                        <div>
                          <p className="font-serif text-sm font-medium text-[#141413] dark:text-[#F3EFE6]">
                            "{phrase.phrase}"
                          </p>
                          <p className="font-mono text-xs text-[#1B4332] dark:text-[#6EE7B7] mt-0.5">
                            [{phrase.phoneticBreakdown}]
                          </p>
                          <p className="text-[11px] text-[#78756E] dark:text-[#9E9A90] mt-1">
                            💡 {phrase.tip}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakReference(phrase.phrase, 0.88)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#F4F1EA] transition dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:bg-[#252420]"
                        >
                          <Volume2 className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" />
                          Listen Phrase
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Native Language Pitfalls */}
                {currentEntry.nativePitfalls.length > 0 && (
                  <div className="rounded-xl border border-[#B84A27]/25 bg-[#F9ECE8]/50 p-4 dark:border-[#F4A261]/25 dark:bg-[#B84A27]/15">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261] flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Common Pitfalls for Non-Native Speakers to Avoid
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#141413] dark:text-[#F3EFE6]">
                      {currentEntry.nativePitfalls.map((pitfall, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#B84A27] dark:text-[#F4A261] font-bold">×</span>
                          <span>{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
