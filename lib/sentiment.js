// lib/sentiment.js
export function analyzeSentiment(message) {
  if (!message || typeof message !== "string") {
    return { label: "neutral", score: 0 };
  }

  const msg = message.toLowerCase();

  // Positive phrases and weights
  const positivePhrases = {
    "well maintained": 3,
    "very clean": 3,
    "helpful staff": 3,
    "supportive staff": 3,
    "friendly staff": 2,
    "prompt response": 2,
    "excellent service": 3,
    "great experience": 3,
    "comfortable environment": 2,
    "smooth process": 2,
    "productive session": 2,
    "highly recommended": 3,
    "efficient system": 2,
    organized: 1,
    encouraging: 2,
    "easy to access": 2,
    "safe environment": 2,
    motivated: 2,
    "innovative solution": 2,
    "reliable staff": 2,
    "quick response": 2,
    "clean environment": 2,
    "quiet library": 3,
    "good canteen": 2,
    "helpful lecturer": 3,
    "smooth registration": 2,
    "well equipped lab": 2,
    "comfortable hostel": 2,
    "on-time lecture": 1,
    "accessible resources": 2,
    "successful exam": 2,
  };

  const positiveWords = {
    good: 1,
    great: 1,
    excellent: 2,
    amazing: 2,
    love: 2,
    happy: 1,
    wonderful: 2,
    fantastic: 2,
    awesome: 2,
    positive: 1,
    nice: 1,
    brilliant: 2,
    enjoy: 1,
    best: 2,
    helpful: 1,
    supportive: 1,
    friendly: 1,
    clean: 1,
    organized: 1,
    efficient: 1,
    prompt: 1,
    encouraging: 1,
    motivated: 1,
    accessible: 1,
    comfortable: 1,
    smooth: 1,
    improved: 2,
    satisfied: 1,
    successful: 1,
    productive: 1,
    creative: 1,
    innovative: 1,
    reliable: 1,
    inspiring: 2,
    enjoyable: 1,
    valuable: 1,
    convenient: 1,
    effective: 2,
    welcoming: 2,
    quiet: 2,
    "on-time": 1,
    "well-equipped": 2,
    easy: 1,
  };

  // Negative phrases and weights
  const negativePhrases = {
    "poorly maintained": 3,
    "always noisy": 3,
    "staff is rude": 3,
    "staff unhelpful": 3,
    overcrowded: 2,
    "very crowded": 2,
    "extremely dirty": 3,
    "late response": 2,
    "hard to reach": 2,
    "inaccessible resources": 2,
    "confusing instructions": 2,
    "frustrating process": 2,
    "unorganized system": 2,
    "uncomfortable environment": 2,
    "poor service": 3,
    "bad experience": 3,
    "difficult to access": 2,
    "long wait": 2,
    disappointing: 2,
    "noisy library": 3,
    "dirty hostel": 3,
    "bad canteen": 2,
    "late lecture": 2,
    "unhelpful lecturer": 3,
    "exam stressful": 2,
    "poorly equipped lab": 2,
    "registration chaotic": 2,
    "crowded lecture hall": 2,
  };

  const negativeWords = {
    bad: 1,
    poor: 1,
    terrible: 2,
    hate: 2,
    sad: 1,
    angry: 1,
    horrible: 2,
    awful: 2,
    worst: 2,
    negative: 1,
    annoying: 1,
    boring: 1,
    disappoint: 2,
    problem: 1,
    noisy: 2,
    unhelpful: 1,
    crowded: 1,
    overcrowded: 2,
    dirty: 2,
    slow: 1,
    late: 1,
    confusing: 1,
    frustrating: 2,
    broken: 2,
    rude: 2,
    inefficient: 1,
    unorganized: 1,
    uncomfortable: 1,
    inaccessible: 2,
    unreliable: 1,
    stressful: 2,
    difficult: 1,
    messy: 1,
    unfair: 2,
    incomplete: 1,
    inconvenient: 1,
    unfriendly: 2,
    unacceptable: 2,
    disappointing: 2,
    unresponsive: 2,
    chaotic: 2,
  };

  const negations = [
    "not",
    "never",
    "no",
    "none",
    "cannot",
    "can't",
    "hardly",
    "rarely",
    "never ever",
    "not very",
    "not at all",
  ];

  let score = 0;

  // Multi-word phrase handling
  Object.entries(positivePhrases).forEach(([phrase, weight]) => {
    if (msg.includes(phrase)) score += weight;
  });

  Object.entries(negativePhrases).forEach(([phrase, weight]) => {
    if (msg.includes(phrase)) score -= weight;
  });

  const words = msg.split(/\s+/);
  let negationActive = false;

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    for (let neg of negations.sort(
      (a, b) => b.split(" ").length - a.split(" ").length
    )) {
      const negWords = neg.split(" ");
      const segment = words.slice(i, i + negWords.length).join(" ");
      if (segment === neg) {
        negationActive = true;
        i += negWords.length - 1;
        break;
      }
    }

    if (positiveWords[word]) {
      score += negationActive ? -positiveWords[word] : positiveWords[word];
      negationActive = false;
      continue;
    }

    if (negativeWords[word]) {
      score += negationActive ? negativeWords[word] : -negativeWords[word];
      negationActive = false;
      continue;
    }

    negationActive = false;
  }

  let label = "neutral";
  if (score > 1) label = "positive";
  else if (score < -1) label = "negative";

  return { label, score };
}
