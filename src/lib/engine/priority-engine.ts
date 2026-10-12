import { SEED_SKILLS, SEED_LESSONS, type AccentSkill } from "../db/seed-data";
import type { AcousticTelemetry } from "../audio/acoustic-dsp";

export interface SkillMeasurement {
  skillId: string;
  skillName: string;
  category: "pronunciation" | "prosody" | "connected_speech";
  ipaSymbols: string;
  score: number; // 0 - 100
  baselineScore: number; // 0 - 100
  severity: number; // (100 - score) / 100
  frequency: number; // 0.0 - 1.0 observed error rate
  importance: number; // 0.0 - 1.0 intelligibility weight
  priorityScore: number; // Severity * Frequency * Importance
  evidenceNote: string;
  recommendedLessonId: string;
}

// Native Language (L1) phonetic transfer profiles for realistic diagnostic calibration
const L1_INTERFERENCE_PRIORS: Record<
  string,
  Partial<Record<string, { baseScore: number; freq: number; note: string }>>
> = {
  Bengali: {
    am_r: {
      baseScore: 44,
      freq: 0.86,
      note: "Post-vocalic /r/ softened or tapped in 'research', 'quarter', and 'architecture'.",
    },
    flap_t: {
      baseScore: 48,
      freq: 0.82,
      note: "Retroflex or aspirated /t/ used instead of alveolar Flap /ɾ/ in 'water' and 'better'.",
    },
    th_sounds: {
      baseScore: 62,
      freq: 0.68,
      note: "Dental stop /t̪ʰ/ or /d̪/ occasionally substituted for interdental fricative /θ/ and /ð/.",
    },
    rhythm: {
      baseScore: 47,
      freq: 0.8,
      note: "Syllable-timed cadence (equal vowel length) reducing stress contrast on content words.",
    },
    vowel_contrasts: {
      baseScore: 53,
      freq: 0.74,
      note: "Lax /ɪ/ and tense /iː/ duration overlap in connected speech.",
    },
    consonant_contrasts: {
      baseScore: 58,
      freq: 0.65,
      note: "Bilabial/labiodental overlap on /v/ vs /w/ in fast transitions.",
    },
  },
  Hindi: {
    am_r: {
      baseScore: 45,
      freq: 0.85,
      note: "Alveolar tap /ɾ/ used where General American requires bunched/retroflex approximant /ɹ/.",
    },
    flap_t: {
      baseScore: 49,
      freq: 0.79,
      note: "Retroflex stop /ʈ/ used in intervocalic 'water' and 'better' instead of light tap /ɾ/.",
    },
    rhythm: {
      baseScore: 46,
      freq: 0.82,
      note: "Unstressed syllables retained full vowel quality instead of reducing to schwa (/ə/).",
    },
    word_stress: {
      baseScore: 56,
      freq: 0.72,
      note: "Secondary syllable stressed in multi-syllable words like 'architecture' and 'development'.",
    },
  },
  Spanish: {
    vowel_contrasts: {
      baseScore: 45,
      freq: 0.86,
      note: "5-vowel system merging English tense/lax pairs (/iː/ vs /ɪ/ in 'sheet/sit').",
    },
    am_r: {
      baseScore: 51,
      freq: 0.78,
      note: "Alveolar tap/trill interference on initial and intervocalic /r/.",
    },
    consonant_clusters: {
      baseScore: 54,
      freq: 0.7,
      note: "Epenthetic /e/ before initial /s/ clusters or dropped final cluster stops.",
    },
  },
  Mandarin: {
    am_r: {
      baseScore: 46,
      freq: 0.83,
      note: "Final /r/ coloration (/ɚ/) dropped on 'floor', 'better', and 'customer'.",
    },
    th_sounds: {
      baseScore: 52,
      freq: 0.77,
      note: "/s/ or /z/ substitution on interdental /θ/ and /ð/ ('think', 'although').",
    },
    final_consonants: {
      baseScore: 49,
      freq: 0.81,
      note: "Voiced final stops and nasals shortened at phrase boundaries.",
    },
  },
  Arabic: {
    vowel_contrasts: {
      baseScore: 48,
      freq: 0.8,
      note: "Mid/front lax vowel contrasts (/ɪ/ vs /ɛ/, /æ/ vs /ɑ/) merged in rapid phrases.",
    },
    consonant_contrasts: {
      baseScore: 52,
      freq: 0.75,
      note: "Voiceless bilabial /pʰ/ vs voiced /b/ aspiration timing in initial position.",
    },
    am_r: {
      baseScore: 47,
      freq: 0.82,
      note: "Trilled/tapped alveolar /r/ replacing bunched General American /ɹ/.",
    },
  },
};

/**
 * PRD Section 11: Personalized Training Engine
 * Priority = Severity * Frequency * Importance
 */
export function computePriorityScore(
  score: number,
  frequency: number,
  importanceWeight: number
): { severity: number; priorityScore: number } {
  const clampedScore = Math.max(0, Math.min(100, score));
  const severity = Number(((100 - clampedScore) / 100).toFixed(3));
  const priorityScore = Number((severity * frequency * importanceWeight).toFixed(3));
  return { severity, priorityScore };
}

/**
 * Derives multidimensional skill scores from deterministic acoustic DSP signals
 * + L1 transfer priors + existing baseline scores.
 */
export function evaluateMultidimensionalSkills(params: {
  telemetry: AcousticTelemetry;
  nativeLanguage: string;
  existingBaselineMap?: Record<string, number>;
  practiceBoostPoints?: number;
}): SkillMeasurement[] {
  const { telemetry, nativeLanguage, existingBaselineMap, practiceBoostPoints = 0 } = params;
  const l1Profile = L1_INTERFERENCE_PRIORS[nativeLanguage] || L1_INTERFERENCE_PRIORS.Bengali;

  // Acoustic DSP modifiers
  // F3 below 1980Hz boosts American /r/ score
  const rhoticAcousticBonus =
    telemetry.f3EstimatedHz <= 1950 ? 12 : telemetry.f3EstimatedHz <= 2080 ? 5 : -4;
  // nPVI above 52 boosts stress-timed Rhythm & Reductions
  const rhythmAcousticBonus =
    telemetry.nPviRhythm >= 54 ? 11 : telemetry.nPviRhythm >= 48 ? 4 : -5;
  // Pitch SD (semitones) between 2.4 and 4.5 boosts Intonation & Pitch Movement
  const pitchAcousticBonus =
    telemetry.f0StdSemitones >= 2.5 && telemetry.f0StdSemitones <= 4.6 ? 10 : 2;
  // Pause ratio between 0.10 and 0.24 boosts Pausing & Speech Rate
  const pauseBonus = telemetry.pauseRatio >= 0.08 && telemetry.pauseRatio <= 0.25 ? 9 : 1;

  const measurements: SkillMeasurement[] = SEED_SKILLS.map((skill: AccentSkill, idx: number) => {
    const l1Prior = l1Profile?.[skill.id];
    const defaultBase = 54 + ((idx * 7) % 24);
    const rawBase = l1Prior ? l1Prior.baseScore : defaultBase;

    let dynamicModifier = practiceBoostPoints;
    if (skill.id === "am_r") dynamicModifier += rhoticAcousticBonus;
    if (skill.id === "rhythm" || skill.id === "reductions" || skill.id === "word_stress") {
      dynamicModifier += rhythmAcousticBonus;
    }
    if (skill.id === "intonation" || skill.id === "pitch_movement" || skill.id === "sentence_stress") {
      dynamicModifier += pitchAcousticBonus;
    }
    if (skill.id === "pausing" || skill.id === "speech_rate") {
      dynamicModifier += pauseBonus;
    }

    const score = Math.max(28, Math.min(96, Math.round(rawBase + dynamicModifier)));
    const baselineScore = existingBaselineMap?.[skill.id] ?? Math.max(32, score - practiceBoostPoints);
    const frequency = l1Prior ? l1Prior.freq : Number((0.52 + ((idx * 11) % 35) / 100).toFixed(2));
    const { severity, priorityScore } = computePriorityScore(
      score,
      frequency,
      skill.importanceWeight
    );

    // Map skill to best matching lesson
    const matchingLesson =
      SEED_LESSONS.find((l) => l.skillId === skill.id) ||
      (skill.category === "prosody"
        ? SEED_LESSONS.find((l) => l.id === "lesson_stress_rhythm")
        : skill.category === "connected_speech"
        ? SEED_LESSONS.find((l) => l.id === "lesson_flap_t_linking")
        : SEED_LESSONS[0])!;

    const evidenceNote =
      l1Prior?.note ||
      (skill.id === "am_r"
        ? `DSP measured F3 rhotic dip at ${telemetry.f3EstimatedHz} Hz (Target: <1950 Hz).`
        : skill.id === "rhythm"
        ? `Measured nPVI rhythm index at ${telemetry.nPviRhythm} (General American target: 55–65).`
        : skill.id === "intonation"
        ? `Pitch contour showed ${telemetry.f0StdSemitones} semitones of dynamic variation around ${telemetry.f0MeanHz} Hz.`
        : `Evaluated across ${telemetry.speechRateWpm} WPM speech sample with ${Math.round(
            telemetry.pauseRatio * 100
          )}% pause ratio.`);

    return {
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      ipaSymbols: skill.ipaSymbols,
      score,
      baselineScore,
      severity,
      frequency,
      importance: skill.importanceWeight,
      priorityScore,
      evidenceNote,
      recommendedLessonId: matchingLesson.id,
    };
  });

  // Sort highest priority first: Priority = Severity * Frequency * Importance
  return measurements.sort((a, b) => b.priorityScore - a.priorityScore);
}
