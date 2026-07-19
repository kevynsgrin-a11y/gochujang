// Mock "Mise" dataset — a believable snapshot of a food lover's kitchen life.
// (Front-end demo data; a real backend would hydrate these same shapes.)

export interface Batch {
  id: string
  name: string
  type: 'ferment' | 'marinade' | 'pickle' | 'cure' | 'brine'
  linkedDishId?: string
  vessel: string
  progressPct: number
  status: 'active' | 'ready'
  readyLabel: string
  note: string
}

export interface Achievement {
  key: string
  title: string
  description: string
  glyph: string
  progress: number
  target: number
  unlocked: boolean
}

export interface PassportStamp {
  region: string
  cuisine: string
  dishesCooked: number
  mastery: 0 | 1 | 2 | 3
  unlocked: boolean
}

export interface RecentCook {
  dishId: string
  dishName: string
  when: string
  rating: number
  wouldCookAgain: boolean
}

export const profile = {
  name: 'Ren',
  kitchenTitle: 'Ferment Forager',
  level: 7,
  levelProgress: 62,
  joined: 'March 2025',
  weeklyGoal: 4,
  weeklyProgress: 3,
  currentStreak: 19,
  longestStreak: 24,
}

export const kitchenStats = [
  { value: '86', label: 'Dishes cooked', caption: 'across 11 cuisines', glyph: 'flame' },
  { value: '3', label: 'Active batches', caption: '1 ready to taste', glyph: 'timer' },
  { value: '19', label: 'Day streak', caption: 'longest yet: 24', glyph: 'streak' },
  { value: '11', label: 'Cuisines mapped', caption: '7 to go for the map', glyph: 'globe' },
]

export const batches: Batch[] = [
  {
    id: 'b1',
    name: 'Baechu Kimchi — Batch №7',
    type: 'ferment',
    linkedDishId: 'baechu-kimchi',
    vessel: 'Onggi crock · 2L',
    progressPct: 100,
    status: 'ready',
    readyLabel: 'Ready to taste',
    note: 'Day 5 · smells sour and alive',
  },
  {
    id: 'b2',
    name: 'Gochujang Hot Sauce',
    type: 'ferment',
    vessel: 'Fido jar · 750ml',
    progressPct: 64,
    status: 'active',
    readyLabel: 'Ready in 9 days',
    note: 'Bubbling nicely, burp daily',
  },
  {
    id: 'b3',
    name: 'Galbi Short-Rib Marinade',
    type: 'marinade',
    linkedDishId: 'gochujang-galbi',
    vessel: 'Zip bag · overnight',
    progressPct: 38,
    status: 'active',
    readyLabel: 'Ready in 6 hours',
    note: 'Pear + gochujang doing its work',
  },
]

export const spiceTolerance = {
  currentLevel: 7.4,
  max: 10,
  band: 'Fiery',
  scoville: '25,000 SHU',
  heatDishesLogged: 23,
  nextTier: 'Scorching',
  trend: [3.1, 3.6, 4.2, 4.0, 5.1, 5.8, 6.3, 6.1, 6.9, 7.4],
}

// Flavor radar for a signature dish — 6 axes, 0-10.
export const flavorRadar = {
  dish: 'Gochujang-Glazed Galbi',
  axes: [
    { label: 'Heat', value: 6 },
    { label: 'Umami', value: 9 },
    { label: 'Acidity', value: 3 },
    { label: 'Sweetness', value: 7 },
    { label: 'Funk', value: 8 },
    { label: 'Texture', value: 8 },
  ],
}

export const achievements: Achievement[] = [
  { key: 'first-ferment', title: 'First Ferment', description: 'Complete your first fermentation batch', glyph: 'jar', progress: 1, target: 1, unlocked: true },
  { key: 'chili-head', title: 'Chili Head', description: 'Log 20 dishes at heat 4+', glyph: 'chili', progress: 23, target: 20, unlocked: true },
  { key: 'ten-cuisines', title: 'Ten Cuisines', description: 'Cook across 10 world cuisines', glyph: 'globe', progress: 11, target: 10, unlocked: true },
  { key: 'streak-keeper', title: 'Streak Keeper', description: 'Hold a 21-day cooking streak', glyph: 'flame', progress: 19, target: 21, unlocked: false },
  { key: 'master-fermenter', title: 'Master Fermenter', description: 'Finish 15 fermentation batches', glyph: 'crock', progress: 9, target: 15, unlocked: false },
  { key: 'palate-pioneer', title: 'Palate Pioneer', description: 'Reach spice tolerance level 9', glyph: 'bolt', progress: 7, target: 9, unlocked: false },
]

export const passport: PassportStamp[] = [
  { region: 'Seoul', cuisine: 'Korean', dishesCooked: 14, mastery: 3, unlocked: true },
  { region: 'Jeonju', cuisine: 'Korean', dishesCooked: 5, mastery: 2, unlocked: true },
  { region: 'Busan', cuisine: 'Korean', dishesCooked: 4, mastery: 2, unlocked: true },
  { region: 'Bologna', cuisine: 'Italian', dishesCooked: 3, mastery: 1, unlocked: true },
  { region: 'Jalisco', cuisine: 'Mexican', dishesCooked: 2, mastery: 1, unlocked: true },
  { region: 'Kyoto', cuisine: 'Japanese', dishesCooked: 3, mastery: 1, unlocked: true },
  { region: 'Tel Aviv', cuisine: 'Israeli', dishesCooked: 1, mastery: 0, unlocked: true },
  { region: 'Paris', cuisine: 'French', dishesCooked: 1, mastery: 0, unlocked: true },
  { region: 'Bangkok', cuisine: 'Thai', dishesCooked: 0, mastery: 0, unlocked: false },
  { region: 'Oaxaca', cuisine: 'Mexican', dishesCooked: 0, mastery: 0, unlocked: false },
]

export const recentCooks: RecentCook[] = [
  { dishId: 'yangnyeom-chicken', dishName: 'Yangnyeom Fried Chicken', when: 'Yesterday', rating: 5, wouldCookAgain: true },
  { dishId: 'dolsot-bibimbap', dishName: 'Dolsot Bibimbap', when: '3 days ago', rating: 4, wouldCookAgain: true },
  { dishId: 'buldak-fire-noodles', dishName: 'Buldak Fire Noodles', when: '4 days ago', rating: 5, wouldCookAgain: true },
  { dishId: 'doenjang-jjigae', dishName: 'Doenjang Jjigae', when: 'Last week', rating: 4, wouldCookAgain: true },
]

export const insights = [
  { label: 'Most-cooked cuisine', value: 'Korean', caption: '62% of your logs' },
  { label: 'Average rating', value: '4.6', caption: 'you cook what you love' },
  { label: 'Heat trend', value: '+38%', caption: 'braver every month' },
]

/**
 * Build a contribution-style activity heatmap for the last `weeks` weeks,
 * ending today. Deterministic pattern (no randomness) so SSR/hydration match.
 */
export function buildActivity(weeks = 18): { date: Date; count: number }[] {
  const days = weeks * 7
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - (days - 1))
  const out: { date: Date; count: number }[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    // Seeded intensity: weekends + a wave, denser toward "now".
    const dow = d.getDay()
    const wave = Math.sin(i / 5.5) + Math.cos(i / 2.3)
    const recency = i > days - 22 ? 1.1 : 0.75
    let c = 0
    const s = (wave + 2) * recency + (dow === 0 || dow === 6 ? 1.1 : 0)
    if (s > 3.4) c = 4
    else if (s > 2.7) c = 3
    else if (s > 1.9) c = 2
    else if (s > 1.1) c = 1
    // A few deliberate rest days.
    if (i % 11 === 3 || i % 17 === 5) c = 0
    out.push({ date: d, count: c })
  }
  return out
}
