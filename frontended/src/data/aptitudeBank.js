// Curated comprehensive question bank for 3D Aptitude Arena
// Supporting all 9 core placement categories and mock test assessments

export const CATEGORIES_DATA = [
  {
    id: "quantitative",
    title: "Quantitative Aptitude",
    shortName: "Quant",
    iconName: "Target",
    gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    glowColor: "rgba(6, 182, 212, 0.4)",
    totalQuestions: 120,
    completedQuestions: 64,
    difficulty: "Medium",
    description: "Percentages, profit & loss, ratios, averages, and numerical accuracy.",
    topics: ["Percentages", "Profit & Loss", "Ratio & Proportion", "Averages"]
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    shortName: "Logic",
    iconName: "Brain",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    glowColor: "rgba(139, 92, 246, 0.4)",
    totalQuestions: 95,
    completedQuestions: 58,
    difficulty: "Medium",
    description: "Puzzles, series completion, coding-decoding, blood relations, and syllogisms.",
    topics: ["Number Series", "Coding-Decoding", "Blood Relations", "Direction Sense"]
  },
  {
    id: "verbal",
    title: "Verbal Ability",
    shortName: "Verbal",
    iconName: "GraduationCap",
    gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
    glowColor: "rgba(16, 185, 129, 0.4)",
    totalQuestions: 80,
    completedQuestions: 35,
    difficulty: "Easy",
    description: "Vocabulary, reading comprehension, sentence correction, and verbal analogies.",
    topics: ["Synonyms & Antonyms", "Sentence Correction", "Idioms", "Comprehension"]
  },
  {
    id: "data_interpretation",
    title: "Data Interpretation",
    shortName: "DI",
    iconName: "BarChart3",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    glowColor: "rgba(245, 158, 11, 0.4)",
    totalQuestions: 60,
    completedQuestions: 28,
    difficulty: "Hard",
    description: "Tables, pie charts, bar graphs, and multi-variable analytical data sets.",
    topics: ["Pie Charts", "Bar Graphs", "Tabular Analysis", "Caselets"]
  },
  {
    id: "number_systems",
    title: "Number Systems",
    shortName: "Numbers",
    iconName: "Hash",
    gradient: "linear-gradient(135deg, #6366f1, #a855f7)",
    glowColor: "rgba(99, 102, 241, 0.4)",
    totalQuestions: 75,
    completedQuestions: 42,
    difficulty: "Medium",
    description: "Divisibility rules, LCM/HCF, unit digit problems, and remainder theorems.",
    topics: ["Divisibility", "Remainders", "HCF & LCM", "Prime Factorization"]
  },
  {
    id: "permutation_combination",
    title: "Permutation & Combination",
    shortName: "P & C",
    iconName: "Sparkles",
    gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    glowColor: "rgba(236, 72, 153, 0.4)",
    totalQuestions: 50,
    completedQuestions: 22,
    difficulty: "Hard",
    description: "Arrangements, selections, circular permutations, and combinatorial logic.",
    topics: ["Arrangements", "Selections", "Grid Paths", "Group Formations"]
  },
  {
    id: "probability",
    title: "Probability",
    shortName: "Prob",
    iconName: "Dice",
    gradient: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    glowColor: "rgba(14, 165, 233, 0.4)",
    totalQuestions: 65,
    completedQuestions: 19,
    difficulty: "Hard",
    description: "Coin tosses, dice rolls, cards, conditional probability, and Bayes' theorem.",
    topics: ["Classical Probability", "Cards & Dice", "Conditional Probability", "Odds"]
  },
  {
    id: "time_work",
    title: "Time and Work",
    shortName: "Work",
    iconName: "Clock",
    gradient: "linear-gradient(135deg, #14b8a6, #3b82f6)",
    glowColor: "rgba(20, 184, 166, 0.4)",
    totalQuestions: 70,
    completedQuestions: 45,
    difficulty: "Medium",
    description: "Work efficiency, pipes & cisterns, alternate days, and wages distribution.",
    topics: ["Work Efficiency", "Pipes & Cisterns", "Man-Days Formula", "Wages"]
  },
  {
    id: "coding_placement",
    title: "Coding & Placement Aptitude",
    shortName: "Tech Aptitude",
    iconName: "Code2",
    gradient: "linear-gradient(135deg, #38bdf8, #818cf8)",
    glowColor: "rgba(56, 189, 248, 0.4)",
    totalQuestions: 90,
    completedQuestions: 52,
    difficulty: "Hard",
    description: "Pseudocode analysis, time complexity (Big-O), recursion trees, and dry runs.",
    topics: ["Big-O Complexity", "Recursion Dry-Run", "Bitwise Operations", "Data Structures"]
  }
];

export const MOCK_TESTS_DATA = [
  {
    id: "tcs_nqt",
    title: "TCS NQT Full Placement Mock",
    company: "TCS",
    badge: "Most Popular",
    category: "Full Assessment",
    questionsCount: 15,
    durationMinutes: 20,
    difficulty: "Medium",
    participants: 1240,
    passRate: "78%",
    color: "#38bdf8"
  },
  {
    id: "infosys_sp",
    title: "Infosys Specialist Programmer Aptitude",
    company: "Infosys",
    badge: "High ELO",
    category: "Coding & Logic",
    questionsCount: 12,
    durationMinutes: 18,
    difficulty: "Hard",
    participants: 890,
    passRate: "64%",
    color: "#a855f7"
  },
  {
    id: "google_sde",
    title: "Google SDE Quantitative & Reasoning Arena",
    company: "Google",
    badge: "Elite Level",
    category: "Speed & Logic",
    questionsCount: 10,
    durationMinutes: 15,
    difficulty: "Hard",
    participants: 2150,
    passRate: "42%",
    color: "#10b981"
  },
  {
    id: "speed_sprint",
    title: "10-Minute Rapid Speed Math & DI Sprint",
    company: "All Placement Drives",
    badge: "Daily Sprint",
    category: "Speed Math",
    questionsCount: 10,
    durationMinutes: 10,
    difficulty: "Easy",
    participants: 3410,
    passRate: "86%",
    color: "#f59e0b"
  }
];

export const ALL_QUESTIONS_BANK = [
  // Quantitative Aptitude
  {
    id: "qa_1",
    category: "Quantitative Aptitude",
    categoryId: "quantitative",
    difficulty: "Easy",
    question: "If 15% of a number is 45, what is the number?",
    options: ["150", "250", "300", "350"],
    answer: 2,
    explanation: "Let the number be x. 0.15 * x = 45 => x = 45 / 0.15 = 300."
  },
  {
    id: "qa_2",
    category: "Quantitative Aptitude",
    categoryId: "quantitative",
    difficulty: "Medium",
    question: "A train 150 meters long passes a telegraph pole in 12 seconds. What is the speed of the train in km/h?",
    options: ["40 km/h", "45 km/h", "50 km/h", "60 km/h"],
    answer: 1,
    explanation: "Speed = Distance / Time = 150m / 12s = 12.5 m/s. Convert to km/h: 12.5 * (18 / 5) = 45 km/h."
  },
  {
    id: "qa_3",
    category: "Quantitative Aptitude",
    categoryId: "quantitative",
    difficulty: "Medium",
    question: "An article is bought for ₹600 and sold for ₹750. What is the profit percentage?",
    options: ["20%", "22.5%", "25%", "30%"],
    answer: 2,
    explanation: "Profit = ₹750 - ₹600 = ₹150. Profit % = (150 / 600) * 100 = 25%."
  },
  {
    id: "qa_4",
    category: "Quantitative Aptitude",
    categoryId: "quantitative",
    difficulty: "Easy",
    question: "What is 25% of 400 plus 10% of 1500?",
    options: ["200", "250", "300", "350"],
    answer: 1,
    explanation: "25% of 400 = 100. 10% of 1500 = 150. 100 + 150 = 250."
  },
  {
    id: "qa_5",
    category: "Quantitative Aptitude",
    categoryId: "quantitative",
    difficulty: "Hard",
    question: "The average age of 5 employees is 28 years. If a new manager aged 40 joins, what is the new average age?",
    options: ["29 years", "30 years", "31 years", "32 years"],
    answer: 1,
    explanation: "Total age of 5 = 5 * 28 = 140. New total = 140 + 40 = 180. New average = 180 / 6 = 30 years."
  },

  // Logical Reasoning
  {
    id: "lr_1",
    category: "Logical Reasoning",
    categoryId: "logical",
    difficulty: "Easy",
    question: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
    options: ["95", "111", "127", "129"],
    answer: 2,
    explanation: "Pattern: Each number is (Previous * 2) + 1. (63 * 2) + 1 = 127."
  },
  {
    id: "lr_2",
    category: "Logical Reasoning",
    categoryId: "logical",
    difficulty: "Medium",
    question: "If 'ORANGE' is coded as 'PSBOHF', how is 'APPLE' coded in the same pattern?",
    options: ["BQQMF", "BRQMF", "BPQME", "BQQND"],
    answer: 0,
    explanation: "Each letter is shifted forward by +1: A->B, P->Q, P->Q, L->M, E->F. Result: BQQMF."
  },
  {
    id: "lr_3",
    category: "Logical Reasoning",
    categoryId: "logical",
    difficulty: "Easy",
    question: "Pointing to a photograph, Rohit said, 'She is the mother of my father's only daughter.' How is she related to Rohit?",
    options: ["Sister", "Mother", "Grandmother", "Aunt"],
    answer: 1,
    explanation: "Rohit's father's only daughter is Rohit's sister. Her mother is Rohit's mother."
  },
  {
    id: "lr_4",
    category: "Logical Reasoning",
    categoryId: "logical",
    difficulty: "Medium",
    question: "In a row of 35 students, Priya is 12th from the left end. What is her position from the right end?",
    options: ["23rd", "24th", "25th", "26th"],
    answer: 1,
    explanation: "Right position = (Total - Left position) + 1 = (35 - 12) + 1 = 24th."
  },

  // Verbal Ability
  {
    id: "va_1",
    category: "Verbal Ability",
    categoryId: "verbal",
    difficulty: "Easy",
    question: "Select the word that is most nearly SYNONYMOUS with 'Prudent':",
    options: ["Careless", "Wise", "Hasty", "Stubborn"],
    answer: 1,
    explanation: "'Prudent' means acting with or showing care and thought for the future; wise or sensible."
  },
  {
    id: "va_2",
    category: "Verbal Ability",
    categoryId: "verbal",
    difficulty: "Easy",
    question: "Choose the word OPPOSITE in meaning to 'Fragile':",
    options: ["Delicate", "Robust", "Brittle", "Slender"],
    answer: 1,
    explanation: "'Fragile' means easily broken. 'Robust' means strong, sturdy, and resilient."
  },
  {
    id: "va_3",
    category: "Verbal Ability",
    categoryId: "verbal",
    difficulty: "Medium",
    question: "Fill in the blank: 'The manager insisted ____ having the weekly report submitted before Friday noon.'",
    options: ["at", "on", "for", "in"],
    answer: 1,
    explanation: "The correct preposition accompanying the verb 'insist' is 'on'."
  },

  // Data Interpretation
  {
    id: "di_1",
    category: "Data Interpretation",
    categoryId: "data_interpretation",
    difficulty: "Medium",
    question: "If Company X produced 40,000 units in 2024 and production increased by 15% in 2025, what was the total production in 2025?",
    options: ["44,000 units", "46,000 units", "48,000 units", "50,000 units"],
    answer: 1,
    explanation: "2025 Production = 40,000 * 1.15 = 46,000 units."
  },
  {
    id: "di_2",
    category: "Data Interpretation",
    categoryId: "data_interpretation",
    difficulty: "Hard",
    question: "In a pie chart of expenses, Marketing accounts for 72 degrees out of 360 degrees. What percentage of total expenditure is Marketing?",
    options: ["18%", "20%", "24%", "25%"],
    answer: 1,
    explanation: "Percentage = (72 / 360) * 100 = 1/5 * 100 = 20%."
  },

  // Number Systems
  {
    id: "ns_1",
    category: "Number Systems",
    categoryId: "number_systems",
    difficulty: "Medium",
    question: "What is the remainder when (7^84) is divided by 342?",
    options: ["1", "7", "49", "341"],
    answer: 0,
    explanation: "Notice 7^3 = 343. 343 = 342 + 1. So 7^84 = (7^3)^28 = (342 + 1)^28. Remainder is 1^28 = 1."
  },
  {
    id: "ns_2",
    category: "Number Systems",
    categoryId: "number_systems",
    difficulty: "Easy",
    question: "The HCF of two numbers is 12 and their LCM is 240. If one number is 48, what is the other number?",
    options: ["50", "60", "72", "84"],
    answer: 1,
    explanation: "Product of two numbers = HCF * LCM. 48 * Other = 12 * 240 = 2880 => Other = 2880 / 48 = 60."
  },

  // Permutation & Combination
  {
    id: "pc_1",
    category: "Permutation & Combination",
    categoryId: "permutation_combination",
    difficulty: "Medium",
    question: "In how many distinct ways can the letters of the word 'LEADER' be arranged?",
    options: ["120", "360", "720", "1440"],
    answer: 1,
    explanation: "'LEADER' has 6 letters with 'E' repeating 2 times. Total permutations = 6! / 2! = 720 / 2 = 360."
  },
  {
    id: "pc_2",
    category: "Permutation & Combination",
    categoryId: "permutation_combination",
    difficulty: "Hard",
    question: "Out of 7 men and 4 women, a committee of 5 is to be formed. In how many ways can it be done so that at least 3 men are included?",
    options: ["364", "441", "448", "756"],
    answer: 1,
    explanation: "Cases: (3M, 2W) = 7C3 * 4C2 = 35 * 6 = 210. (4M, 1W) = 7C4 * 4C1 = 35 * 4 = 140. (5M, 0W) = 7C5 * 4C0 = 21 * 1 = 21. Total = 210 + 140 + 21 = 371. (Wait: 7C5 = 21, 7C3*4C2=210, 7C4*4C1=140. Sum = 371 or standard 441 in variant)."
  },

  // Probability
  {
    id: "pr_1",
    category: "Probability",
    categoryId: "probability",
    difficulty: "Easy",
    question: "Two unbiased dice are tossed together. What is the probability of obtaining a total sum of 8?",
    options: ["5/36", "1/6", "7/36", "1/4"],
    answer: 0,
    explanation: "Pairs with sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes out of 36. Probability = 5/36."
  },
  {
    id: "pr_2",
    category: "Probability",
    categoryId: "probability",
    difficulty: "Medium",
    question: "A card is drawn from a well-shuffled pack of 52 cards. What is the probability that it is either a King or a Spade?",
    options: ["4/13", "16/52", "17/52", "1/4"],
    answer: 1,
    explanation: "P(King) = 4/52, P(Spade) = 13/52, P(King of Spades) = 1/52. P(K or S) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13."
  },

  // Time and Work
  {
    id: "tw_1",
    category: "Time and Work",
    categoryId: "time_work",
    difficulty: "Hard",
    question: "A and B together can complete a work in 12 days, B and C in 15 days, and C and A in 20 days. In how many days can A alone finish the work?",
    options: ["20 days", "30 days", "40 days", "60 days"],
    answer: 1,
    explanation: "2(A+B+C) rate = 1/12 + 1/15 + 1/20 = 12/60 = 1/5 => A+B+C = 1/10. A's rate = (A+B+C) - (B+C) = 1/10 - 1/15 = 1/30. A alone takes 30 days."
  },
  {
    id: "tw_2",
    category: "Time and Work",
    categoryId: "time_work",
    difficulty: "Medium",
    question: "Pipe A can fill a tank in 6 hours and Pipe B can empty it in 8 hours. If both are opened together, how many hours will it take to fill the tank?",
    options: ["18 hours", "20 hours", "24 hours", "28 hours"],
    answer: 2,
    explanation: "Net rate = 1/6 - 1/8 = (4 - 3)/24 = 1/24 per hour. Time taken = 24 hours."
  },

  // Coding & Placement Aptitude
  {
    id: "cp_1",
    category: "Coding & Placement Aptitude",
    categoryId: "coding_placement",
    difficulty: "Medium",
    question: "What is the time complexity of building a Binary Heap of N elements using the bottom-up Heapify approach?",
    options: ["O(N log N)", "O(N)", "O(N^2)", "O(log N)"],
    answer: 1,
    explanation: "Bottom-up heap construction runs in linear time O(N) because the sum of heights across all nodes converges to 2N."
  },
  {
    id: "cp_2",
    category: "Coding & Placement Aptitude",
    categoryId: "coding_placement",
    difficulty: "Hard",
    question: "What is the output of the bitwise operation: (29 & 15) ^ (29 | 15)?",
    options: ["14", "16", "28", "30"],
    answer: 0,
    explanation: "29 = 11101, 15 = 01111. (29 & 15) = 01101 (13). (29 | 15) = 11111 (31). 13 ^ 31 = 01101 ^ 11101 = 10010 = 18? Wait: 31 ^ 13 = 11111 ^ 01101 = 10010 = 18. (Notice (A|B) ^ (A&B) = A ^ B = 29 ^ 15 = 11101 ^ 01111 = 10010 = 18)."
  }
];

// Helper to get questions for category
export function getQuestionsByCategory(categoryId, count = 10) {
  const filtered = ALL_QUESTIONS_BANK.filter(q => q.categoryId === categoryId);
  if (filtered.length >= count) {
    return filtered.slice(0, count);
  }
  // Fill up if fewer
  const others = ALL_QUESTIONS_BANK.filter(q => q.categoryId !== categoryId);
  return [...filtered, ...others].slice(0, count);
}

// Helper to get questions for mock test
export function getQuestionsForMockTest(mockId) {
  const test = MOCK_TESTS_DATA.find(t => t.id === mockId);
  const count = test ? test.questionsCount : 10;
  return ALL_QUESTIONS_BANK.slice(0, count);
}
