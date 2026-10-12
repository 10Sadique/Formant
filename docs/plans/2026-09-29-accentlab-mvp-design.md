# AccentLab MVP — Architectural Design & AI Workflow Specification

**Date**: 2026-09-29
**Status**: Approved for Implementation
**Target Variety (MVP)**: General American English (`en-US`), extensible to `en-GB`, `en-AU`, `en-CA`, `en-IE`.

## 1. Core Product Loop
`Assess -> Identify Weaknesses -> Personalize -> Practice -> Record -> Analyze -> Give Feedback -> Reassess -> Update Training Plan`

## 2. Separation of Speech Measurement & AI Coaching
1. **Stage 1 — Deterministic Acoustic DSP (`src/lib/audio/acoustic-dsp.ts`)**:
   - Captures 16-bit mono PCM `.wav` audio via Web Audio API.
   - Extracts Fundamental Frequency ($F_0$) pitch contour (Hz), pitch movement (SD in semitones/Hz), $F_3/F_2$ rhoticity indicators for General American `/r/`, speech rate (WPM), pause ratio, and nPVI rhythm index.
2. **Stage 2 — CMU Phonetic Dictionary & Skill Scoring (`src/lib/phonetics/ipa-mapper.ts` & `src/lib/engine/scoring-engine.ts`)**:
   - Maps words in prompts/transcripts to ARPABET and IPA phonemes (`/ɹ/`, `/θ/`, `/ð/`, `/ɾ/` Flap T, tense/lax vowels, clusters, stress).
   - Evaluates 18 skills across **Pronunciation**, **Prosody**, and **Connected Speech** on a `0–100` scale.
3. **Stage 3 — Priority Curriculum Engine (`src/lib/engine/priority-engine.ts`)**:
   - Computes $\text{Priority} = \text{Severity} \times \text{Frequency} \times \text{Importance}$ to rank weaknesses and generate personalized daily sessions.
4. **Stage 4 — Grounded Gemini Coach (`src/lib/ai/gemini-speech-coach.ts`)**:
   - Uses `@google/genai` (`gemini-2.5-flash` / `gemini-2.5-pro`) with native `audio/wav` inspection + acoustic telemetry + Native Language (L1) phonetic transfer rules to produce actionable `Simple` and `Detailed` coaching feedback.
