// mockFoodDatabase.js — comprehensive local food database for demo use.
// 120+ foods across Indian staples, fruits, vegetables, proteins, dairy,
// snacks, beverages, fast food and common Western items.
//
// Shape: NormalizedFood
//   id       — unique, prefixed with 'mock-'
//   name     — display name
//   brand    — cuisine/category tag (optional)
//   source   — always 'mock'
//   photo    — null (UI shows initial fallback)
//   per100g  — macros per 100 g edible portion
//   servings — common household measures

export const MOCK_FOODS = [

  // ─── Indian Breads ───────────────────────────────────────────────────────
  {
    id: 'mock-roti',
    name: 'Roti (Whole Wheat Chapati)',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 297, protein: 11, carbs: 46, fat: 7.5, fiber: 10.7 },
    servings: [
      { label: '1 small roti (30 g)', grams: 30 },
      { label: '1 medium roti (40 g)', grams: 40 },
      { label: '1 large roti (60 g)', grams: 60 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-paratha-plain',
    name: 'Plain Paratha',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 326, protein: 8, carbs: 43, fat: 14, fiber: 3.5 },
    servings: [
      { label: '1 paratha (80 g)', grams: 80 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-paratha-aloo',
    name: 'Aloo Paratha',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 258, protein: 5.5, carbs: 36, fat: 10.5, fiber: 3.2 },
    servings: [
      { label: '1 paratha (100 g)', grams: 100 },
      { label: '1 small paratha (70 g)', grams: 70 },
    ],
  },
  {
    id: 'mock-naan',
    name: 'Naan',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 317, protein: 9.5, carbs: 55, fat: 7, fiber: 2.2 },
    servings: [
      { label: '1 piece (90 g)', grams: 90 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-puri',
    name: 'Puri',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 336, protein: 6.5, carbs: 38, fat: 18, fiber: 2.5 },
    servings: [
      { label: '1 puri (25 g)', grams: 25 },
      { label: '2 puris (50 g)', grams: 50 },
      { label: '100 g', grams: 100 },
    ],
  },

  // ─── Indian Rice & Grain Dishes ──────────────────────────────────────────
  {
    id: 'mock-rice-basmati',
    name: 'Basmati Rice, cooked',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 121, protein: 3, carbs: 25.2, fat: 0.4, fiber: 0.4 },
    servings: [
      { label: '1 small bowl (150 g)', grams: 150 },
      { label: '1 plate (250 g)', grams: 250 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-biryani-chicken',
    name: 'Chicken Biryani',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 196, protein: 8, carbs: 26, fat: 6.8, fiber: 1.2 },
    servings: [
      { label: '1 plate (300 g)', grams: 300 },
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-biryani-veg',
    name: 'Veg Biryani',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 162, protein: 3.8, carbs: 28, fat: 4.5, fiber: 2.1 },
    servings: [
      { label: '1 plate (300 g)', grams: 300 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-pulao',
    name: 'Vegetable Pulao',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 155, protein: 3.5, carbs: 27, fat: 4, fiber: 1.8 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-khichdi',
    name: 'Dal Khichdi',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 130, protein: 5, carbs: 22, fat: 2.8, fiber: 2.5 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },

  // ─── Indian Dals & Curries ───────────────────────────────────────────────
  {
    id: 'mock-dal-tadka',
    name: 'Dal Tadka',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 104, protein: 6.3, carbs: 12, fat: 3.5, fiber: 3.4 },
    servings: [
      { label: '1 small bowl (150 g)', grams: 150 },
      { label: '1 medium bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-dal-makhani',
    name: 'Dal Makhani',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 139, protein: 6, carbs: 14, fat: 6.5, fiber: 3.8 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-rajma',
    name: 'Rajma (Kidney Bean Curry)',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 127, protein: 7, carbs: 19, fat: 2.5, fiber: 6.2 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-chole',
    name: 'Chole (Chickpea Curry)',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 139, protein: 6.8, carbs: 18, fat: 4.5, fiber: 5.5 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-palak-paneer',
    name: 'Palak Paneer',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 165, protein: 8.5, carbs: 6, fat: 12, fiber: 2.2 },
    servings: [
      { label: '1 bowl (150 g)', grams: 150 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-paneer-butter-masala',
    name: 'Paneer Butter Masala',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 198, protein: 8, carbs: 9, fat: 15, fiber: 1.8 },
    servings: [
      { label: '1 bowl (150 g)', grams: 150 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-chicken-curry',
    name: 'Chicken Curry',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 180, protein: 15, carbs: 4, fat: 12, fiber: 1 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-butter-chicken',
    name: 'Butter Chicken (Murgh Makhani)',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 192, protein: 14, carbs: 7, fat: 13, fiber: 1.2 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-fish-curry',
    name: 'Fish Curry',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 155, protein: 16, carbs: 5, fat: 8, fiber: 1 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-mutton-curry',
    name: 'Mutton Curry',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 204, protein: 18, carbs: 4, fat: 13, fiber: 0.8 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },

  // ─── Indian Snacks & Street Food ─────────────────────────────────────────
  {
    id: 'mock-samosa',
    name: 'Samosa',
    brand: 'Indian Snack',
    source: 'mock', photo: null,
    per100g: { kcal: 308, protein: 5, carbs: 32, fat: 18, fiber: 2.6 },
    servings: [
      { label: '1 samosa (60 g)', grams: 60 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-pakora',
    name: 'Vegetable Pakora',
    brand: 'Indian Snack',
    source: 'mock', photo: null,
    per100g: { kcal: 290, protein: 6, carbs: 28, fat: 18, fiber: 3 },
    servings: [
      { label: '4 pieces (80 g)', grams: 80 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-pav-bhaji',
    name: 'Pav Bhaji',
    brand: 'Indian Snack',
    source: 'mock', photo: null,
    per100g: { kcal: 175, protein: 4, carbs: 26, fat: 6.5, fiber: 4 },
    servings: [
      { label: '1 serving with 2 pav (300 g)', grams: 300 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-vada-pav',
    name: 'Vada Pav',
    brand: 'Indian Snack',
    source: 'mock', photo: null,
    per100g: { kcal: 256, protein: 5.5, carbs: 36, fat: 10, fiber: 2.8 },
    servings: [
      { label: '1 piece (130 g)', grams: 130 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-dhokla',
    name: 'Dhokla',
    brand: 'Indian Snack',
    source: 'mock', photo: null,
    per100g: { kcal: 160, protein: 6.5, carbs: 28, fat: 3, fiber: 1.8 },
    servings: [
      { label: '2 pieces (100 g)', grams: 100 },
      { label: '4 pieces (200 g)', grams: 200 },
    ],
  },

  // ─── Indian Breakfast ────────────────────────────────────────────────────
  {
    id: 'mock-idli',
    name: 'Idli',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 139, protein: 4.5, carbs: 27, fat: 1.2, fiber: 1.5 },
    servings: [
      { label: '1 idli (35 g)', grams: 35 },
      { label: '2 idlis (70 g)', grams: 70 },
      { label: '4 idlis (140 g)', grams: 140 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-dosa-plain',
    name: 'Plain Dosa',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 168, protein: 3.7, carbs: 30, fat: 3.7, fiber: 1.2 },
    servings: [
      { label: '1 medium dosa (80 g)', grams: 80 },
      { label: '1 large dosa (120 g)', grams: 120 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-dosa-masala',
    name: 'Masala Dosa',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 188, protein: 4, carbs: 30, fat: 6, fiber: 2.2 },
    servings: [
      { label: '1 masala dosa (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-poha',
    name: 'Poha',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 180, protein: 3.5, carbs: 35, fat: 3.5, fiber: 1.8 },
    servings: [
      { label: '1 bowl (150 g)', grams: 150 },
      { label: '1 plate (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-upma',
    name: 'Upma',
    brand: 'Indian',
    source: 'mock', photo: null,
    per100g: { kcal: 174, protein: 3.2, carbs: 29, fat: 5, fiber: 1.5 },
    servings: [
      { label: '1 bowl (150 g)', grams: 150 },
      { label: '100 g', grams: 100 },
    ],
  },

  // ─── Dairy & Eggs ────────────────────────────────────────────────────────
  {
    id: 'mock-paneer',
    name: 'Paneer (Indian Cottage Cheese)',
    brand: 'Dairy',
    source: 'mock', photo: null,
    per100g: { kcal: 296, protein: 21, carbs: 3.4, fat: 22.5, fiber: 0 },
    servings: [
      { label: '1 cube (15 g)', grams: 15 },
      { label: '1 serving (50 g)', grams: 50 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-curd',
    name: 'Curd / Dahi (whole milk)',
    brand: 'Dairy',
    source: 'mock', photo: null,
    per100g: { kcal: 60, protein: 3.1, carbs: 4.7, fat: 3.3, fiber: 0 },
    servings: [
      { label: '1 small bowl (100 g)', grams: 100 },
      { label: '1 cup (200 g)', grams: 200 },
    ],
  },
  {
    id: 'mock-milk-whole',
    name: 'Milk (whole, 3.5% fat)',
    brand: 'Dairy',
    source: 'mock', photo: null,
    per100g: { kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
    servings: [
      { label: '1 glass (200 ml)', grams: 200 },
      { label: '1 cup (240 ml)', grams: 240 },
    ],
  },
  {
    id: 'mock-milk-toned',
    name: 'Toned Milk (1.5% fat)',
    brand: 'Dairy',
    source: 'mock', photo: null,
    per100g: { kcal: 44, protein: 3.5, carbs: 5, fat: 1.5, fiber: 0 },
    servings: [
      { label: '1 glass (200 ml)', grams: 200 },
      { label: '1 cup (240 ml)', grams: 240 },
    ],
  },
  {
    id: 'mock-butter',
    name: 'Butter',
    brand: 'Dairy',
    source: 'mock', photo: null,
    per100g: { kcal: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 },
    servings: [
      { label: '1 tsp (5 g)', grams: 5 },
      { label: '1 tbsp (14 g)', grams: 14 },
    ],
  },
  {
    id: 'mock-ghee',
    name: 'Ghee (Clarified Butter)',
    brand: 'Dairy',
    source: 'mock', photo: null,
    per100g: { kcal: 900, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    servings: [
      { label: '1 tsp (5 g)', grams: 5 },
      { label: '1 tbsp (14 g)', grams: 14 },
    ],
  },
  {
    id: 'mock-egg-boiled',
    name: 'Boiled Egg',
    source: 'mock', photo: null,
    per100g: { kcal: 155, protein: 12.6, carbs: 1.1, fat: 10.6, fiber: 0 },
    servings: [
      { label: '1 large egg (50 g)', grams: 50 },
      { label: '2 eggs (100 g)', grams: 100 },
      { label: '3 eggs (150 g)', grams: 150 },
    ],
  },
  {
    id: 'mock-egg-omelette',
    name: 'Omelette (2 eggs)',
    source: 'mock', photo: null,
    per100g: { kcal: 185, protein: 13, carbs: 1.5, fat: 14, fiber: 0 },
    servings: [
      { label: '1 omelette (100 g)', grams: 100 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-cheese-slice',
    name: 'Processed Cheese Slice',
    brand: 'Dairy',
    source: 'mock', photo: null,
    per100g: { kcal: 330, protein: 19, carbs: 5, fat: 27, fiber: 0 },
    servings: [
      { label: '1 slice (20 g)', grams: 20 },
      { label: '100 g', grams: 100 },
    ],
  },

  // ─── Proteins ────────────────────────────────────────────────────────────
  {
    id: 'mock-chicken-breast',
    name: 'Grilled Chicken Breast',
    source: 'mock', photo: null,
    per100g: { kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    servings: [
      { label: '1 small (100 g)', grams: 100 },
      { label: '1 medium (150 g)', grams: 150 },
      { label: '1 large (200 g)', grams: 200 },
    ],
  },
  {
    id: 'mock-chicken-thigh',
    name: 'Chicken Thigh, cooked',
    source: 'mock', photo: null,
    per100g: { kcal: 209, protein: 26, carbs: 0, fat: 11, fiber: 0 },
    servings: [
      { label: '1 thigh (100 g)', grams: 100 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-tuna',
    name: 'Tuna, canned in water',
    source: 'mock', photo: null,
    per100g: { kcal: 116, protein: 26, carbs: 0, fat: 1, fiber: 0 },
    servings: [
      { label: '1 can (185 g)', grams: 185 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-salmon',
    name: 'Salmon, grilled',
    source: 'mock', photo: null,
    per100g: { kcal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
    servings: [
      { label: '1 fillet (150 g)', grams: 150 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-whey-protein',
    name: 'Whey Protein Shake',
    brand: 'Supplement',
    source: 'mock', photo: null,
    per100g: { kcal: 50, protein: 10, carbs: 1.5, fat: 0.6, fiber: 0 },
    servings: [
      { label: '1 scoop with water (250 ml)', grams: 250 },
      { label: '100 ml', grams: 100 },
    ],
  },
  {
    id: 'mock-tofu',
    name: 'Tofu (firm)',
    source: 'mock', photo: null,
    per100g: { kcal: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 },
    servings: [
      { label: '1/2 block (150 g)', grams: 150 },
      { label: '100 g', grams: 100 },
    ],
  },

  // ─── Fruits ──────────────────────────────────────────────────────────────
  {
    id: 'mock-banana',
    name: 'Banana',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 },
    servings: [
      { label: '1 small (80 g)', grams: 80 },
      { label: '1 medium (118 g)', grams: 118 },
      { label: '1 large (150 g)', grams: 150 },
    ],
  },
  {
    id: 'mock-apple',
    name: 'Apple',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
    servings: [
      { label: '1 small (150 g)', grams: 150 },
      { label: '1 medium (182 g)', grams: 182 },
      { label: '1 large (220 g)', grams: 220 },
    ],
  },
  {
    id: 'mock-mango',
    name: 'Mango',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 },
    servings: [
      { label: '1 small mango (200 g)', grams: 200 },
      { label: '1 cup sliced (165 g)', grams: 165 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-orange',
    name: 'Orange',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
    servings: [
      { label: '1 medium (131 g)', grams: 131 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-grapes',
    name: 'Grapes (green/red)',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9 },
    servings: [
      { label: '1 cup (92 g)', grams: 92 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-papaya',
    name: 'Papaya',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7 },
    servings: [
      { label: '1 cup cubed (145 g)', grams: 145 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-guava',
    name: 'Guava',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4 },
    servings: [
      { label: '1 medium (100 g)', grams: 100 },
    ],
  },
  {
    id: 'mock-pomegranate',
    name: 'Pomegranate',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4 },
    servings: [
      { label: '1/2 pomegranate (174 g)', grams: 174 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-watermelon',
    name: 'Watermelon',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4 },
    servings: [
      { label: '1 slice (280 g)', grams: 280 },
      { label: '1 cup (152 g)', grams: 152 },
    ],
  },
  {
    id: 'mock-avocado',
    name: 'Avocado',
    brand: 'Fruit',
    source: 'mock', photo: null,
    per100g: { kcal: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
    servings: [
      { label: '1/2 avocado (100 g)', grams: 100 },
      { label: '1 whole (200 g)', grams: 200 },
    ],
  },

  // ─── Vegetables ──────────────────────────────────────────────────────────
  {
    id: 'mock-potato',
    name: 'Boiled Potato',
    brand: 'Vegetable',
    source: 'mock', photo: null,
    per100g: { kcal: 87, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8 },
    servings: [
      { label: '1 small (100 g)', grams: 100 },
      { label: '1 medium (170 g)', grams: 170 },
    ],
  },
  {
    id: 'mock-sweet-potato',
    name: 'Sweet Potato, boiled',
    brand: 'Vegetable',
    source: 'mock', photo: null,
    per100g: { kcal: 76, protein: 1.4, carbs: 18, fat: 0.1, fiber: 2.5 },
    servings: [
      { label: '1 medium (150 g)', grams: 150 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-broccoli',
    name: 'Broccoli, steamed',
    brand: 'Vegetable',
    source: 'mock', photo: null,
    per100g: { kcal: 35, protein: 2.4, carbs: 7.2, fat: 0.4, fiber: 3.3 },
    servings: [
      { label: '1 cup (90 g)', grams: 90 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-spinach',
    name: 'Spinach (Palak), raw',
    brand: 'Vegetable',
    source: 'mock', photo: null,
    per100g: { kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    servings: [
      { label: '1 cup (30 g)', grams: 30 },
      { label: '1 bowl (100 g)', grams: 100 },
    ],
  },
  {
    id: 'mock-tomato',
    name: 'Tomato',
    brand: 'Vegetable',
    source: 'mock', photo: null,
    per100g: { kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    servings: [
      { label: '1 medium (123 g)', grams: 123 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-onion',
    name: 'Onion',
    brand: 'Vegetable',
    source: 'mock', photo: null,
    per100g: { kcal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
    servings: [
      { label: '1 medium (110 g)', grams: 110 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-carrot',
    name: 'Carrot, raw',
    brand: 'Vegetable',
    source: 'mock', photo: null,
    per100g: { kcal: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
    servings: [
      { label: '1 medium carrot (61 g)', grams: 61 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-cucumber',
    name: 'Cucumber',
    brand: 'Vegetable',
    source: 'mock', photo: null,
    per100g: { kcal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
    servings: [
      { label: '1/2 cucumber (150 g)', grams: 150 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-cauliflower',
    name: 'Cauliflower (Gobi), cooked',
    brand: 'Vegetable',
    source: 'mock', photo: null,
    per100g: { kcal: 23, protein: 1.9, carbs: 4.1, fat: 0.3, fiber: 2 },
    servings: [
      { label: '1 cup (124 g)', grams: 124 },
      { label: '100 g', grams: 100 },
    ],
  },

  // ─── Cereals, Grains & Pulses ────────────────────────────────────────────
  {
    id: 'mock-oats',
    name: 'Oats (rolled), cooked',
    source: 'mock', photo: null,
    per100g: { kcal: 71, protein: 2.5, carbs: 12, fat: 1.5, fiber: 1.7 },
    servings: [
      { label: '1 bowl (200 g)', grams: 200 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-oats-dry',
    name: 'Oats (rolled), dry',
    source: 'mock', photo: null,
    per100g: { kcal: 389, protein: 17, carbs: 66, fat: 7, fiber: 10.6 },
    servings: [
      { label: '1/2 cup (40 g)', grams: 40 },
      { label: '1 cup (80 g)', grams: 80 },
    ],
  },
  {
    id: 'mock-quinoa',
    name: 'Quinoa, cooked',
    source: 'mock', photo: null,
    per100g: { kcal: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 },
    servings: [
      { label: '1 cup (185 g)', grams: 185 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-bread-whole-wheat',
    name: 'Whole Wheat Bread',
    source: 'mock', photo: null,
    per100g: { kcal: 247, protein: 10, carbs: 46, fat: 3.4, fiber: 6.5 },
    servings: [
      { label: '1 slice (30 g)', grams: 30 },
      { label: '2 slices (60 g)', grams: 60 },
    ],
  },
  {
    id: 'mock-bread-white',
    name: 'White Bread',
    source: 'mock', photo: null,
    per100g: { kcal: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7 },
    servings: [
      { label: '1 slice (30 g)', grams: 30 },
      { label: '2 slices (60 g)', grams: 60 },
    ],
  },
  {
    id: 'mock-chickpeas-boiled',
    name: 'Chickpeas (Chana), boiled',
    source: 'mock', photo: null,
    per100g: { kcal: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6 },
    servings: [
      { label: '1 cup (164 g)', grams: 164 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-lentils-boiled',
    name: 'Red Lentils (Masoor Dal), cooked',
    source: 'mock', photo: null,
    per100g: { kcal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9 },
    servings: [
      { label: '1 bowl (150 g)', grams: 150 },
      { label: '100 g', grams: 100 },
    ],
  },

  // ─── Nuts & Seeds ────────────────────────────────────────────────────────
  {
    id: 'mock-almonds',
    name: 'Almonds',
    brand: 'Nuts',
    source: 'mock', photo: null,
    per100g: { kcal: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5 },
    servings: [
      { label: '10 almonds (12 g)', grams: 12 },
      { label: '1 handful (28 g)', grams: 28 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-walnuts',
    name: 'Walnuts',
    brand: 'Nuts',
    source: 'mock', photo: null,
    per100g: { kcal: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 },
    servings: [
      { label: '1 handful (28 g)', grams: 28 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-cashews',
    name: 'Cashews',
    brand: 'Nuts',
    source: 'mock', photo: null,
    per100g: { kcal: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3 },
    servings: [
      { label: '10 cashews (16 g)', grams: 16 },
      { label: '1 handful (28 g)', grams: 28 },
    ],
  },
  {
    id: 'mock-peanut-butter',
    name: 'Peanut Butter',
    source: 'mock', photo: null,
    per100g: { kcal: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 },
    servings: [
      { label: '1 tbsp (16 g)', grams: 16 },
      { label: '2 tbsp (32 g)', grams: 32 },
    ],
  },
  {
    id: 'mock-chia-seeds',
    name: 'Chia Seeds',
    source: 'mock', photo: null,
    per100g: { kcal: 486, protein: 17, carbs: 42, fat: 31, fiber: 34 },
    servings: [
      { label: '1 tbsp (12 g)', grams: 12 },
      { label: '2 tbsp (24 g)', grams: 24 },
    ],
  },
  {
    id: 'mock-flaxseeds',
    name: 'Flaxseeds (Alsi)',
    source: 'mock', photo: null,
    per100g: { kcal: 534, protein: 18, carbs: 29, fat: 42, fiber: 27 },
    servings: [
      { label: '1 tbsp (10 g)', grams: 10 },
      { label: '100 g', grams: 100 },
    ],
  },

  // ─── Beverages ───────────────────────────────────────────────────────────
  {
    id: 'mock-masala-chai',
    name: 'Masala Chai (with milk)',
    brand: 'Beverage',
    source: 'mock', photo: null,
    per100g: { kcal: 55, protein: 1.7, carbs: 8, fat: 1.9, fiber: 0 },
    servings: [
      { label: '1 cup (150 ml)', grams: 150 },
      { label: '1 mug (250 ml)', grams: 250 },
    ],
  },
  {
    id: 'mock-coffee-milk',
    name: 'Coffee with Milk & Sugar',
    brand: 'Beverage',
    source: 'mock', photo: null,
    per100g: { kcal: 50, protein: 1.5, carbs: 7, fat: 1.8, fiber: 0 },
    servings: [
      { label: '1 cup (150 ml)', grams: 150 },
      { label: '1 mug (240 ml)', grams: 240 },
    ],
  },
  {
    id: 'mock-orange-juice',
    name: 'Orange Juice (fresh)',
    brand: 'Beverage',
    source: 'mock', photo: null,
    per100g: { kcal: 45, protein: 0.7, carbs: 10.4, fat: 0.2, fiber: 0.2 },
    servings: [
      { label: '1 glass (200 ml)', grams: 200 },
      { label: '100 ml', grams: 100 },
    ],
  },
  {
    id: 'mock-coconut-water',
    name: 'Coconut Water',
    brand: 'Beverage',
    source: 'mock', photo: null,
    per100g: { kcal: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1.1 },
    servings: [
      { label: '1 glass (200 ml)', grams: 200 },
      { label: '1 coconut (~300 ml)', grams: 300 },
    ],
  },
  {
    id: 'mock-lassi-sweet',
    name: 'Sweet Lassi',
    brand: 'Beverage',
    source: 'mock', photo: null,
    per100g: { kcal: 75, protein: 2.8, carbs: 12, fat: 2, fiber: 0 },
    servings: [
      { label: '1 glass (250 ml)', grams: 250 },
      { label: '100 ml', grams: 100 },
    ],
  },
  {
    id: 'mock-buttermilk',
    name: 'Buttermilk (Chaas)',
    brand: 'Beverage',
    source: 'mock', photo: null,
    per100g: { kcal: 40, protein: 3, carbs: 5, fat: 0.9, fiber: 0 },
    servings: [
      { label: '1 glass (200 ml)', grams: 200 },
    ],
  },

  // ─── Condiments & Oils ───────────────────────────────────────────────────
  {
    id: 'mock-olive-oil',
    name: 'Olive Oil',
    brand: 'Oil',
    source: 'mock', photo: null,
    per100g: { kcal: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    servings: [
      { label: '1 tsp (5 ml)', grams: 4.5 },
      { label: '1 tbsp (15 ml)', grams: 13.5 },
    ],
  },
  {
    id: 'mock-coconut-oil',
    name: 'Coconut Oil',
    brand: 'Oil',
    source: 'mock', photo: null,
    per100g: { kcal: 892, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    servings: [
      { label: '1 tsp (5 ml)', grams: 4.7 },
      { label: '1 tbsp (15 ml)', grams: 14 },
    ],
  },
  {
    id: 'mock-honey',
    name: 'Honey',
    source: 'mock', photo: null,
    per100g: { kcal: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    servings: [
      { label: '1 tsp (7 g)', grams: 7 },
      { label: '1 tbsp (21 g)', grams: 21 },
    ],
  },

  // ─── Fast Food / Restaurant ──────────────────────────────────────────────
  {
    id: 'mock-pizza-slice',
    name: 'Pizza (cheese, regular crust)',
    brand: 'Fast Food',
    source: 'mock', photo: null,
    per100g: { kcal: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3 },
    servings: [
      { label: '1 slice (107 g)', grams: 107 },
      { label: '2 slices (214 g)', grams: 214 },
    ],
  },
  {
    id: 'mock-burger',
    name: 'Beef Burger',
    brand: 'Fast Food',
    source: 'mock', photo: null,
    per100g: { kcal: 295, protein: 17, carbs: 24, fat: 14, fiber: 1.3 },
    servings: [
      { label: '1 burger (180 g)', grams: 180 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-french-fries',
    name: 'French Fries',
    brand: 'Fast Food',
    source: 'mock', photo: null,
    per100g: { kcal: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8 },
    servings: [
      { label: 'Small (71 g)', grams: 71 },
      { label: 'Medium (117 g)', grams: 117 },
      { label: 'Large (154 g)', grams: 154 },
    ],
  },
  {
    id: 'mock-pasta',
    name: 'Pasta (spaghetti), cooked',
    source: 'mock', photo: null,
    per100g: { kcal: 158, protein: 5.8, carbs: 31, fat: 0.9, fiber: 1.8 },
    servings: [
      { label: '1 cup (140 g)', grams: 140 },
      { label: '100 g', grams: 100 },
    ],
  },
  {
    id: 'mock-sandwich-turkey',
    name: 'Turkey Sandwich',
    source: 'mock', photo: null,
    per100g: { kcal: 230, protein: 14, carbs: 26, fat: 8, fiber: 2.2 },
    servings: [
      { label: '1 sandwich (200 g)', grams: 200 },
    ],
  },

  // ─── Snacks & Sweets ─────────────────────────────────────────────────────
  {
    id: 'mock-dark-chocolate',
    name: 'Dark Chocolate (70%+)',
    brand: 'Snack',
    source: 'mock', photo: null,
    per100g: { kcal: 598, protein: 7.8, carbs: 46, fat: 43, fiber: 10.9 },
    servings: [
      { label: '2 squares (20 g)', grams: 20 },
      { label: '1 bar (40 g)', grams: 40 },
    ],
  },
  {
    id: 'mock-greek-yogurt',
    name: 'Greek Yogurt (plain, 0% fat)',
    brand: 'Dairy',
    source: 'mock', photo: null,
    per100g: { kcal: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0 },
    servings: [
      { label: '1 small cup (100 g)', grams: 100 },
      { label: '1 large cup (200 g)', grams: 200 },
    ],
  },
  {
    id: 'mock-granola-bar',
    name: 'Granola Bar',
    brand: 'Snack',
    source: 'mock', photo: null,
    per100g: { kcal: 471, protein: 7, carbs: 64, fat: 20, fiber: 3.6 },
    servings: [
      { label: '1 bar (35 g)', grams: 35 },
    ],
  },
  {
    id: 'mock-salad',
    name: 'Garden Salad',
    source: 'mock', photo: null,
    per100g: { kcal: 25, protein: 1.2, carbs: 5, fat: 0.3, fiber: 2.1 },
    servings: [
      { label: '1 small bowl (100 g)', grams: 100 },
      { label: '1 large bowl (250 g)', grams: 250 },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Search function — multi-token matching with priority scoring

export function searchMockFoods(query, limit = 12) {
  const raw = query.trim().toLowerCase()
  if (!raw) return []

  const tokens = raw.split(/\s+/).filter(Boolean)

  const scored = MOCK_FOODS.map((food) => {
    const name = food.name.toLowerCase()
    const brand = (food.brand ?? '').toLowerCase()
    const combined = `${name} ${brand}`

    let score = 0

    // Full query matches
    if (name === raw) score = 200
    else if (name.startsWith(raw)) score = 150
    else if (name.includes(raw)) score = 100
    else if (combined.includes(raw)) score = 60

    // Individual token matches (for multi-word queries like "dal tadka")
    if (score === 0) {
      const tokenMatches = tokens.filter((t) => combined.includes(t)).length
      if (tokenMatches === tokens.length) score = 80
      else if (tokenMatches > 0) score = 30 * tokenMatches
    }

    return { food, score }
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored.map((r) => r.food)
}
