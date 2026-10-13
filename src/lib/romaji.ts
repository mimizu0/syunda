/** Romaji matcher for Japanese typing games (Hepburn + common alternatives). */

const YOUON: Record<string, string[]> = {
  きゃ: ["kya", "kixa", "kilya"],
  きぃ: ["kyi", "kixi", "kili"],
  きゅ: ["kyu", "kixu", "kilyu"],
  きぇ: ["kye", "kixe", "kile", "kilye"],
  きょ: ["kyo", "kixo", "kilyo"],
  ぎゃ: ["gya", "gixa", "gilya"],
  ぎぃ: ["gyi", "gixi", "gili"],
  ぎゅ: ["gyu", "gixu", "gilyu"],
  ぎぇ: ["gye", "gixe", "gile"],
  ぎょ: ["gyo", "gixo", "gilyo"],
  しゃ: ["sha", "sya", "sixa", "silya", "shixa"],
  しぃ: ["syi", "sixi", "sili"],
  しゅ: ["shu", "syu", "sixu", "silyu"],
  しぇ: ["she", "sye", "sixe", "sile", "silye"],
  しょ: ["sho", "syo", "sixo", "silyo"],
  じゃ: ["ja", "jya", "zya", "jixa", "zilya"],
  じぃ: ["jyi", "zyi", "zixi"],
  じゅ: ["ju", "jyu", "zyu", "jixu"],
  じぇ: ["je", "jye", "zye", "jixe"],
  じょ: ["jo", "jyo", "zyo", "jixo"],
  ちゃ: ["cha", "tya", "cya", "tixa", "tilya"],
  ちぃ: ["tyi", "cyi", "tixi"],
  ちゅ: ["chu", "tyu", "cyu", "tixu"],
  ちぇ: ["che", "tye", "cye", "tixe"],
  ちょ: ["cho", "tyo", "cyo", "tixo", "tilyo"],
  ぢゃ: ["dya", "dixa"],
  ぢゅ: ["dyu", "dixu"],
  ぢょ: ["dyo", "dixo"],
  にゃ: ["nya", "nixa", "nilya"],
  にぃ: ["nyi", "nixi"],
  にゅ: ["nyu", "nixu", "nilyu"],
  にぇ: ["nye", "nixe"],
  にょ: ["nyo", "nixo", "nilyo"],
  ひゃ: ["hya", "hixa", "hilya"],
  ひぃ: ["hyi", "hixi"],
  ひゅ: ["hyu", "hixu", "hilyu"],
  ひぇ: ["hye", "hixe"],
  ひょ: ["hyo", "hixo", "hilyo"],
  びゃ: ["bya", "bixa", "bilya"],
  びゅ: ["byu", "bixu"],
  びょ: ["byo", "bixo"],
  ぴゃ: ["pya", "pixa", "pilya"],
  ぴゅ: ["pyu", "pixu"],
  ぴょ: ["pyo", "pixo"],
  みゃ: ["mya", "mixa", "milya"],
  みぃ: ["myi", "mixi"],
  みゅ: ["myu", "mixu"],
  みぇ: ["mye", "mixe"],
  みょ: ["myo", "mixo"],
  りゃ: ["rya", "rixa", "rilya"],
  りぃ: ["ryi", "rixi"],
  りゅ: ["ryu", "rixu"],
  りぇ: ["rye", "rixe"],
  りょ: ["ryo", "rixo", "rilyo"],
  ふぁ: ["fa", "hwa", "huxa", "fuxa"],
  ふぃ: ["fi", "hwi", "huxi", "fuxi", "fyi"],
  ふぇ: ["fe", "hwe", "huxe", "fuxe", "fye"],
  ふぉ: ["fo", "hwo", "huxo", "fuxo"],
  ふゅ: ["fyu", "huxyu"],
  てぃ: ["thi", "texi", "teli"],
  てゅ: ["thu", "texu"],
  でぃ: ["dhi", "dexi", "deli"],
  でゅ: ["dhu", "dexu"],
  とぅ: ["twu", "toxu", "tolu"],
  どぅ: ["dwu", "doxu"],
  うぁ: ["wha", "uxa"],
  うぃ: ["wi", "whi", "uxi", "uli"],
  うぇ: ["we", "whe", "uxe", "ule"],
  うぉ: ["who", "uxo", "ulo"],
  ゔぁ: ["va", "vuxa"],
  ゔぃ: ["vi", "vuxi", "vyi"],
  ゔぇ: ["ve", "vuxe", "vye"],
  ゔぉ: ["vo", "vuxo"],
  ゔゅ: ["vyu"],
  くぁ: ["qa", "kwa", "kuxa"],
  くぃ: ["qi", "kwi", "kuxi"],
  くぇ: ["qe", "kwe", "kuxe"],
  くぉ: ["qo", "kwo", "kuxo"],
};

const BASIC: Record<string, string[]> = {
  あ: ["a"],
  い: ["i", "yi"],
  う: ["u", "wu", "whu"],
  え: ["e"],
  お: ["o"],
  か: ["ka", "ca"],
  き: ["ki"],
  く: ["ku", "cu", "qu"],
  け: ["ke"],
  こ: ["ko", "co"],
  さ: ["sa"],
  し: ["shi", "si", "ci"],
  す: ["su"],
  せ: ["se", "ce"],
  そ: ["so"],
  た: ["ta"],
  ち: ["chi", "ti"],
  つ: ["tsu", "tu"],
  て: ["te"],
  と: ["to"],
  な: ["na"],
  に: ["ni"],
  ぬ: ["nu"],
  ね: ["ne"],
  の: ["no"],
  は: ["ha"],
  ひ: ["hi"],
  ふ: ["fu", "hu"],
  へ: ["he"],
  ほ: ["ho"],
  ま: ["ma"],
  み: ["mi"],
  む: ["mu"],
  め: ["me"],
  も: ["mo"],
  や: ["ya"],
  ゆ: ["yu"],
  よ: ["yo"],
  ら: ["ra"],
  り: ["ri"],
  る: ["ru"],
  れ: ["re"],
  ろ: ["ro"],
  わ: ["wa"],
  ゐ: ["wyi"],
  ゑ: ["wye"],
  を: ["wo", "o"],
  ん: ["n", "nn", "xn", "n'"],
  が: ["ga"],
  ぎ: ["gi"],
  ぐ: ["gu"],
  げ: ["ge"],
  ご: ["go"],
  ざ: ["za"],
  じ: ["ji", "zi"],
  ず: ["zu"],
  ぜ: ["ze"],
  ぞ: ["zo"],
  だ: ["da"],
  ぢ: ["di", "dyi"],
  づ: ["du", "dzu"],
  で: ["de"],
  ど: ["do"],
  ば: ["ba"],
  び: ["bi"],
  ぶ: ["bu"],
  べ: ["be"],
  ぼ: ["bo"],
  ぱ: ["pa"],
  ぴ: ["pi"],
  ぷ: ["pu"],
  ぺ: ["pe"],
  ぽ: ["po"],
  ぁ: ["xa", "la"],
  ぃ: ["xi", "li", "xyi", "lyi"],
  ぅ: ["xu", "lu"],
  ぇ: ["xe", "le", "xye", "lye"],
  ぉ: ["xo", "lo"],
  ゃ: ["xya", "lya"],
  ゅ: ["xyu", "lyu"],
  ょ: ["xyo", "lyo"],
  ゎ: ["xwa", "lwa"],
  っ: ["xtu", "ltu", "xtsu", "ltsu"],
  ゔ: ["vu"],
  ー: ["-"],
  "・": ["/"],
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const SINGLE_N_BLOCK = new Set(["a", "e", "i", "o", "u", "y"]);

export function toHiragana(input: string): string {
  let out = "";
  for (const ch of input) {
    const code = ch.codePointAt(0)!;
    if (code >= 0x30a1 && code <= 0x30f6) {
      out += String.fromCharCode(code - 0x60);
    } else {
      out += ch;
    }
  }
  return out;
}

export function normalizeReading(input: string): string {
  return toHiragana(input).replace(/[\s\u3000、。！？・「」『』（）()[\].,!?'"]/g, "");
}

export function isRomajiChar(ch: string): boolean {
  return /^[a-zA-Z'\-]$/.test(ch);
}

function lastVowel(spelling: string): string {
  for (let i = spelling.length - 1; i >= 0; i--) {
    if (VOWELS.has(spelling[i]!)) return spelling[i]!;
  }
  return "";
}

function unique(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    if (!item || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

function firstLetters(spellings: string[]): Set<string> {
  const set = new Set<string>();
  for (const s of spellings) {
    if (s[0]) set.add(s[0]);
  }
  return set;
}

type Unit = { unit: string; spellings: string[]; display: string };

function nextRawUnits(kana: string, prevVowel: string): Unit[] {
  if (!kana) return [];
  const units: Unit[] = [];
  const two = kana.slice(0, 2);
  if (kana.length >= 2 && YOUON[two]) {
    const spellings = YOUON[two]!;
    units.push({ unit: two, spellings, display: spellings[0]! });
  }
  const one = kana[0]!;
  if (one === "ー") {
    const spellings = unique(prevVowel ? [prevVowel, "-"] : ["-"]);
    units.push({ unit: one, spellings, display: spellings[0]! });
  } else if (one === "ん") {
    const rest = kana.slice(1);
    const follow = rest ? nextRawUnits(rest, "") : [];
    const followLetters = follow.length ? firstLetters(follow[0]!.spellings) : new Set<string>();
    let blockSingle = false;
    for (const letter of followLetters) {
      if (SINGLE_N_BLOCK.has(letter)) {
        blockSingle = true;
        break;
      }
    }
    const spellings = blockSingle ? ["nn", "xn", "n'"] : ["n", "nn", "xn", "n'"];
    units.push({ unit: one, spellings, display: spellings[0]! });
  } else if (BASIC[one]) {
    const spellings = BASIC[one]!;
    units.push({ unit: one, spellings, display: spellings[0]! });
  }
  return units;
}

function possibleUnits(kana: string, prevVowel: string): Unit[] {
  if (!kana) return [];
  if (kana[0] === "っ") {
    const rest = kana.slice(1);
    const extra: string[] = [];
    if (rest && rest[0] !== "っ") {
      const next = nextRawUnits(rest, prevVowel);
      for (const u of next) {
        for (const sp of u.spellings) {
          const c = sp[0];
          if (c && /[bcdfghjklmpqrstvwxyz]/.test(c)) extra.push(c);
        }
      }
    }
    const spellings = unique([...extra, "xtu", "ltu", "xtsu", "ltsu"]);
    return [{ unit: "っ", spellings, display: extra[0] ?? "xtu" }];
  }
  return nextRawUnits(kana, prevVowel);
}

export type AnalyzeStatus = "ok" | "prefix" | "mismatch";

export type AnalyzeResult = {
  status: AnalyzeStatus;
  kanaUsed: number;
  typedShown: string;
  restHint: string;
  complete: boolean;
};

type Search = {
  kind: "ok" | "prefix" | "fail";
  kanaUsed: number;
  typedUsed: number;
  prevVowel: string;
};

function better(a: Search, b: Search): Search {
  if (a.kind === "fail") return b;
  if (b.kind === "fail") return a;
  if (a.kind === "ok" && b.kind !== "ok") return a;
  if (b.kind === "ok" && a.kind !== "ok") return b;
  if (b.kanaUsed > a.kanaUsed) return b;
  if (b.kanaUsed === a.kanaUsed && b.typedUsed > a.typedUsed) return b;
  return a;
}

function search(kana: string, typed: string, prevVowel: string): Search {
  if (typed === "") {
    return { kind: kana === "" ? "ok" : "prefix", kanaUsed: 0, typedUsed: 0, prevVowel };
  }
  if (kana === "") return { kind: "fail", kanaUsed: 0, typedUsed: 0, prevVowel };

  let best: Search = { kind: "fail", kanaUsed: 0, typedUsed: 0, prevVowel };
  const units = possibleUnits(kana, prevVowel);
  for (const u of units) {
    const byLen = [...u.spellings].sort((x, y) => y.length - x.length);
    for (const sp of byLen) {
      if (typed.startsWith(sp)) {
        const sub = search(kana.slice(u.unit.length), typed.slice(sp.length), lastVowel(sp) || prevVowel);
        if (sub.kind === "fail") continue;
        best = better(best, {
          kind: sub.kind,
          kanaUsed: u.unit.length + sub.kanaUsed,
          typedUsed: sp.length + sub.typedUsed,
          prevVowel: sub.prevVowel,
        });
      } else if (sp.startsWith(typed)) {
        best = better(best, {
          kind: "prefix",
          kanaUsed: 0,
          typedUsed: typed.length,
          prevVowel,
        });
      }
    }
  }
  return best;
}

function preferredRest(kana: string, prevVowel: string, prefix: string): string {
  if (!kana) return "";
  const units = possibleUnits(kana, prevVowel);
  if (!units.length) return "";
  const first = units[0]!;
  let spelling = first.display;
  if (prefix) {
    const match = first.spellings.find((sp) => sp.startsWith(prefix));
    if (match) spelling = match;
    else return "";
  }
  const remainder = spelling.slice(prefix.length);
  const next = preferredRest(kana.slice(first.unit.length), lastVowel(spelling) || prevVowel, "");
  return remainder + next;
}

export function preferredRomaji(kana: string): string {
  return preferredRest(normalizeReading(kana), "", "");
}

export function analyze(reading: string, typed: string): AnalyzeResult {
  const kana = normalizeReading(reading);
  const input = typed.toLowerCase();
  const found = search(kana, input, "");
  if (found.kind === "fail") {
    return {
      status: "mismatch",
      kanaUsed: 0,
      typedShown: input,
      restHint: preferredRest(kana, "", ""),
      complete: false,
    };
  }
  const remainingKana = kana.slice(found.kanaUsed);
  const leftover = input.slice(found.typedUsed);
  const restHint = preferredRest(remainingKana, found.prevVowel, leftover);
  return {
    status: found.kind === "ok" ? "ok" : "prefix",
    kanaUsed: found.kanaUsed,
    typedShown: input,
    restHint,
    complete: found.kind === "ok" && remainingKana.length === 0,
  };
}

export function selfCheck(): void {
  const complete: [string, string][] = [
    ["すし", "sushi"],
    ["すし", "susi"],
    ["こんにちは", "konnichiha"],
    ["こんにちは", "konnitiha"],
    ["こんにちは", "konnnichiha"],
    ["がっこう", "gakkou"],
    ["がっこう", "gaxtukou"],
    ["しゃしん", "shashin"],
    ["しゃしん", "syasin"],
    ["てんき", "tenki"],
    ["ほん", "hon"],
    ["ほん", "honn"],
    ["ほんや", "honnya"],
    ["ほんや", "hon'ya"],
    ["を", "wo"],
    ["を", "o"],
    ["っち", "tti"],
    ["っち", "cchi"],
    ["とうきょう", "toukyou"],
    ["こーひー", "koohii"],
    ["こーひー", "ko-hi-"],
    ["じかん", "jikan"],
    ["じかん", "zikan"],
    ["ふね", "hune"],
    ["ふね", "fune"],
    ["きょう", "kyou"],
    ["しょうゆ", "shouyu"],
    ["ざっし", "zasshi"],
  ];
  for (const [kana, typed] of complete) {
    const result = analyze(kana, typed);
    if (!result.complete) {
      throw new Error(`expected complete: ${kana} / ${typed} → ${JSON.stringify(result)}`);
    }
  }
  const prefixes: [string, string][] = [
    ["すし", "su"],
    ["すし", "sush"],
    ["がっこう", "gak"],
  ];
  for (const [kana, typed] of prefixes) {
    const result = analyze(kana, typed);
    if (result.status !== "prefix" || result.complete) {
      throw new Error(`expected prefix: ${kana} / ${typed} → ${JSON.stringify(result)}`);
    }
  }
  const mismatches: [string, string][] = [
    ["すし", "sashimi"],
    ["ほんや", "honya"],
    ["とうきょう", "tokyo"],
    ["すし", "sa"],
  ];
  for (const [kana, typed] of mismatches) {
    const result = analyze(kana, typed);
    if (result.status !== "mismatch") {
      throw new Error(`expected mismatch: ${kana} / ${typed} → ${JSON.stringify(result)}`);
    }
  }
}
