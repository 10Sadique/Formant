export interface AccentTarget {
  id: string;
  name: string;
  region: string;
  isActive: boolean;
  description: string;
}

export interface AccentSkill {
  id: string;
  accentId: string;
  name: string;
  category: "pronunciation" | "prosody" | "connected_speech";
  ipaSymbols: string;
  description: string;
  importanceWeight: number;
  articulatoryGuide: string;
}

export interface LessonStepExercise {
  id: string;
  lessonId: string;
  skillId: string;
  targetAccent: string;
  stepOrder: number;
  lessonStage:
    | "learn"
    | "listen"
    | "repeat"
    | "words"
    | "sentences"
    | "shadowing"
    | "free_speech"
    | "feedback";
  exerciseType:
    | "listen_identify"
    | "minimal_pairs"
    | "read_aloud"
    | "repeat_after"
    | "shadowing"
    | "free_speech";
  difficulty: "Foundation" | "Intermediate" | "Advanced";
  promptText: string;
  targetIpa: string;
  minimalPairOptions?: {
    wordA: string;
    ipaA: string;
    wordB: string;
    ipaB: string;
    targetWord: string;
    contrastTip: string;
  };
  coachingFocus: string;
}

export interface LessonData {
  id: string;
  skillId: string;
  accentId: string;
  title: string;
  subtitle: string;
  difficulty: "Foundation" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  learnContent: {
    overview: string;
    mouthPosition: string;
    commonL1Mistake: string;
    acousticMarker: string;
    contrastExamples: Array<{ target: string; ipa: string; mistakeIpa: string; note: string }>;
  };
  exercises: LessonStepExercise[];
}

export interface BaselineAssessmentItem {
  id: string;
  stageOrder: number;
  stageType: "read_aloud" | "targeted_sentences" | "minimal_pairs" | "spontaneous_speech";
  title: string;
  instructions: string;
  promptText: string;
  targetIpa: string;
  testedSkills: string[];
  recommendedSeconds: number;
  minimalPairs?: Array<{
    pairId: string;
    wordA: string;
    ipaA: string;
    wordB: string;
    ipaB: string;
    sentencePrompt: string;
    skillId: string;
  }>;
}

// PRD Section 19: Configurable English Varieties (en-US active for MVP)
export const SEED_ACCENTS: AccentTarget[] = [
  {
    id: "en-US",
    name: "General American English",
    region: "United States",
    isActive: true,
    description:
      "Standard rhotic American broadcast & professional pronunciation characterized by bunched/retroflex /r/, intervocalic Flap T (/ɾ/), and stress-timed rhythm.",
  },
  {
    id: "en-GB",
    name: "Modern Received Pronunciation (SSB)",
    region: "United Kingdom",
    isActive: false,
    description: "Standard Southern British English (Non-rhotic, distinct bath/trap split). Post-MVP target.",
  },
  {
    id: "en-AU",
    name: "General Australian English",
    region: "Australia",
    isActive: false,
    description: "General Australian variety. Post-MVP target.",
  },
  {
    id: "en-CA",
    name: "Standard Canadian English",
    region: "Canada",
    isActive: false,
    description: "Rhotic North American variety with Canadian raising. Post-MVP target.",
  },
  {
    id: "en-IE",
    name: "Standard Irish English",
    region: "Ireland",
    isActive: false,
    description: "Rhotic Hiberno-English variety. Post-MVP target.",
  },
];

// PRD Section 9: Multidimensional Accent Skill Model (18 Skills across 3 Pillars)
export const SEED_SKILLS: AccentSkill[] = [
  // 9.1 Pronunciation
  {
    id: "am_r",
    accentId: "en-US",
    name: "American /r/ (Rhoticity)",
    category: "pronunciation",
    ipaSymbols: "/ɹ/, /ɝ/, /ɚ/",
    description:
      "Consonant and r-colored vowels where the tongue bunches or curls back without touching the roof of the mouth, dropping the F3 formant below 2000 Hz.",
    importanceWeight: 0.95,
    articulatoryGuide:
      "Brace the back sides of your tongue against the upper molars, pull the tongue root slightly back, and round the lips subtly without letting the tongue tip tap the alveolar ridge.",
  },
  {
    id: "th_sounds",
    accentId: "en-US",
    name: "TH Sounds (/θ/ & /ð/)",
    category: "pronunciation",
    ipaSymbols: "/θ/, /ð/",
    description:
      "Voiceless (/θ/ in 'think') and voiced (/ð/ in 'this') interdental fricatives requiring continuous airflow between the tongue tip and upper teeth.",
    importanceWeight: 0.9,
    articulatoryGuide:
      "Place the very tip of your tongue lightly against the bottom edge of your top front teeth and blow continuous air—avoid stopping the air into a /t/, /d/, or /s/.",
  },
  {
    id: "vowel_contrasts",
    accentId: "en-US",
    name: "Tense vs. Lax Vowel Contrasts",
    category: "pronunciation",
    ipaSymbols: "/iː/ vs /ɪ/, /æ/ vs /ɛ/, /uː/ vs /ʊ/",
    description:
      "Distinguishing high-clarity American vowel pairs such as 'sheep/ship' (/iː/ vs /ɪ/), 'pan/pen' (/æ/ vs /ɛ/), and 'pool/pull' (/uː/ vs /ʊ/).",
    importanceWeight: 0.92,
    articulatoryGuide:
      "For lax /ɪ/ (ship), relax the jaw and tongue slightly lower than /iː/. For American /æ/ (plan), drop the jaw while keeping the tongue front and wide.",
  },
  {
    id: "consonant_contrasts",
    accentId: "en-US",
    name: "Consonant Contrasts (/v/–/w/, /p/–/f/)",
    category: "pronunciation",
    ipaSymbols: "/v/ vs /w/, /pʰ/ vs /b/",
    description:
      "Clear differentiation between labiodental fricative /v/ and bilabial glide /w/, plus initial stop aspiration (/pʰ, tʰ, kʰ/).",
    importanceWeight: 0.84,
    articulatoryGuide:
      "For /v/, gently touch your upper teeth to the wet inner line of your lower lip and vibrate; for /w/, round both lips without tooth contact.",
  },
  {
    id: "final_consonants",
    accentId: "en-US",
    name: "Final Consonants & Voicing",
    category: "pronunciation",
    ipaSymbols: "/d/, /z/, /v/, /t̚/",
    description:
      "Maintaining preceding vowel length before voiced final consonants ('code' vs 'coat', 'phase' vs 'face') and unreleased stops.",
    importanceWeight: 0.8,
    articulatoryGuide:
      "Hold the vowel 40% longer before voiced endings (/d, g, v, z/) than before voiceless endings (/t, k, f, s/).",
  },
  {
    id: "consonant_clusters",
    accentId: "en-US",
    name: "Consonant Clusters",
    category: "pronunciation",
    ipaSymbols: "/stɹ/, /kts/, /ldz/",
    description:
      "Smoothly articulating initial and final multi-consonant groups (e.g., 'strategy', 'months', 'world') without inserting extra epenthetic vowels.",
    importanceWeight: 0.78,
    articulatoryGuide:
      "Transition directly from one consonant mouth shape to the next without dropping the jaw to insert an extra 'uh' vowel between them.",
  },

  // 9.2 Prosody
  {
    id: "word_stress",
    accentId: "en-US",
    name: "Word Stress Placement",
    category: "prosody",
    ipaSymbols: "ˈPrimary / ˌSecondary",
    description:
      "Making the primary stressed syllable noticeably longer, louder, and higher in pitch while reducing unstressed syllables to schwa (/ə/).",
    importanceWeight: 0.94,
    articulatoryGuide:
      "Stretch the vowel in the stressed syllable 2x longer and raise your pitch slightly, while shrinking surrounding syllables to a quick, relaxed /ə/.",
  },
  {
    id: "sentence_stress",
    accentId: "en-US",
    name: "Sentence & Focus Stress",
    category: "prosody",
    ipaSymbols: "Content vs. Function",
    description:
      "Highlighting key content words (nouns, main verbs, adjectives) while compressing function words (prepositions, articles, auxiliaries).",
    importanceWeight: 0.88,
    articulatoryGuide:
      "Step up in pitch and duration on the core new-information word of each phrase, and glide rapidly over grammar words.",
  },
  {
    id: "rhythm",
    accentId: "en-US",
    name: "Stress-Timed Rhythm (nPVI)",
    category: "prosody",
    ipaSymbols: "DA-da-da-DA",
    description:
      "Maintaining an elastic, stress-timed cadence where stressed beats occur at regular intervals rather than giving every syllable equal duration.",
    importanceWeight: 0.91,
    articulatoryGuide:
      "Think of English rhythm like a metronome on stressed words only—squeeze unstressed syllables quickly between the main beats.",
  },
  {
    id: "speech_rate",
    accentId: "en-US",
    name: "Articulation & Speech Rate",
    category: "prosody",
    ipaSymbols: "145–165 WPM",
    description:
      "Speaking at a composed, natural pace where stressed vowels are unhurried and unstressed links are agile.",
    importanceWeight: 0.75,
    articulatoryGuide:
      "Slow down on key stressed vowels rather than adding silence between every word; speed comes from vowel reduction, not rushing.",
  },
  {
    id: "pausing",
    accentId: "en-US",
    name: "Thought Groups & Pausing",
    category: "prosody",
    ipaSymbols: "| Phrase Boundary ||",
    description:
      "Chunking speech into logical 3–6 word thought groups separated by brief breaths rather than pausing mid-phrase.",
    importanceWeight: 0.79,
    articulatoryGuide:
      "Keep airflow continuous inside a thought group (connect every word as one giant word), then pause cleanly after the focus word.",
  },
  {
    id: "intonation",
    accentId: "en-US",
    name: "Intonation Contours",
    category: "prosody",
    ipaSymbols: "↘ Falling / ↗ Rising",
    description:
      "Using falling pitch at the end of declarative statements and wh-questions for authority, and rising pitch for yes/no questions and lists.",
    importanceWeight: 0.86,
    articulatoryGuide:
      "At the end of a statement, step up on the final stressed syllable and glide smoothly down in pitch to project confidence and completion.",
  },
  {
    id: "pitch_movement",
    accentId: "en-US",
    name: "Dynamic Pitch Range",
    category: "prosody",
    ipaSymbols: "F0 Variance (Hz)",
    description:
      "Avoiding flat monotone delivery by using natural American pitch steps across stressed content words.",
    importanceWeight: 0.82,
    articulatoryGuide:
      "Allow your voice pitch to rise 3–5 semitones on emphasized words so listeners can effortlessly track your key takeaway.",
  },

  // 9.3 Connected Speech
  {
    id: "flap_t",
    accentId: "en-US",
    name: "American Flap T (/ɾ/)",
    category: "connected_speech",
    ipaSymbols: "/ɾ/ (water, better)",
    description:
      "Replacing /t/ and /d/ between vowels (when the second syllable is unstressed) with a quick alveolar tap (/ɾ/) sounding like a rapid 'd'.",
    importanceWeight: 0.89,
    articulatoryGuide:
      "Instead of building air pressure for a sharp /t/ in 'water' or 'better', flick the tip of your tongue against the ridge behind your teeth for just 20 milliseconds.",
  },
  {
    id: "linking",
    accentId: "en-US",
    name: "Consonant-to-Vowel Linking",
    category: "connected_speech",
    ipaSymbols: "C‿V (pick_it_up)",
    description:
      "Attaching the final consonant of one word directly onto the initial vowel of the next word ('pick it up' -> 'pi-ki-dup').",
    importanceWeight: 0.85,
    articulatoryGuide:
      "Never stop your voice between a final consonant and a following vowel—re-syllabify the consonant as the start of the next word.",
  },
  {
    id: "reductions",
    accentId: "en-US",
    name: "Function Word Reductions (Schwa /ə/)",
    category: "connected_speech",
    ipaSymbols: "to → /tə/, for → /fɚ/",
    description:
      "Reducing weak function words ('to', 'for', 'and', 'of', 'can') to ultra-short schwa forms (/tə/, /fɚ/, /ən/, /əv/, /kən/) in natural speech.",
    importanceWeight: 0.87,
    articulatoryGuide:
      "Never pronounce 'to' as a full '/tuː/' or 'for' as '/fɔːɹ/' inside a sentence—relax your mouth to '/tə/' and '/fɚ/'.",
  },
  {
    id: "contractions",
    accentId: "en-US",
    name: "Natural Contractions",
    category: "connected_speech",
    ipaSymbols: "I'll, we've, it's",
    description:
      "Fluidly blending pronoun + auxiliary contractions in spoken English without sounding stiff or robotic.",
    importanceWeight: 0.74,
    articulatoryGuide:
      "Use dark /ɫ/ in 'I'll' (/aɪɫ/) and link 'we've' (/wiv/) directly into the following verb.",
  },
  {
    id: "assimilation",
    accentId: "en-US",
    name: "Palatal Assimilation (/t+j/ → /tʃ/)",
    category: "connected_speech",
    ipaSymbols: "did you → /dɪdʒə/",
    description:
      "Blending /t/, /d/, /s/, /z/ before 'you/your' into /tʃ/, /dʒ/, /ʃ/, /ʒ/ ('got you' -> 'gotcha', 'would you' -> 'woodja').",
    importanceWeight: 0.72,
    articulatoryGuide:
      "Let the /d/ in 'would' and the /j/ in 'you' merge naturally at the palate into a soft '/dʒ/' sound.",
  },
];

// PRD Section 8: Baseline Assessment (4 Stages)
export const SEED_BASELINE_ASSESSMENT: BaselineAssessmentItem[] = [
  {
    id: "base_1_passage",
    stageOrder: 1,
    stageType: "read_aloud",
    title: "Part 1: Diagnostic Read-Aloud Passage",
    instructions:
      "Read this paragraph aloud at your natural speaking pace. It is phonetically engineered to test every core General American vowel, consonant, stress pattern, and connected-speech link.",
    promptText:
      "Every Thursday morning, our international research team gathers in the third-floor studio to review product architecture and quarterly priorities. Although several engineers joined from different regions of the world, we work together to make a better experience for every customer.",
    targetIpa:
      "/ˈɛvɹi ˈθɝzdeɪ ˈmɔɹnɪŋ | aʊɚ ˌɪnɚˈnæʃənəl ɹɪˈsɝtʃ tim ˈɡæðɚz ɪn ðə ˈθɝd flɔɹ ˈstudɪoʊ tə ɹɪˈvju ˈpɹɑdʌkt ˈɑɹkəˌtɛktʃɚ ən ˈkwɔɹɾɚli pɹaɪˈɔɹəɾiz/",
    testedSkills: [
      "am_r",
      "th_sounds",
      "flap_t",
      "word_stress",
      "rhythm",
      "vowel_contrasts",
      "reductions",
    ],
    recommendedSeconds: 25,
  },
  {
    id: "base_2_sentences",
    stageOrder: 2,
    stageType: "targeted_sentences",
    title: "Part 2: Targeted Phonetic & Prosody Sentences",
    instructions:
      "Read these three high-density diagnostic sentences clearly, paying attention to American Flap T, linking, and sentence stress.",
    promptText:
      "1. Could you pick it up after the water bottle is empty?  2. We thought the weather would get noticeably better by Saturday.  3. Focusing on critical communication skills creates stronger global leadership.",
    targetIpa:
      "/ˈkʊdʒə pɪ‿kɪ‿ɾʌp ˈæftɚ ðə ˈwɔɾɚ ˈbɑɾəl ɪz ˈɛmpti | wi ˈθɔt ðə ˈwɛðɚ wʊd ɡɛt ˈnoʊɾəsəbli ˈbɛɾɚ baɪ ˈsæɾɚdeɪ/",
    testedSkills: [
      "flap_t",
      "linking",
      "assimilation",
      "th_sounds",
      "sentence_stress",
      "intonation",
    ],
    recommendedSeconds: 22,
  },
  {
    id: "base_3_minimal_pairs",
    stageOrder: 3,
    stageType: "minimal_pairs",
    title: "Part 3: Minimal-Pair Contrast Check",
    instructions:
      "Read each pair aloud with a distinct contrast between the first and second word, then read the comparison sentence.",
    promptText:
      "Pair 1: Sheet vs. Sit — Please sit on the clean sheet.  Pair 2: Three vs. Tree — There are three birds in the tree.  Pair 3: Better vs. Bedder — The water tastes better today.",
    targetIpa:
      "/ʃit/ vs /sɪt/ • /θɹi/ vs /tɹi/ • /ˈbɛɾɚ/ vs /ˈwɔɾɚ/",
    testedSkills: ["vowel_contrasts", "th_sounds", "am_r", "flap_t"],
    recommendedSeconds: 20,
    minimalPairs: [
      {
        pairId: "mp_1",
        wordA: "Sheet",
        ipaA: "/ʃiːt/ (Tense high-front)",
        wordB: "Sit",
        ipaB: "/sɪt/ (Lax mid-high)",
        sentencePrompt: "Please sit on the clean sheet.",
        skillId: "vowel_contrasts",
      },
      {
        pairId: "mp_2",
        wordA: "Three",
        ipaA: "/θɹiː/ (Interdental fricative)",
        wordB: "Tree",
        ipaB: "/tɹiː/ (Alveolar stop cluster)",
        sentencePrompt: "There are three birds in the tall tree.",
        skillId: "th_sounds",
      },
      {
        pairId: "mp_3",
        wordA: "Right",
        ipaA: "/ɹaɪt/ (Bunched rhotic)",
        wordB: "Light",
        ipaB: "/laɪt/ (Alveolar lateral)",
        sentencePrompt: "Turn right at the bright traffic light.",
        skillId: "am_r",
      },
    ],
  },
  {
    id: "base_4_spontaneous",
    stageOrder: 4,
    stageType: "spontaneous_speech",
    title: "Part 4: Spontaneous Speaking Sample (Up to 2 Minutes)",
    instructions:
      "Speak naturally without a script for 45–120 seconds on the prompt below. This measures how your pronunciation, stress, rhythm, and pausing hold up when you are thinking about ideas in real time.",
    promptText:
      "Prompt: Describe a recent project, technical problem, or professional goal you are working on, why it matters to you, and how you communicate with your colleagues or clients.",
    targetIpa: "Spontaneous Prosody, Speech Rate, Pausing & Real-Time Phoneme Stability",
    testedSkills: [
      "rhythm",
      "sentence_stress",
      "pausing",
      "intonation",
      "pitch_movement",
      "am_r",
      "flap_t",
    ],
    recommendedSeconds: 90,
  },
];

// PRD Section 12 & 18: Data-driven 8-Step Lessons
export const SEED_LESSONS: LessonData[] = [
  {
    id: "lesson_am_r_mastery",
    skillId: "am_r",
    accentId: "en-US",
    title: "Mastering the General American /r/ & R-Colored Vowels",
    subtitle: "Lower your F3 formant with molar bracing for crisp initial, medial, and final /r/",
    difficulty: "Foundation",
    estimatedMinutes: 15,
    learnContent: {
      overview:
        "The General American /r/ (/ɹ/, /ɝ/, /ɚ/) is the single highest-impact sound for sounding natural in American English. Unlike rolled or tapped R sounds in many languages, the American /r/ never touches the roof of the mouth.",
      mouthPosition:
        "1. Press the back left and right edges of your tongue firmly against your upper back molars. 2. Pull the tip of your tongue slightly back and up (or bunch the middle up) so there is zero contact with the gum ridge. 3. Round your lips slightly like you are about to say 'w'.",
      commonL1Mistake:
        "Tapping the tongue tip quickly against the roof of the mouth (sounding like a flap /ɾ/ or Spanish/Bengali/Hindi tapped R) or dropping the /r/ at the end of words ('car' -> 'cah', 'work' -> 'wuhk').",
      acousticMarker:
        "Acoustic target: Third formant (F3) drops sharply below 1,950 Hz. Our DSP analyzer tracks your F3 dip directly.",
      contrastExamples: [
        {
          target: "work / world",
          ipa: "/wɝk/ • /wɝɫd/",
          mistakeIpa: "/wɔːk/ • /wɑld/",
          note: "Keep tongue bunched throughout the entire vowel (/ɝ/).",
        },
        {
          target: "better / water",
          ipa: "/ˈbɛɾɚ/ • /ˈwɔɾɚ/",
          mistakeIpa: "/ˈbɛtə/ • /ˈwɔtə/",
          note: "Unstressed final '-er' still keeps rhotic coloring (/ɚ/).",
        },
      ],
    },
    exercises: [
      {
        id: "ex_amr_1_learn",
        lessonId: "lesson_am_r_mastery",
        skillId: "am_r",
        targetAccent: "en-US",
        stepOrder: 1,
        lessonStage: "learn",
        exerciseType: "listen_identify",
        difficulty: "Foundation",
        promptText: "Read and test the articulatory anchor: 'eerrr -> research -> architecture'",
        targetIpa: "/ɝː/ → /ˈɹisɝtʃ/ → /ˈɑɹkəˌtɛktʃɚ/",
        coachingFocus: "Verify upper-molar bracing before moving into words.",
      },
      {
        id: "ex_amr_2_listen",
        lessonId: "lesson_am_r_mastery",
        skillId: "am_r",
        targetAccent: "en-US",
        stepOrder: 2,
        lessonStage: "listen",
        exerciseType: "minimal_pairs",
        difficulty: "Foundation",
        promptText: "Listen and contrast rhotic /ɝ/ vs open vowel: 'First work' vs 'Fast walk'",
        targetIpa: "/fɝst wɝk/ vs /fæst wɔk/",
        minimalPairOptions: {
          wordA: "First work",
          ipaA: "/fɝst wɝk/",
          wordB: "Fast walk",
          ipaB: "/fæst wɔk/",
          targetWord: "First work",
          contrastTip: "Keep the tongue retracted and bunched during the vowel in 'First' and 'work'.",
        },
        coachingFocus: "Hear and produce the F3 rhotic resonance in stressed /ɝ/.",
      },
      {
        id: "ex_amr_3_repeat",
        lessonId: "lesson_am_r_mastery",
        skillId: "am_r",
        targetAccent: "en-US",
        stepOrder: 3,
        lessonStage: "repeat",
        exerciseType: "repeat_after",
        difficulty: "Foundation",
        promptText: "Right around the corner, our research director started early.",
        targetIpa: "/ˈɹaɪɾ‿əˈɹaʊnd ðə ˈkɔɹnɚ | aʊɚ ˈɹisɝtʃ dəˈɹɛktɚ ˈstɑɹɾəd ˈɝli/",
        coachingFocus: "Maintain strong /r/ coloring across both initial /ɹ/ and post-vocalic /ɹ/.",
      },
      {
        id: "ex_amr_4_words",
        lessonId: "lesson_am_r_mastery",
        skillId: "am_r",
        targetAccent: "en-US",
        stepOrder: 4,
        lessonStage: "words",
        exerciseType: "read_aloud",
        difficulty: "Intermediate",
        promptText: "Research • Architecture • Priority • Quarter • World •Further • Culture",
        targetIpa: "/ˈɹisɝtʃ • ˈɑɹkəˌtɛktʃɚ • pɹaɪˈɔɹəɾi • ˈkwɔɹɾɚ • wɝɫd • ˈfɝðɚ • ˈkʌltʃɚ/",
        coachingFocus: "Controlled vocabulary practice isolating /ɹ/, /ɝ/, and /ɚ/.",
      },
      {
        id: "ex_amr_5_sentences",
        lessonId: "lesson_am_r_mastery",
        skillId: "am_r",
        targetAccent: "en-US",
        stepOrder: 5,
        lessonStage: "sentences",
        exerciseType: "read_aloud",
        difficulty: "Intermediate",
        promptText:
          "Our engineering partner presented a remarkably clear architecture report on Thursday afternoon.",
        targetIpa:
          "/aʊɚ ˌɛndʒəˈnɪɹɪŋ ˈpɑɹtnɚ pɹɪˈzɛnɾəd ə ɹɪˈmɑɹkəbli klɪɹ ˈɑɹkəˌtɛktʃɚ ɹɪˈpɔɹt ɑn ˈθɝzdeɪ ˌæftɚˈnun/",
        coachingFocus: "Keep /r/ accuracy consistent inside multi-syllable technical phrases.",
      },
      {
        id: "ex_amr_6_shadowing",
        lessonId: "lesson_am_r_mastery",
        skillId: "am_r",
        targetAccent: "en-US",
        stepOrder: 6,
        lessonStage: "shadowing",
        exerciseType: "shadowing",
        difficulty: "Advanced",
        promptText:
          "We are working hard to improve customer retention before the third quarter wraps up.",
        targetIpa:
          "/wi ɚ ˈwɝkɪŋ ˈhɑɹd tə ɪmˈpɹuv ˈkʌstəmɚ ɹɪˈtɛnʃən bɪˈfɔɹ ðə ˈθɝd ˈkwɔɹɾɚ ˈɹæps ʌp/",
        coachingFocus: "Shadow the reference speaker simultaneously matching rhythm and rhoticity.",
      },
      {
        id: "ex_amr_7_freespeech",
        lessonId: "lesson_am_r_mastery",
        skillId: "am_r",
        targetAccent: "en-US",
        stepOrder: 7,
        lessonStage: "free_speech",
        exerciseType: "free_speech",
        difficulty: "Advanced",
        promptText:
          "Speak for 30 seconds about your career path, current responsibilities, and where you want your work to grow this year.",
        targetIpa: "Spontaneous /r/ retention check in unscripted sentences",
        coachingFocus: "Transfer conscious /r/ placement into spontaneous thought generation.",
      },
      {
        id: "ex_amr_8_feedback",
        lessonId: "lesson_am_r_mastery",
        skillId: "am_r",
        targetAccent: "en-US",
        stepOrder: 8,
        lessonStage: "feedback",
        exerciseType: "read_aloud",
        difficulty: "Intermediate",
        promptText:
          "Final Mastery Check: Every developer on our global team learned how to deliver clearer results.",
        targetIpa: "/ˈɛvɹi dɪˈvɛləpɚ ɑn aʊɚ ˈɡloʊbəl tim ˈlɝnd haʊ tə dɪˈlɪvɚ ˈklɪɹɚ ɹɪˈzʌlts/",
        coachingFocus: "Complete lesson summary & skill score update.",
      },
    ],
  },
  {
    id: "lesson_flap_t_linking",
    skillId: "flap_t",
    accentId: "en-US",
    title: "American Flap T (/ɾ/) & Connected Speech Flow",
    subtitle: "Turn sharp intervocalic /t/ into a smooth 20ms alveolar tap across words and phrases",
    difficulty: "Intermediate",
    estimatedMinutes: 12,
    learnContent: {
      overview:
        "In General American English, when /t/ or /d/ appears between two vowels and the following vowel is unstressed ('water', 'better', 'city', 'put it on'), native speakers replace the aspirated /t/ with a quick voiced tap (/ɾ/).",
      mouthPosition:
        "Keep your vocal cords vibrating continuously and flick the very tip of your tongue lightly against the tooth ridge for 20ms—just like a fast 'd' in 'ladder'.",
      commonL1Mistake:
        "Releasing a strong puff of air (/tʰ/) in the middle of 'water', 'better', or 'meeting', which breaks the legato flow of American speech.",
      acousticMarker:
        "Acoustic target: Voiced closure duration under 30ms with unbroken F0 voicing bar between flanking vowels.",
      contrastExamples: [
        {
          target: "water / better / city",
          ipa: "/ˈwɔɾɚ/ • /ˈbɛɾɚ/ • /ˈsɪɾi/",
          mistakeIpa: "/ˈwɔtʰɚ/ • /ˈbɛtʰɚ/ • /ˈsɪtʰi/",
          note: "Tap the tongue once without stopping your voice.",
        },
        {
          target: "get it out / put it on",
          ipa: "/ˈɡɛɾ‿ɪɾ‿aʊt/ • /ˈpʊɾ‿ɪɾ‿ɑn/",
          mistakeIpa: "/ɡɛt ɪt aʊt/ • /pʊt ɪt ɑn/",
          note: "Flap T also triggers across word boundaries when linking C-to-V!",
        },
      ],
    },
    exercises: [
      {
        id: "ex_flap_1",
        lessonId: "lesson_flap_t_linking",
        skillId: "flap_t",
        targetAccent: "en-US",
        stepOrder: 1,
        lessonStage: "learn",
        exerciseType: "listen_identify",
        difficulty: "Foundation",
        promptText: "Anchor phrase: 'A little bit of water makes it better.'",
        targetIpa: "/ə ˈlɪɾəl ˈbɪɾ‿əv ˈwɔɾɚ ˈmeɪks‿ɪt ˈbɛɾɚ/",
        coachingFocus: "Notice how four /t/ spellings all become smooth /ɾ/ taps.",
      },
      {
        id: "ex_flap_2",
        lessonId: "lesson_flap_t_linking",
        skillId: "flap_t",
        targetAccent: "en-US",
        stepOrder: 2,
        lessonStage: "words",
        exerciseType: "read_aloud",
        difficulty: "Foundation",
        promptText: "Water • Better • City • Data • Meeting • Automatic • University • Saturday",
        targetIpa: "/ˈwɔɾɚ • ˈbɛɾɚ • ˈsɪɾi • ˈdeɪɾə • ˈmiɾɪŋ • ˌɔɾəˈmæɾɪk • ˌjunəˈvɝsəɾi • ˈsæɾɚdeɪ/",
        coachingFocus: "Practice word-internal Flap T before unstressed syllables.",
      },
      {
        id: "ex_flap_3",
        lessonId: "lesson_flap_t_linking",
        skillId: "flap_t",
        targetAccent: "en-US",
        stepOrder: 3,
        lessonStage: "sentences",
        exerciseType: "read_aloud",
        difficulty: "Intermediate",
        promptText:
          "Let's talk about it at a later meeting so we can sort it out together.",
        targetIpa:
          "/lɛts ˈtɔk‿əˈbaʊɾ‿ɪɾ‿æɾ‿ə ˈleɪɾɚ ˈmiɾɪŋ soʊ wi kən ˈsɔɹɾ‿ɪɾ‿aʊt təˈɡɛðɚ/",
        coachingFocus: "Link word-final /t/ into vowel-initial words ('about_it_at_a').",
      },
      {
        id: "ex_flap_4",
        lessonId: "lesson_flap_t_linking",
        skillId: "flap_t",
        targetAccent: "en-US",
        stepOrder: 4,
        lessonStage: "free_speech",
        exerciseType: "free_speech",
        difficulty: "Advanced",
        promptText:
          "Describe your favorite city or daily routine for 30 seconds using words like 'city', 'water', 'better', 'later', and 'getting'.",
        targetIpa: "Spontaneous Flap T & C-V linking in natural speech",
        coachingFocus: "Keep speech connected without hard glottal or aspirated stops.",
      },
    ],
  },
  {
    id: "lesson_stress_rhythm",
    skillId: "rhythm",
    accentId: "en-US",
    title: "Stress-Timed Rhythm, Vowel Reduction & Pitch Peaks",
    subtitle: "Stretch stressed content syllables and compress function words to schwa (/ə/)",
    difficulty: "Intermediate",
    estimatedMinutes: 15,
    learnContent: {
      overview:
        "English is a stress-timed language. Native listeners rely on the contrast between long, high-pitch stressed syllables and ultra-short, reduced unstressed syllables (/ə/) to parse meaning effortlessly.",
      mouthPosition:
        "Open the jaw generously on primary stressed vowels; relax the jaw and lips completely to a central neutral schwa (/ə/) on unstressed syllables and grammar words.",
      commonL1Mistake:
        "Giving every syllable equal duration and full vowel quality (syllable-timed rhythm), which makes English sound choppy or overly mechanical.",
      acousticMarker:
        "Acoustic target: Normalized Pairwise Variability Index (nPVI) > 52 and clear F0 pitch step on focus words.",
      contrastExamples: [
        {
          target: "com-MU-ni-ca-tion",
          ipa: "/kəˌmjuːnəˈkeɪʃən/",
          mistakeIpa: "/kɒm-ju-nɪ-keɪ-ʃɒn/",
          note: "3 of the 5 syllables reduce to quick schwa (/ə/); only '-KEI-' gets full length.",
        },
        {
          target: "I want to go to the office",
          ipa: "/aɪ ˈwɑnə ˈɡoʊ tə ðɪ ˈɔfəs/",
          mistakeIpa: "/aɪ wɒnt tuː ɡoʊ tuː ðiː ˈɒfɪs/",
          note: "Compress function words so 'GO' and 'OF-fice' stand out.",
        },
      ],
    },
    exercises: [
      {
        id: "ex_rhy_1",
        lessonId: "lesson_stress_rhythm",
        skillId: "rhythm",
        targetAccent: "en-US",
        stepOrder: 1,
        lessonStage: "words",
        exerciseType: "read_aloud",
        difficulty: "Foundation",
        promptText: "De-VEL-op-ment • Op-por-TU-ni-ty • In-fra-STRUC-ture • Prior-i-ti-ZA-tion",
        targetIpa: "/dɪˈvɛləpmənt • ˌɑpɚˈtunəɾi • ˈɪnfɹəˌstɹʌktʃɚ • pɹaɪˌɔɹəɾəˈzeɪʃən/",
        coachingFocus: "Contrast the stretched capital syllable against the ultra-short reduced syllables.",
      },
      {
        id: "ex_rhy_2",
        lessonId: "lesson_stress_rhythm",
        skillId: "rhythm",
        targetAccent: "en-US",
        stepOrder: 2,
        lessonStage: "sentences",
        exerciseType: "shadowing",
        difficulty: "Intermediate",
        promptText:
          "We need to ANALYZE the PERFORMANCE of the APPLICATION before we DEPLOY it to PRODUCTION.",
        targetIpa:
          "/wi ˈnid tə ˈænəlaɪz ðə pɚˈfɔɹməns əv ðɪ ˌæpləˈkeɪʃən bɪˈfɔɹ wi dɪˈplɔɪ ɪt tə pɹəˈdʌkʃən/",
        coachingFocus: "Hit the capitalized content beats rhythmically while gliding quickly over 'to', 'the', 'of', 'before'.",
      },
    ],
  },
  {
    id: "lesson_th_contrasts",
    skillId: "th_sounds",
    accentId: "en-US",
    title: "Voiceless (/θ/) & Voiced (/ð/) TH Precision",
    subtitle: "Eliminate /t/, /d/, or /s/ substitutions in high-frequency words",
    difficulty: "Foundation",
    estimatedMinutes: 12,
    learnContent: {
      overview:
        "Because '/θ/' (think, Thursday) and '/ð/' (this, that, together, weather) appear in the top 20 most frequent words in English ('the', 'this', 'that', 'they', 'their', 'with'), mastering smooth interdental airflow immediately elevates clarity.",
      mouthPosition:
        "Rest the soft flat tip of your tongue lightly against the bottom edge of your upper front teeth. Blow a steady stream of air without sealing the air off.",
      commonL1Mistake:
        "Pressing the tongue hard behind the teeth to create a stop (/t/ or /d/ -> 'tink', 'dis') or pulling the tongue back into a sibilant ('sink', 'zis').",
      acousticMarker:
        "Acoustic target: Low-amplitude broadband frication without a stop burst spike.",
      contrastExamples: [
        {
          target: "think / thank / Thursday",
          ipa: "/θɪŋk/ • /θæŋk/ • /ˈθɝzdeɪ/",
          mistakeIpa: "/tʰɪŋk/ • /tʰæŋk/ • /ˈtɝzdeɪ/",
          note: "Continuous voiceless air before the vowel starts.",
        },
        {
          target: "whether / together / although",
          ipa: "/ˈwɛðɚ/ • /təˈɡɛðɚ/ • /ɔlˈðoʊ/",
          mistakeIpa: "/ˈwɛdɚ/ • /təˈɡɛdɚ/ • /ɔlˈdoʊ/",
          note: "Keep the tongue tip lightly touching the upper teeth while humming.",
        },
      ],
    },
    exercises: [
      {
        id: "ex_th_1",
        lessonId: "lesson_th_contrasts",
        skillId: "th_sounds",
        targetAccent: "en-US",
        stepOrder: 1,
        lessonStage: "words",
        exerciseType: "minimal_pairs",
        difficulty: "Foundation",
        promptText: "Three vs Tree • Think vs Sink • They vs Day • Breathe vs Breeze",
        targetIpa: "/θɹi/ vs /tɹi/ • /θɪŋk/ vs /sɪŋk/ • /ðeɪ/ vs /deɪ/ • /bɹið/ vs /bɹiz/",
        coachingFocus: "Feel the tongue tip touch the upper teeth on the first word of every pair.",
      },
      {
        id: "ex_th_2",
        lessonId: "lesson_th_contrasts",
        skillId: "th_sounds",
        targetAccent: "en-US",
        stepOrder: 2,
        lessonStage: "sentences",
        exerciseType: "read_aloud",
        difficulty: "Intermediate",
        promptText:
          "Although they thought the third Thursday would be tough, they weathered the storm together.",
        targetIpa:
          "/ɔlˈðoʊ ðeɪ ˈθɔt ðə ˈθɝd ˈθɝzdeɪ wʊd bi ˈtʌf | ðeɪ ˈwɛðɚd ðə ˈstɔɹm təˈɡɛðɚ/",
        coachingFocus: "Alternate cleanly between voiced /ð/ and voiceless /θ/ without stopping airflow.",
      },
    ],
  },
];
