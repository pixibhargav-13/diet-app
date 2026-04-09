

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function dayLabel(offset) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const day = d.getDate()
  const name = DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]
  return { name, day, date: d.toISOString().split('T')[0] }
}

export const WEEKLY_PLAN = Array.from({ length: 7 }, (_, i) => {
  const { name, day, date } = dayLabel(i)

  const plans = [
    [
      { id: 'b', time: '08:00 AM', type: 'Breakfast', name: 'Greek Yogurt Parfait', kcal: 380, protein: 22, carbs: 45, fat: 9, groceries: ['Greek yogurt', 'Granola', 'Blueberries', 'Honey'] },
      { id: 'ms', time: '10:30 AM', type: 'Morning Snack', name: 'Almonds & Apple', kcal: 180, protein: 5, carbs: 22, fat: 10, groceries: ['Almonds (20g)', 'Apple'] },
      { id: 'l', time: '01:30 PM', type: 'Lunch', name: 'Grilled Chicken Salad', kcal: 450, protein: 42, carbs: 28, fat: 16, groceries: ['Chicken breast', 'Mixed greens', 'Quinoa', 'Olive oil', 'Lemon'] },
      { id: 'd', time: '07:00 PM', type: 'Dinner', name: 'Salmon with Roasted Vegetables', kcal: 520, protein: 38, carbs: 32, fat: 22, groceries: ['Wild salmon', 'Broccoli', 'Sweet potato', 'Garlic', 'Olive oil'] },
      { id: 'es', time: '09:30 PM', type: 'Evening Snack', name: 'Cottage Cheese & Berries', kcal: 160, protein: 18, carbs: 14, fat: 3, groceries: ['Cottage cheese', 'Strawberries'] },
    ],
    // Day 1
    [
      { id: 'b', time: '08:00 AM', type: 'Breakfast', name: 'Oatmeal with Banana & Nuts', kcal: 420, protein: 14, carbs: 68, fat: 12, groceries: ['Rolled oats', 'Banana', 'Walnuts', 'Skim milk'] },
      { id: 'l', time: '01:00 PM', type: 'Lunch', name: 'Turkey & Avocado Wrap', kcal: 480, protein: 35, carbs: 44, fat: 18, groceries: ['Turkey slices', 'Whole-wheat wrap', 'Avocado', 'Tomato', 'Spinach'] },
      { id: 'd', time: '07:00 PM', type: 'Dinner', name: 'Lentil Soup with Whole Grain Bread', kcal: 490, protein: 26, carbs: 72, fat: 8, groceries: ['Red lentils', 'Carrots', 'Onion', 'Cumin', 'Whole grain bread'] },
    ],
    // Day 2
    [
      { id: 'b', time: '07:30 AM', type: 'Breakfast', name: 'Scrambled Eggs & Spinach Toast', kcal: 390, protein: 26, carbs: 32, fat: 17, groceries: ['Eggs (3)', 'Baby spinach', 'Sourdough bread', 'Olive oil'] },
      { id: 'ms', time: '10:30 AM', type: 'Morning Snack', name: 'Protein Shake', kcal: 200, protein: 28, carbs: 12, fat: 4, groceries: ['Whey protein', 'Almond milk', 'Ice'] },
      { id: 'l', time: '01:00 PM', type: 'Lunch', name: 'Tuna Niçoise Salad', kcal: 440, protein: 38, carbs: 26, fat: 19, groceries: ['Canned tuna', 'Green beans', 'Boiled egg', 'Olives', 'Dijon mustard'] },
      { id: 'd', time: '07:30 PM', type: 'Dinner', name: 'Chicken Stir-Fry with Brown Rice', kcal: 530, protein: 40, carbs: 55, fat: 14, groceries: ['Chicken thigh', 'Brown rice', 'Bell pepper', 'Broccoli', 'Soy sauce'] },
    ],
    // Day 3
    [
      { id: 'b', time: '08:00 AM', type: 'Breakfast', name: 'Smoothie Bowl', kcal: 360, protein: 12, carbs: 62, fat: 8, groceries: ['Frozen açaí', 'Banana', 'Almond milk', 'Chia seeds', 'Granola'] },
      { id: 'l', time: '12:30 PM', type: 'Lunch', name: 'Falafel Pita with Tzatziki', kcal: 510, protein: 18, carbs: 66, fat: 18, groceries: ['Falafel (5pc)', 'Pita bread', 'Tzatziki', 'Cucumber', 'Tomato'] },
      { id: 'as', time: '03:30 PM', type: 'Afternoon Snack', name: 'Rice Cakes & Hummus', kcal: 190, protein: 6, carbs: 28, fat: 7, groceries: ['Rice cakes (3)', 'Hummus'] },
      { id: 'd', time: '07:00 PM', type: 'Dinner', name: 'Baked Cod with Quinoa', kcal: 480, protein: 44, carbs: 42, fat: 12, groceries: ['Cod fillet', 'Quinoa', 'Lemon', 'Dill', 'Capers'] },
    ],
    // Day 4
    [
      { id: 'b', time: '08:00 AM', type: 'Breakfast', name: 'Avocado Toast with Poached Eggs', kcal: 430, protein: 20, carbs: 38, fat: 22, groceries: ['Sourdough (2 slices)', 'Avocado', 'Eggs (2)', 'Chilli flakes'] },
      { id: 'ms', time: '10:30 AM', type: 'Morning Snack', name: 'Mixed Nuts & Dates', kcal: 210, protein: 5, carbs: 26, fat: 12, groceries: ['Cashews', 'Almonds', 'Medjool dates (2)'] },
      { id: 'l', time: '01:00 PM', type: 'Lunch', name: 'Grilled Halloumi & Vegetable Bowl', kcal: 490, protein: 24, carbs: 38, fat: 26, groceries: ['Halloumi', 'Courgette', 'Cherry tomatoes', 'Bulgur wheat', 'Mint'] },
      { id: 'd', time: '07:00 PM', type: 'Dinner', name: 'Beef & Vegetable Stew', kcal: 560, protein: 42, carbs: 48, fat: 18, groceries: ['Lean beef', 'Potato', 'Carrot', 'Celery', 'Tomato paste'] },
      { id: 'es', time: '09:00 PM', type: 'Evening Snack', name: 'Dark Chocolate & Almonds', kcal: 150, protein: 4, carbs: 12, fat: 11, groceries: ['Dark chocolate (2 squares)', 'Almonds (15g)'] },
    ],
    // Day 5
    [
      { id: 'b', time: '08:30 AM', type: 'Breakfast', name: 'Whole Grain Pancakes', kcal: 410, protein: 16, carbs: 62, fat: 11, groceries: ['Whole grain flour', 'Eggs', 'Almond milk', 'Maple syrup', 'Blueberries'] },
      { id: 'l', time: '01:30 PM', type: 'Lunch', name: 'Mediterranean Grain Bowl', kcal: 520, protein: 20, carbs: 72, fat: 16, groceries: ['Farro', 'Roasted chickpeas', 'Cucumber', 'Feta', 'Lemon tahini'] },
      { id: 'd', time: '07:30 PM', type: 'Dinner', name: 'Prawn & Vegetable Pasta', kcal: 540, protein: 36, carbs: 64, fat: 12, groceries: ['King prawns', 'Whole wheat pasta', 'Cherry tomatoes', 'Garlic', 'Basil'] },
    ],
    // Day 6
    [
      { id: 'b', time: '09:00 AM', type: 'Breakfast', name: 'Veggie Omelette', kcal: 350, protein: 24, carbs: 14, fat: 20, groceries: ['Eggs (3)', 'Bell pepper', 'Mushrooms', 'Cheddar (20g)', 'Olive oil'] },
      { id: 'ms', time: '11:00 AM', type: 'Morning Snack', name: 'Fruit Salad', kcal: 140, protein: 2, carbs: 36, fat: 1, groceries: ['Watermelon', 'Kiwi', 'Mango', 'Mint'] },
      { id: 'l', time: '02:00 PM', type: 'Lunch', name: 'Lamb Kofta with Flatbread', kcal: 580, protein: 36, carbs: 48, fat: 24, groceries: ['Ground lamb', 'Flatbread', 'Tzatziki', 'Red onion', 'Parsley'] },
      { id: 'd', time: '07:00 PM', type: 'Dinner', name: 'Baked Chicken Thighs & Sweet Potato', kcal: 510, protein: 44, carbs: 36, fat: 20, groceries: ['Chicken thighs', 'Sweet potato', 'Rosemary', 'Garlic', 'Lemon'] },
    ],
  ]

  const totalKcal = plans[i].reduce((s, m) => s + m.kcal, 0)

  return { name, day, date, meals: plans[i], totalKcal }
})
