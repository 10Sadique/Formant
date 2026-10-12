export interface WordPhoneticToken {
  word: string;
  cleanWord: string;
  targetIpa: string;
  testedSkills: string[];
  stressPattern: string; // e.g. 'DA-da' or 'da-DA-da'
  hasRhotic: boolean;
  hasTh: boolean;
  hasFlapT: boolean;
  hasVowelTrap: boolean;
}

const CMU_CORE_LEXICON: Record<
  string,
  { ipa: string; skills: string[]; stress: string }
> = {
  every: { ipa: "/ˈɛvɹi/", skills: ["am_r", "consonant_contrasts"], stress: "DA-da" },
  thursday: { ipa: "/ˈθɝzdeɪ/", skills: ["th_sounds", "am_r", "word_stress"], stress: "DA-da" },
  morning: { ipa: "/ˈmɔɹnɪŋ/", skills: ["am_r", "vowel_contrasts"], stress: "DA-da" },
  our: { ipa: "/aʊɚ/", skills: ["am_r", "reductions"], stress: "da" },
  international: {
    ipa: "/ˌɪnɚˈnæʃənəl/",
    skills: ["word_stress", "flap_t", "vowel_contrasts", "reductions"],
    stress: "da-da-DA-da-da",
  },
  research: { ipa: "/ˈɹisɝtʃ/", skills: ["am_r", "word_stress"], stress: "DA-da" },
  team: { ipa: "/tiːm/", skills: ["vowel_contrasts"], stress: "DA" },
  gathers: { ipa: "/ˈɡæðɚz/", skills: ["th_sounds", "am_r", "final_consonants"], stress: "DA-da" },
  third: { ipa: "/θɝd/", skills: ["th_sounds", "am_r", "final_consonants"], stress: "DA" },
  floor: { ipa: "/flɔɹ/", skills: ["am_r", "consonant_clusters"], stress: "DA" },
  studio: { ipa: "/ˈstudɪoʊ/", skills: ["vowel_contrasts", "word_stress"], stress: "DA-da-da" },
  review: { ipa: "/ɹɪˈvju/", skills: ["am_r", "consonant_contrasts", "word_stress"], stress: "da-DA" },
  product: { ipa: "/ˈpɹɑdʌkt/", skills: ["am_r", "vowel_contrasts", "consonant_clusters"], stress: "DA-da" },
  architecture: {
    ipa: "/ˈɑɹkəˌtɛktʃɚ/",
    skills: ["am_r", "word_stress", "reductions"],
    stress: "DA-da-da-da",
  },
  quarterly: {
    ipa: "/ˈkwɔɹɾɚli/",
    skills: ["am_r", "flap_t", "consonant_clusters"],
    stress: "DA-da-da",
  },
  priorities: {
    ipa: "/pɹaɪˈɔɹəɾiz/",
    skills: ["am_r", "flap_t", "word_stress", "final_consonants"],
    stress: "da-DA-da-da",
  },
  although: { ipa: "/ɔlˈðoʊ/", skills: ["th_sounds", "word_stress"], stress: "da-DA" },
  several: { ipa: "/ˈsɛvɹəl/", skills: ["am_r", "consonant_contrasts", "reductions"], stress: "DA-da" },
  engineers: {
    ipa: "/ˌɛndʒəˈnɪɹz/",
    skills: ["am_r", "word_stress", "final_consonants"],
    stress: "da-da-DA",
  },
  different: { ipa: "/ˈdɪfɹənt/", skills: ["am_r", "reductions", "consonant_clusters"], stress: "DA-da" },
  regions: { ipa: "/ˈɹidʒənz/", skills: ["am_r", "vowel_contrasts", "final_consonants"], stress: "DA-da" },
  world: { ipa: "/wɝɫd/", skills: ["am_r", "consonant_clusters", "consonant_contrasts"], stress: "DA" },
  work: { ipa: "/wɝk/", skills: ["am_r", "consonant_contrasts"], stress: "DA" },
  together: { ipa: "/təˈɡɛðɚ/", skills: ["th_sounds", "am_r", "reductions", "word_stress"], stress: "da-DA-da" },
  better: { ipa: "/ˈbɛɾɚ/", skills: ["flap_t", "am_r"], stress: "DA-da" },
  water: { ipa: "/ˈwɔɾɚ/", skills: ["flap_t", "am_r", "consonant_contrasts"], stress: "DA-da" },
  bottle: { ipa: "/ˈbɑɾəl/", skills: ["flap_t", "vowel_contrasts"], stress: "DA-da" },
  thought: { ipa: "/θɔt/", skills: ["th_sounds", "vowel_contrasts"], stress: "DA" },
  weather: { ipa: "/ˈwɛðɚ/", skills: ["th_sounds", "am_r", "consonant_contrasts"], stress: "DA-da" },
  saturday: { ipa: "/ˈsæɾɚdeɪ/", skills: ["flap_t", "am_r", "vowel_contrasts"], stress: "DA-da-da" },
  experience: {
    ipa: "/ɪkˈspɪɹiəns/",
    skills: ["am_r", "vowel_contrasts", "word_stress", "consonant_clusters"],
    stress: "da-DA-da-da",
  },
  customer: { ipa: "/ˈkʌstəmɚ/", skills: ["am_r", "reductions", "word_stress"], stress: "DA-da-da" },
  city: { ipa: "/ˈsɪɾi/", skills: ["flap_t", "vowel_contrasts"], stress: "DA-da" },
  meeting: { ipa: "/ˈmiɾɪŋ/", skills: ["flap_t", "vowel_contrasts"], stress: "DA-da" },
};

/**
 * Maps any prompt or user transcript into phonetic word tokens with CMU IPA targets
 * and tagged AccentLab Skill IDs.
 */
export function analyzePromptPhonetics(text: string): WordPhoneticToken[] {
  const rawWords = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return rawWords.map((word) => {
    const cleanWord = word.replace(/[^a-zA-Z']/g, "").toLowerCase();
    const known = CMU_CORE_LEXICON[cleanWord];

    if (known) {
      return {
        word,
        cleanWord,
        targetIpa: known.ipa,
        testedSkills: known.skills,
        stressPattern: known.stress,
        hasRhotic: known.skills.includes("am_r"),
        hasTh: known.skills.includes("th_sounds"),
        hasFlapT: known.skills.includes("flap_t"),
        hasVowelTrap: known.skills.includes("vowel_contrasts"),
      };
    }

    // Rule-based Grapheme-to-Phoneme (G2P) fallback for arbitrary words
    const skills: string[] = [];
    const hasRhotic = /r/.test(cleanWord);
    const hasTh = /th/.test(cleanWord);
    const hasFlapT = /[aeiouy](tt|t|dd)[aeiouy]/.test(cleanWord);
    const hasVowelTrap = /(ee|ea|oo|i|a)/.test(cleanWord);

    if (hasRhotic) skills.push("am_r");
    if (hasTh) skills.push("th_sounds");
    if (hasFlapT) skills.push("flap_t");
    if (hasVowelTrap) skills.push("vowel_contrasts");
    if (cleanWord.length >= 7) skills.push("word_stress", "rhythm");
    if (["to", "for", "of", "and", "the", "can"].includes(cleanWord)) {
      skills.push("reductions", "linking");
    }

    const guessedIpa = `/${cleanWord
      .replace(/th/g, "θ")
      .replace(/er\b/g, "ɚ")
      .replace(/([aeiou])t([aeiou])/g, "$1ɾ$2")
      .replace(/r/g, "ɹ")}/`;

    return {
      word,
      cleanWord,
      targetIpa: guessedIpa,
      testedSkills: skills.length ? skills : ["sentence_stress"],
      stressPattern: cleanWord.length > 6 ? "da-DA-da" : "DA",
      hasRhotic,
      hasTh,
      hasFlapT,
      hasVowelTrap,
    };
  });
}
