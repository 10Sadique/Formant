export interface AnchorWord {
  word: string;
  ipa: string;
  meaningOrContext?: string;
}

export interface PracticePhrase {
  phrase: string;
  phoneticBreakdown: string;
  tip: string;
}

export interface MouthMechanics {
  tongue: string;
  vocalCords: string;
  lipsAndJaw: string;
  goldenRule: string;
}

export interface PhoneticEntry {
  id: string;
  symbol: string;
  plainName: string;
  category: "r_and_vowels" | "consonants_th" | "connected_speech" | "prosody";
  categoryLabel: string;
  summary: string;
  whyItMattersForNonNatives: string;
  mouthMechanics: MouthMechanics;
  anchorWords: AnchorWord[];
  practicePhrases: PracticePhrase[];
  nativePitfalls: string[];
}

export const PHONETIC_ENTRIES: PhoneticEntry[] = [
  {
    id: "american_r",
    symbol: "/ɹ, ɝ, ɚ/",
    plainName: "American Rhotic R & R-Colored Vowels",
    category: "r_and_vowels",
    categoryLabel: "American R & Vowels",
    summary:
      "The hallmark sound of General American English. Unlike the tapped or rolled 'R' found in Spanish, Hindi, Bengali, Arabic, or Italian, the American 'R' never touches or taps the roof of the mouth.",
    whyItMattersForNonNatives:
      "Tapping or rolling the R is the #1 acoustic cue that identifies a foreign accent. Mastering the bunched or retroflex position gives your speech an immediate, authentic American resonance.",
    mouthMechanics: {
      tongue:
        "Pull your tongue body backward and bunch the sides tightly against your upper back molars. Alternatively, curl the tongue tip slightly upward into the hollow of your palate without touching anywhere.",
      vocalCords: "Vibrating (Voiced)",
      lipsAndJaw:
        "Lips slightly flared or squared (slight pucker); jaw moderately open. Do not let your tongue tip tap the front teeth.",
      goldenRule:
        "The tongue floats freely in the mouth—zero contact with the roof or teeth.",
    },
    anchorWords: [
      { word: "red", ipa: "/ɹɛd/", meaningOrContext: "Initial consonantal /ɹ/" },
      { word: "bird", ipa: "/bɝd/", meaningOrContext: "Stressed vowel /ɝ/ (nurse vowel)" },
      { word: "water", ipa: "/ˈwɑː.ɾɚ/", meaningOrContext: "Unstressed ending /ɚ/ (schwa-R)" },
      { word: "further", ipa: "/ˈfɝ.ðɚ/", meaningOrContext: "Both stressed /ɝ/ and unstressed /ɚ/" },
      { word: "quarter", ipa: "/ˈkwɔːɹ.ɾɚ/", meaningOrContext: "R-colored vowel + flap T" },
    ],
    practicePhrases: [
      {
        phrase: "We work further every quarter.",
        phoneticBreakdown: "wiː wɝk ˈfɝ.ðɚ ˈɛv.ɹi ˈkwɔːɹ.ɾɚ",
        tip: "Keep the tongue bunched throughout 'work', 'further', and 'quarter'.",
      },
      {
        phrase: "Red cars drive near the river.",
        phoneticBreakdown: "ɹɛd kɑːɹz dɹaɪv nɪɹ ðə ˈɹɪv.ɚ",
        tip: "Sustain the hollow R resonance at the ends of 'cars', 'near', and 'river'.",
      },
    ],
    nativePitfalls: [
      "Tapping the tongue tip on the alveolar ridge (sounds like Spanish 'pero' or Hindi 'र').",
      "Dropping the R at the end of syllables (British/non-rhotic 'wat-ah' instead of 'water').",
      "Confusing /w/ and /ɹ/ (saying 'wed' instead of 'red').",
    ],
  },
  {
    id: "connected_speech_linking",
    symbol: "C‿V",
    plainName: "Consonant-to-Vowel Resyllabification (Smooth Linking)",
    category: "connected_speech",
    categoryLabel: "Connected Speech",
    summary:
      "When a word ending in a consonant sound (C) is followed by a word beginning with a vowel sound (V), the consonant attaches directly to the vowel like a single word.",
    whyItMattersForNonNatives:
      "Non-native speakers often pause between words or insert abrupt glottal stops. Linking creates the fluid, effortless melody native English listeners rely on for easy comprehension.",
    mouthMechanics: {
      tongue:
        "Flow continuously into the vowel position without stopping the breath stream.",
      vocalCords: "Varies / Context-dependent",
      lipsAndJaw:
        "Maintain uninterrupted voicing and airflow across the word boundary.",
      goldenRule:
        "Treat the consonant as the first letter of the following word ('hold on' → 'hol-don').",
    },
    anchorWords: [
      { word: "hold on", ipa: "/hoʊl.dɑːn/", meaningOrContext: "Spoken as 'hol-don'" },
      { word: "read a book", ipa: "/ɹiː.də.bʊk/", meaningOrContext: "Spoken as 'ree-da-book'" },
      { word: "turn off", ipa: "/tɝ.nɔːf/", meaningOrContext: "Spoken as 'tur-noff'" },
      { word: "an apple", ipa: "/ə.næp.əl/", meaningOrContext: "Spoken as 'a-napple'" },
      { word: "pick it up", ipa: "/pɪ.kɪ.ɾʌp/", meaningOrContext: "Spoken as 'pi-ki-tup'" },
    ],
    practicePhrases: [
      {
        phrase: "Hold on, read a book, and turn off the light.",
        phoneticBreakdown: "hoʊl‿dɑːn, ɹiː‿də bʊk, ænd tɝn‿ɔːf ðə laɪt",
        tip: "Pronounce it in one continuous breath: 'hol-don, ree-da-book, an tur-noff'.",
      },
      {
        phrase: "Turn it on and pick it up right now.",
        phoneticBreakdown: "tɝ‿nɪ‿ɾɑːn ænd pɪ‿kɪ‿ɾʌp ɹaɪt naʊ",
        tip: "Double linking: 'tur-ni-tahn' and 'pi-ki-tup'.",
      },
    ],
    nativePitfalls: [
      "Stopping air with a glottal stop between words (saying 'hold... on' with a choppy pause).",
      "Treating written space on the page as silence in speech.",
    ],
  },
  {
    id: "dental_fricatives_th",
    symbol: "/θ/ & /ð/",
    plainName: "Unvoiced vs. Voiced 'TH' Dental Fricatives",
    category: "consonants_th",
    categoryLabel: "Consonants & TH",
    summary:
      "English has two distinct sounds written with 'th': unvoiced /θ/ (whispered air, no vocal vibration) and voiced /ð/ (vocal cords buzz).",
    whyItMattersForNonNatives:
      "Most world languages lack dental fricatives. Learners frequently substitute /s/, /t/, /z/, or /d/, turning 'think' into 'sink' or 'tink', and 'this' into 'dis' or 'zis'.",
    mouthMechanics: {
      tongue:
        "Gently place the tip of your tongue between your upper and lower front teeth (or against the back of your top teeth). Allow air to flow smoothly through the gap.",
      vocalCords:
        "For /θ/ (think, bath): SILENT (pure air). For /ð/ (this, mother): VIBRATING (buzz like a bee).",
      lipsAndJaw:
        "Jaw relaxed; lips gently parted. Do not bite down hard on the tongue.",
      goldenRule:
        "Touch your throat with your hand: feel zero vibration for /θ/ (think), but feel strong buzzing for /ð/ (this).",
    },
    anchorWords: [
      { word: "think", ipa: "/θɪŋk/", meaningOrContext: "Unvoiced /θ/ (no vibration)" },
      { word: "this", ipa: "/ðɪs/", meaningOrContext: "Voiced /ð/ (vocal cords buzz)" },
      { word: "three", ipa: "/θɹiː/", meaningOrContext: "Unvoiced /θ/ + American /ɹ/" },
      { word: "breathe", ipa: "/bɹiːð/", meaningOrContext: "Voiced /ð/ at end of word" },
      { word: "teeth", ipa: "/tiːθ/", meaningOrContext: "Unvoiced /θ/ at end of word" },
    ],
    practicePhrases: [
      {
        phrase: "I think this mother thought of three things.",
        phoneticBreakdown: "aɪ θɪŋk ðɪs ˈmʌð.ɚ θɔːt əv θɹiː θɪŋz",
        tip: "Notice the alternating pattern: think (/θ/) → this (/ð/) → mother (/ð/) → thought (/θ/) → three (/θ/) → things (/θ/).",
      },
      {
        phrase: "They breathe through their mouth.",
        phoneticBreakdown: "ðeɪ bɹiːð θɹuː ðɛɹ maʊθ",
        tip: "'They' and 'their' buzz (/ð/); 'through' and 'mouth' are pure air (/θ/).",
      },
    ],
    nativePitfalls: [
      "Saying 's' or 't' instead of /θ/ ('sink' instead of 'think').",
      "Saying 'z' or 'd' instead of /ð/ ('dis' or 'zis' instead of 'this').",
      "Clamping teeth so tight that air cannot escape continuously.",
    ],
  },
  {
    id: "alveolar_flap_t",
    symbol: "/ɾ/",
    plainName: "The American Flap T / Alveolar Tap",
    category: "consonants_th",
    categoryLabel: "Consonants & TH",
    summary:
      "When the letter 't' or 'd' appears between two vowels (with the second vowel unstressed), Americans do not pronounce a crisp /t/. Instead, the tongue tip quickly taps the roof of the mouth once, sounding like a soft, fast 'd'.",
    whyItMattersForNonNatives:
      "Pronouncing a sharp, aspirated /t/ in words like 'water' or 'city' sounds formal or British. The flap T makes your conversational rhythm fluid and natural.",
    mouthMechanics: {
      tongue:
        "A single, ultra-fast upward tap of the tongue tip against the alveolar ridge (just behind top front teeth). It rebounds immediately.",
      vocalCords: "Vibrating (Voiced)",
      lipsAndJaw: "Relaxed, moving smoothly into the following vowel sound.",
      goldenRule: "Do not stop the air completely. Think of it as a momentary tap.",
    },
    anchorWords: [
      { word: "water", ipa: "/ˈwɑː.ɾɚ/", meaningOrContext: "Sounds like 'wah-der'" },
      { word: "butter", ipa: "/ˈbʌ.ɾɚ/", meaningOrContext: "Sounds like 'buh-der'" },
      { word: "city", ipa: "/ˈsɪ.ɾi/", meaningOrContext: "Sounds like 'sih-dee'" },
      { word: "bottle", ipa: "/ˈbɑː.ɾəl/", meaningOrContext: "Sounds like 'bah-del'" },
      { word: "better", ipa: "/ˈbɛ.ɾɚ/", meaningOrContext: "Sounds like 'beh-der'" },
    ],
    practicePhrases: [
      {
        phrase: "Get a better bottle of water in the city.",
        phoneticBreakdown: "ɡɛ.ɾə ˈbɛ.ɾɚ ˈbɑː.ɾəl əv ˈwɑː.ɾɚ ɪn ðə ˈsɪ.ɾi",
        tip: "Five flap T sounds in a row! Every 't' is a quick tap.",
      },
      {
        phrase: "Write a letter later today.",
        phoneticBreakdown: "ɹaɪ.ɾə ˈlɛ.ɾɚ ˈleɪ.ɾɚ təˈdeɪ",
        tip: "'Write a' links with a flap, followed by 'letter' and 'later'.",
      },
    ],
    nativePitfalls: [
      "Releasing a loud puff of air on the T (/tʰ/) in the middle of words.",
      "Dropping the T completely or replacing it with an abrupt pause.",
    ],
  },
  {
    id: "voiced_final_consonants",
    symbol: "/z, d, v/",
    plainName: "Voiced Final Consonants & Suffix Rules (-s, -ed)",
    category: "consonants_th",
    categoryLabel: "Consonants & TH",
    summary:
      "In English, final consonants maintain their vocal cord vibration. Furthermore, plural/verb '-s' is pronounced /z/ after voiced sounds, and '-ed' is pronounced /d/ after voiced sounds.",
    whyItMattersForNonNatives:
      "Many languages (German, Russian, Polish, Bengali, Turkish) automatically devoice final consonants (turning /z/ into /s/, /d/ into /t/, /v/ into /f/). This can confuse words like 'bed' (long vowel) and 'bet' (short vowel).",
    mouthMechanics: {
      tongue:
        "Maintain the consonant shape while keeping your vocal cords buzzing until the sound finishes.",
      vocalCords: "Vibrating (Voiced)",
      lipsAndJaw:
        "Hold the preceding vowel ~30% longer before voiced consonants than before unvoiced ones.",
      goldenRule:
        "Vowels are noticeably longer before voiced consonants: compare the vowel length in 'bad' (long) vs 'bat' (short).",
    },
    anchorWords: [
      { word: "dogs", ipa: "/dɔːɡz/", meaningOrContext: "'-s' after voiced /ɡ/ is pronounced /z/" },
      { word: "played", ipa: "/pleɪd/", meaningOrContext: "'-ed' after vowel is pronounced /d/" },
      { word: "live", ipa: "/lɪv/", meaningOrContext: "Vocal cords buzz through the final /v/" },
      { word: "bad", ipa: "/bæd/", meaningOrContext: "Vowel is held longer than in 'bat'" },
      { word: "buzz", ipa: "/bʌz/", meaningOrContext: "Continuous vocal cord vibration" },
    ],
    practicePhrases: [
      {
        phrase: "The dogs played in the leaves.",
        phoneticBreakdown: "ðə dɔːɡz pleɪd ɪn ðə liːvz",
        tip: "Notice the three voiced endings: dogs (/z/), played (/d/), leaves (/z/).",
      },
      {
        phrase: "He lived five lives with courage.",
        phoneticBreakdown: "hiː lɪvd faɪv laɪvz wɪð ˈkɝ.ɪdʒ",
        tip: "Keep vocal cords vibrating through 'lived', 'five', and 'lives'.",
      },
    ],
    nativePitfalls: [
      "Pronouncing '-s' as 's' after vowels and voiced consonants ('play-ss' instead of 'play-z').",
      "Shortening vowels before /d/ and /b/, making 'bed' sound identical to 'bet'.",
    ],
  },
  {
    id: "vowel_trap_vs_dress",
    symbol: "/æ/ vs /ɛ/",
    plainName: "The 'Trap' vs. 'Dress' Front Vowel Contrast",
    category: "r_and_vowels",
    categoryLabel: "American R & Vowels",
    summary:
      "A critical contrast between the low, wide-open vowel /æ/ (as in 'cat', 'bad', 'apple') and the mid, neutral vowel /ɛ/ (as in 'bed', 'pen', 'red').",
    whyItMattersForNonNatives:
      "Many language phonologies have only one mid-front vowel. Confusing /æ/ and /ɛ/ causes misunderstandings between 'man' and 'men', 'pan' and 'pen', 'bad' and 'bed'.",
    mouthMechanics: {
      tongue:
        "For /æ/: Tongue is flat and low in the mouth, tongue body slightly forward. For /ɛ/: Tongue rests in the middle.",
      vocalCords: "Vibrating (Voiced)",
      lipsAndJaw:
        "For /æ/: Open jaw wide, mouth corners pulled back slightly into a subtle grin. For /ɛ/: Jaw is only moderately open.",
      goldenRule: "If your jaw isn't dropping significantly lower, you are not saying /æ/.",
    },
    anchorWords: [
      { word: "cat", ipa: "/kæt/", meaningOrContext: "Open jaw /æ/" },
      { word: "bed", ipa: "/bɛd/", meaningOrContext: "Mid relaxed /ɛ/" },
      { word: "man / men", ipa: "/mæn/ vs /mɛn/", meaningOrContext: "Singular /æ/ vs plural /ɛ/" },
      { word: "bad / bed", ipa: "/bæd/ vs /bɛd/", meaningOrContext: "Low open /æ/ vs mid /ɛ/" },
      { word: "pan / pen", ipa: "/pæn/ vs /pɛn/", meaningOrContext: "Kitchen pan vs writing pen" },
    ],
    practicePhrases: [
      {
        phrase: "The bad man had a red pen in bed.",
        phoneticBreakdown: "ðə bæd mæn hæd ə ɹɛd pɛn ɪn bɛd",
        tip: "Alternates between open /æ/ ('bad, man, had') and relaxed /ɛ/ ('red, pen, bed').",
      },
    ],
    nativePitfalls: [
      "Keeping the jaw too closed on /æ/, making 'apple' sound like 'epple'.",
    ],
  },
  {
    id: "vowel_kit_vs_fleece",
    symbol: "/ɪ/ vs /iː/",
    plainName: "Short Lax /ɪ/ vs. Tense Long /iː/",
    category: "r_and_vowels",
    categoryLabel: "American R & Vowels",
    summary:
      "The contrast between relaxed, short /ɪ/ (as in 'ship', 'fit', 'live') and tense, prolonged /iː/ (as in 'sheep', 'feet', 'leave').",
    whyItMattersForNonNatives:
      "This is one of the most famous stumbling blocks in English pronunciation, with embarrassing pitfalls (e.g. confusing 'sheet' with 'shit', 'beach' with 'bitch').",
    mouthMechanics: {
      tongue:
        "For /iː/: Tongue is high and tense, pushing toward the front roof of the mouth. For /ɪ/: Tongue muscles are relaxed and slightly lower.",
      vocalCords: "Vibrating (Voiced)",
      lipsAndJaw:
        "For /iː/: Lips spread wide into a tight smile. For /ɪ/: Lips and jaw are completely relaxed and neutral.",
      goldenRule: "/iː/ is tense and spread like a smile; /ɪ/ is completely relaxed and shorter.",
    },
    anchorWords: [
      { word: "ship / sheep", ipa: "/ʃɪp/ vs /ʃiːp/", meaningOrContext: "Short lax /ɪ/ vs tense /iː/" },
      { word: "sit / seat", ipa: "/sɪt/ vs /siːt/", meaningOrContext: "Action to sit vs the chair seat" },
      { word: "fit / feet", ipa: "/fɪt/ vs /fiːt/", meaningOrContext: "Clothing fit vs body feet" },
      { word: "live / leave", ipa: "/lɪv/ vs /liːv/", meaningOrContext: "Where you live vs to leave" },
    ],
    practicePhrases: [
      {
        phrase: "Please leave the ship and take a seat.",
        phoneticBreakdown: "pliːz liːv ðə ʃɪp ænd teɪk ə siːt",
        tip: "Tense /iː/ ('please, leave, seat') vs relaxed /ɪ/ ('ship').",
      },
    ],
    nativePitfalls: [
      "Making /ɪ/ too tense, turning 'it' into 'eat' or 'bitch' into 'beach'.",
    ],
  },
  {
    id: "prosodic_stress_marks",
    symbol: "ˈ and ˌ",
    plainName: "Primary (ˈ) & Secondary (ˌ) Syllable Stress",
    category: "prosody",
    categoryLabel: "Stress & Rhythm",
    summary:
      "In phonetic transcriptions, the high vertical mark (ˈ) comes immediately BEFORE the syllable that receives primary stress. The low mark (ˌ) marks secondary stress.",
    whyItMattersForNonNatives:
      "English is a stress-timed language. Stressed syllables are spoken louder, held significantly longer, and peak in musical pitch. Unstressed syllables shrink to a tiny, quiet schwa (/ə/).",
    mouthMechanics: {
      tongue: "Takes its time on the stressed vowel; rushes through unstressed syllables.",
      vocalCords: "Changes pitch: pitches go higher on the stressed syllable.",
      lipsAndJaw: "Full, clear mouth opening on the stressed vowel; minimal opening on unstressed.",
      goldenRule:
        "Do not give equal duration to every syllable. Make stressed syllables long and high; make unstressed syllables fast and quiet.",
    },
    anchorWords: [
      { word: "ˈrecord", ipa: "/ˈɹɛk.ɚd/", meaningOrContext: "Noun (stress on 1st syllable)" },
      { word: "reˈcord", ipa: "/ɹɪˈkɔːɹd/", meaningOrContext: "Verb (stress on 2nd syllable)" },
      { word: "ˈpresent", ipa: "/ˈpɹɛz.ənt/", meaningOrContext: "Noun (gift) vs verb" },
      { word: "preˈsent", ipa: "/pɹɪˈzɛnt/", meaningOrContext: "Verb (to show)" },
    ],
    practicePhrases: [
      {
        phrase: "I will reˈcord a new ˈrecord toˈday.",
        phoneticBreakdown: "aɪ wɪl ɹɪˈkɔːɹd ə nuː ˈɹɛk.ɚd təˈdeɪ",
        tip: "Hear the contrast between the verb 're-CORD' and the noun 'REC-ord'.",
      },
    ],
    nativePitfalls: [
      "Giving equal syllable timing to every syllable (machine-gun rhythm).",
      "Stressing the wrong syllable, which makes words unintelligible to native listeners.",
    ],
  },
  {
    id: "glottal_stop",
    symbol: "/ʔ/",
    plainName: "The American Glottal Stop (Held T before N)",
    category: "consonants_th",
    categoryLabel: "Consonants & TH",
    summary:
      "When the letter 't' is followed immediately by an unstressed /n/ syllable, Americans do not pronounce a sharp /t/ or a flap T. Instead, the vocal cords briefly snap shut, creating a silent pause in the throat.",
    whyItMattersForNonNatives:
      "Trying to articulate a full crisp /t/ in 'button' or 'mountain' sounds unnatural and stiff. Mastering the held throat catch makes American English sound relaxed and native.",
    mouthMechanics: {
      tongue: "Tongue tip stays on or moves toward the roof of the mouth without releasing air.",
      vocalCords: "Vocal cords snap tightly shut for an instant, blocking all airflow.",
      lipsAndJaw: "Mouth stays relaxed while the voice drops out momentarily.",
      goldenRule: "The stop is created deep in the throat, exactly like saying 'uh-oh'.",
    },
    anchorWords: [
      { word: "button", ipa: "/ˈbʌʔ.n̩/", meaningOrContext: "Spoken with throat catch" },
      { word: "mountain", ipa: "/ˈmaʊnʔ.n̩/", meaningOrContext: "Spoken with throat catch" },
      { word: "curtain", ipa: "/ˈkɝʔ.n̩/", meaningOrContext: "Spoken with throat catch" },
      { word: "fitness", ipa: "/ˈfɪʔ.nɪs/", meaningOrContext: "Held T before nasal N" },
      { word: "important", ipa: "/ɪmˈpɔːɹʔ.nt/", meaningOrContext: "Final syllable reduction" },
    ],
    practicePhrases: [
      {
        phrase: "Push the button on the mountain curtain.",
        phoneticBreakdown: "pʊʃ ðə ˈbʌʔ.n̩ ɑːn ðə ˈmaʊnʔ.n̩ ˈkɝʔ.n̩",
        tip: "Catch the air in your throat on 'button', 'mountain', and 'curtain'.",
      },
    ],
    nativePitfalls: [
      "Pronouncing a heavy aspirated 't' ('buh-TEN', 'moun-TAYN').",
      "Omitting the syllable entirely without catching the airflow.",
    ],
  },
  {
    id: "schwa_vowel",
    symbol: "/ə/",
    plainName: "The Neutral Schwa & Function Word Reduction",
    category: "r_and_vowels",
    categoryLabel: "American R & Vowels",
    summary:
      "The most common vowel sound in spoken English. It is an ultra-short, lazy, neutral vowel. In natural speech, unstressed function words like 'to', 'for', 'can', 'and', 'at' reduce to schwa.",
    whyItMattersForNonNatives:
      "Pronouncing every small grammatical word with its dictionary full vowel ('CAN', 'TO', 'FOR') destroys the natural rhythm of American English and tires your mouth muscles.",
    mouthMechanics: {
      tongue: "Completely relaxed, resting dead center in the mouth.",
      vocalCords: "Vibrating (Voiced), but very brief and quiet.",
      lipsAndJaw: "Zero effort: jaw barely open, lips completely limp.",
      goldenRule: "Schwa takes almost zero energy: think of a tiny, effortless grunt.",
    },
    anchorWords: [
      { word: "about", ipa: "/əˈbaʊt/", meaningOrContext: "Unstressed initial schwa" },
      { word: "sofa", ipa: "/ˈsoʊ.fə/", meaningOrContext: "Unstressed final schwa" },
      { word: "to go", ipa: "/tə ɡoʊ/", meaningOrContext: "'to' reduces to /tə/" },
      { word: "can do", ipa: "/kən duː/", meaningOrContext: "'can' reduces to /kən/" },
      { word: "cup of tea", ipa: "/kʌp əv tiː/", meaningOrContext: "'of' reduces to /əv/" },
    ],
    practicePhrases: [
      {
        phrase: "I can go to the store for a minute.",
        phoneticBreakdown: "aɪ kən ɡoʊ tə ðə stɔːɹ fɚ ə ˈmɪn.ɪt",
        tip: "'can', 'to', 'the', 'for', and 'a' all reduce to tiny unstressed vowels.",
      },
    ],
    nativePitfalls: [
      "Over-pronouncing function words with full spelling vowels ('I CAN GO TO THE STORE').",
    ],
  },
  {
    id: "palatal_assimilation",
    symbol: "T‿Y & D‿Y",
    plainName: "Palatal Assimilation in Connected Speech (/tʃ/, /dʒ/)",
    category: "connected_speech",
    categoryLabel: "Connected Speech",
    summary:
      "When a word ending in /t/ or /d/ is followed immediately by 'you' or 'your' (/j/), the two sounds fuse into /tʃ/ ('ch') or /dʒ/ ('j').",
    whyItMattersForNonNatives:
      "This natural assimilation is used by native American speakers in almost every conversational question and request.",
    mouthMechanics: {
      tongue: "Tongue blade glides into the palate, producing the 'ch' or 'j' affricate.",
      vocalCords: "/t/ + /j/ produces voiceless /tʃ/; /d/ + /j/ produces voiced /dʒ/.",
      lipsAndJaw: "Lips slightly rounded into the affricate release.",
      goldenRule: "'don't you' becomes 'don-choo'; 'did you' becomes 'did-juh'.",
    },
    anchorWords: [
      { word: "did you", ipa: "/ˈdɪdʒ.ə/", meaningOrContext: "Sounds like 'did-juh'" },
      { word: "don't you", ipa: "/ˈdoʊn.tʃuː/", meaningOrContext: "Sounds like 'don-choo'" },
      { word: "got you", ipa: "/ˈɡɑː.tʃə/", meaningOrContext: "Sounds like 'got-cha'" },
      { word: "would you", ipa: "/ˈwʊdʒ.ə/", meaningOrContext: "Sounds like 'wood-juh'" },
      { word: "meet you", ipa: "/ˈmiː.tʃuː/", meaningOrContext: "Sounds like 'mee-choo'" },
    ],
    practicePhrases: [
      {
        phrase: "Did you know that I got you what you wanted?",
        phoneticBreakdown: "ˈdɪdʒə noʊ ðæt aɪ ˈɡɑːtʃə wʌtʃə ˈwɑːn.tɪd",
        tip: "Notice the natural rhythm: 'did-juh know that I got-chuh what-chuh wanted'.",
      },
    ],
    nativePitfalls: [
      "Sticking with separate staccato syllables with awkward pauses between words.",
    ],
  },
  {
    id: "aspirated_stops",
    symbol: "/pʰ, tʰ, kʰ/",
    plainName: "Voiceless Stop Aspiration (Puff of Air on P, T, K)",
    category: "consonants_th",
    categoryLabel: "Consonants & TH",
    summary:
      "In General American English, when voiceless stop consonants (/p/, /t/, /k/) start a stressed syllable, they MUST be released with a distinct puff of air (aspiration).",
    whyItMattersForNonNatives:
      "In languages like Hindi, French, Spanish, or Bengali, unaspirated /p/ and /k/ are common. In English, an unaspirated 'p' sounds to native ears like a 'b', causing 'pin' to sound like 'bin'.",
    mouthMechanics: {
      tongue: "For /t/ and /k/: Build up air pressure behind tongue seal, then release sharply.",
      vocalCords: "Vocal cords remain open until after the burst of air escapes.",
      lipsAndJaw: "For /p/: Lips seal tightly, building air pressure before bursting open.",
      goldenRule: "Hold a tissue paper in front of your mouth: it should blow outward on 'pen', 'top', and 'cat'.",
    },
    anchorWords: [
      { word: "pen", ipa: "/pʰɛn/", meaningOrContext: "Puff of air prevents sounding like 'ben'" },
      { word: "top", ipa: "/tʰɑːp/", meaningOrContext: "Puff of air prevents sounding like 'dop'" },
      { word: "cat", ipa: "/kʰæt/", meaningOrContext: "Puff of air prevents sounding like 'gat'" },
      { word: "paper", ipa: "/ˈpʰeɪ.pɚ/", meaningOrContext: "Strong initial aspiration" },
    ],
    practicePhrases: [
      {
        phrase: "Please put two clean coffee cups on top.",
        phoneticBreakdown: "pʰliːz pʰʊt tʰuː kʰliːn ˈkʰɔː.fi kʰʌps ɑːn tʰɑːp",
        tip: "Every initial P, T, K releases a crisp puff of air.",
      },
    ],
    nativePitfalls: [
      "Releasing stops without air, making 'pat' sound like 'bat' or 'pie' sound like 'buy'.",
    ],
  },
];

/**
 * Resolves a search term or skillId to a matching PhoneticEntry.
 */
export function resolveSoundEntry(queryOrSkillId: string): PhoneticEntry | undefined {
  if (!queryOrSkillId) return undefined;
  const q = queryOrSkillId.toLowerCase().trim();

  // Direct ID match
  const byId = PHONETIC_ENTRIES.find((e) => e.id === q);
  if (byId) return byId;

  // Skill ID mapping
  if (q.includes("am_r") || q.includes("rhotic")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "american_r");
  }
  if (q.includes("linking")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "connected_speech_linking");
  }
  if (q.includes("flap_t") || q.includes("tap")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "alveolar_flap_t");
  }
  if (q.includes("th_sounds") || q.includes("th_contrast") || q === "th") {
    return PHONETIC_ENTRIES.find((e) => e.id === "dental_fricatives_th");
  }
  if (q.includes("final") || q.includes("voiced")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "voiced_final_consonants");
  }
  if (q.includes("vowel_contrasts") || q.includes("trap") || q.includes("dress")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "vowel_trap_vs_dress");
  }
  if (q.includes("kit") || q.includes("fleece") || q.includes("tense_lax")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "vowel_kit_vs_fleece");
  }
  if (q.includes("stress") || q.includes("rhythm") || q.includes("prosody") || q.includes("npvi")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "prosodic_stress_marks");
  }
  if (q.includes("glottal") || q.includes("button")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "glottal_stop");
  }
  if (q.includes("schwa") || q.includes("reduction")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "schwa_vowel");
  }
  if (q.includes("assimilation") || q.includes("palatal")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "palatal_linking");
  }
  if (q.includes("aspiration") || q.includes("stops")) {
    return PHONETIC_ENTRIES.find((e) => e.id === "aspirated_stops");
  }

  // Symbol or plain name partial search
  return PHONETIC_ENTRIES.find(
    (e) =>
      e.symbol.toLowerCase().includes(q) ||
      e.plainName.toLowerCase().includes(q) ||
      e.anchorWords.some((w) => w.word.toLowerCase() === q)
  );
}

