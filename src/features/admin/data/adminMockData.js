// Mock data for admin panel demo

export const CLIENTS = [
  { id: 'c1',  name: 'Priya Sharma',    email: 'priya@example.com',    goal: 'Weight Loss',       status: 'Active',   lastActive: '2026-04-14', compliance: 92, plan: 'Keto Plan A',    daysInactive: 0 },
  { id: 'c2',  name: 'Ravi Mehta',      email: 'ravi@example.com',     goal: 'Muscle Gain',       status: 'Active',   lastActive: '2026-04-13', compliance: 85, plan: 'High Protein B', daysInactive: 1 },
  { id: 'c3',  name: 'Anjali Patel',    email: 'anjali@example.com',   goal: 'Disease Mgmt',      status: 'Alert',    lastActive: '2026-04-10', compliance: 48, plan: 'Diabetic Plan',  daysInactive: 4 },
  { id: 'c4',  name: 'Karan Verma',     email: 'karan@example.com',    goal: 'Weight Gain',       status: 'Active',   lastActive: '2026-04-14', compliance: 78, plan: 'Bulk Plan C',    daysInactive: 0 },
  { id: 'c5',  name: 'Sneha Iyer',      email: 'sneha@example.com',    goal: 'Maintenance',       status: 'Active',   lastActive: '2026-04-12', compliance: 95, plan: 'Balanced D',     daysInactive: 2 },
  { id: 'c6',  name: 'Arjun Nair',      email: 'arjun@example.com',    goal: 'Weight Loss',       status: 'Alert',    lastActive: '2026-04-09', compliance: 35, plan: 'Low Carb E',     daysInactive: 5 },
  { id: 'c7',  name: 'Meera Joshi',     email: 'meera@example.com',    goal: 'Disease Mgmt',      status: 'Active',   lastActive: '2026-04-13', compliance: 88, plan: 'PCOD Plan',      daysInactive: 1 },
  { id: 'c8',  name: 'Vikram Singh',    email: 'vikram@example.com',   goal: 'Muscle Gain',       status: 'Inactive', lastActive: '2026-04-06', compliance: 22, plan: 'High Protein B', daysInactive: 8 },
  { id: 'c9',  name: 'Deepa Rao',       email: 'deepa@example.com',    goal: 'Weight Loss',       status: 'Active',   lastActive: '2026-04-14', compliance: 91, plan: 'Keto Plan A',    daysInactive: 0 },
  { id: 'c10', name: 'Rohit Gupta',     email: 'rohit@example.com',    goal: 'Maintenance',       status: 'Alert',    lastActive: '2026-04-11', compliance: 60, plan: 'Balanced D',     daysInactive: 3 },
  { id: 'c11', name: 'Nisha Kapoor',    email: 'nisha@example.com',    goal: 'Weight Loss',       status: 'Active',   lastActive: '2026-04-14', compliance: 87, plan: 'Low Carb E',     daysInactive: 0 },
  { id: 'c12', name: 'Suresh Pillai',   email: 'suresh@example.com',   goal: 'Disease Mgmt',      status: 'Active',   lastActive: '2026-04-13', compliance: 79, plan: 'Thyroid Plan',   daysInactive: 1 },
]

export const ACTIVITY_FEED = [
  { id: 1, client: 'Priya Sharma',  action: 'Logged breakfast — Oats with banana',     time: '8:32 AM',  type: 'meal' },
  { id: 2, client: 'Karan Verma',   action: 'Completed pre-consultation form',          time: '9:05 AM',  type: 'consult' },
  { id: 3, client: 'Sneha Iyer',    action: 'Logged 2.5L water intake',                time: '10:14 AM', type: 'water' },
  { id: 4, client: 'Ravi Mehta',    action: 'Logged lunch — Chicken salad',            time: '1:22 PM',  type: 'meal' },
  { id: 5, client: 'Meera Joshi',   action: 'Booked appointment for Apr 16',           time: '2:45 PM',  type: 'appointment' },
  { id: 6, client: 'Deepa Rao',     action: 'Logged weight: 63.4 kg',                 time: '3:10 PM',  type: 'progress' },
  { id: 7, client: 'Nisha Kapoor',  action: 'Uploaded blood report',                   time: '4:01 PM',  type: 'document' },
]

export const DIET_PLAN_TEMPLATES = [
  { id: 'tp1', name: 'Keto Plan A',    goal: 'Weight Loss',  clients: 8,  kcal: 1400, lastUpdated: '2026-04-10' },
  { id: 'tp2', name: 'High Protein B', goal: 'Muscle Gain',  clients: 6,  kcal: 2200, lastUpdated: '2026-04-08' },
  { id: 'tp3', name: 'Balanced D',     goal: 'Maintenance',  clients: 10, kcal: 1800, lastUpdated: '2026-04-12' },
  { id: 'tp4', name: 'Low Carb E',     goal: 'Weight Loss',  clients: 5,  kcal: 1300, lastUpdated: '2026-04-05' },
  { id: 'tp5', name: 'Diabetic Plan',  goal: 'Disease Mgmt', clients: 4,  kcal: 1600, lastUpdated: '2026-04-11' },
  { id: 'tp6', name: 'PCOD Plan',      goal: 'Disease Mgmt', clients: 3,  kcal: 1700, lastUpdated: '2026-04-09' },
  { id: 'tp7', name: 'Thyroid Plan',   goal: 'Disease Mgmt', clients: 3,  kcal: 1650, lastUpdated: '2026-04-07' },
  { id: 'tp8', name: 'Bulk Plan C',    goal: 'Muscle Gain',  clients: 4,  kcal: 2800, lastUpdated: '2026-04-06' },
]

export const PLAN_DAYS = [
  {
    day: 'Monday',
    meals: [
      { slot: 'Breakfast',    name: 'Oats with banana & almonds',    kcal: 350, protein: 12, carbs: 58, fat: 8 },
      { slot: 'Morning Snack', name: 'Greek yogurt with berries',    kcal: 180, protein: 15, carbs: 22, fat: 3 },
      { slot: 'Lunch',        name: 'Grilled chicken salad',         kcal: 420, protein: 38, carbs: 18, fat: 12 },
      { slot: 'Afternoon Snack', name: 'Apple + peanut butter',      kcal: 200, protein: 6,  carbs: 28, fat: 9 },
      { slot: 'Dinner',       name: 'Paneer tikka + dal + roti',     kcal: 520, protein: 28, carbs: 55, fat: 14 },
    ],
  },
  {
    day: 'Tuesday',
    meals: [
      { slot: 'Breakfast',    name: 'Poha with vegetables',          kcal: 320, protein: 8,  carbs: 62, fat: 5 },
      { slot: 'Morning Snack', name: 'Mixed nuts & seeds',           kcal: 160, protein: 5,  carbs: 8,  fat: 14 },
      { slot: 'Lunch',        name: 'Brown rice + rajma + salad',    kcal: 480, protein: 22, carbs: 78, fat: 7 },
      { slot: 'Afternoon Snack', name: 'Coconut water + banana',     kcal: 150, protein: 2,  carbs: 36, fat: 1 },
      { slot: 'Dinner',       name: 'Tofu stir fry + quinoa',        kcal: 430, protein: 26, carbs: 48, fat: 11 },
    ],
  },
]

export const ORDERS = [
  { id: 'ORD-1041', client: 'Priya Sharma',  items: 'Green Detox Smoothie × 2',           amount: 39.98, status: 'Delivered', date: '2026-04-12', payment: 'UPI' },
  { id: 'ORD-1040', client: 'Ravi Mehta',    items: 'Whey Protein Combo',                 amount: 54.99, status: 'Shipped',   date: '2026-04-13', payment: 'COD' },
  { id: 'ORD-1039', client: 'Sneha Iyer',    items: 'Immunity Health Shot × 3',           amount: 29.97, status: 'Processing', date: '2026-04-14', payment: 'UPI' },
  { id: 'ORD-1038', client: 'Meera Joshi',   items: 'Omega 3 + Vitamin D Combo',          amount: 44.50, status: 'Delivered', date: '2026-04-10', payment: 'UPI' },
  { id: 'ORD-1037', client: 'Karan Verma',   items: 'Mass Gainer Protein × 1',            amount: 62.00, status: 'Delivered', date: '2026-04-09', payment: 'COD' },
  { id: 'ORD-1036', client: 'Deepa Rao',     items: 'Detox Pack + Green Shot',            amount: 48.00, status: 'Processing', date: '2026-04-14', payment: 'UPI' },
  { id: 'ORD-1035', client: 'Nisha Kapoor',  items: 'Collagen Peptides',                  amount: 34.99, status: 'Shipped',   date: '2026-04-13', payment: 'UPI' },
  { id: 'ORD-1034', client: 'Rohit Gupta',   items: 'Fiber Plus × 2 + Probiotic',         amount: 41.97, status: 'Delivered', date: '2026-04-08', payment: 'COD' },
]

export const TRANSACTIONS = [
  { id: 'TXN-5523', client: 'Priya Sharma',  type: 'Package',  amount: 5500, status: 'Success',  date: '2026-04-01', method: 'UPI' },
  { id: 'TXN-5524', client: 'Ravi Mehta',    type: 'Package',  amount: 5500, status: 'Success',  date: '2026-04-02', method: 'UPI' },
  { id: 'TXN-5525', client: 'Anjali Patel',  type: 'Product',  amount:  890, status: 'Success',  date: '2026-04-03', method: 'COD' },
  { id: 'TXN-5526', client: 'Karan Verma',   type: 'Package',  amount: 5500, status: 'Pending',  date: '2026-04-05', method: 'UPI' },
  { id: 'TXN-5527', client: 'Sneha Iyer',    type: 'Product',  amount: 1250, status: 'Success',  date: '2026-04-06', method: 'UPI' },
  { id: 'TXN-5528', client: 'Meera Joshi',   type: 'Package',  amount: 5500, status: 'Success',  date: '2026-04-07', method: 'Net Banking' },
  { id: 'TXN-5529', client: 'Vikram Singh',  type: 'Product',  amount:  650, status: 'Refunded', date: '2026-04-08', method: 'UPI' },
  { id: 'TXN-5530', client: 'Deepa Rao',     type: 'Package',  amount: 5500, status: 'Success',  date: '2026-04-10', method: 'UPI' },
  { id: 'TXN-5531', client: 'Nisha Kapoor',  type: 'Product',  amount: 1890, status: 'Success',  date: '2026-04-12', method: 'UPI' },
  { id: 'TXN-5532', client: 'Rohit Gupta',   type: 'Package',  amount: 5500, status: 'Pending',  date: '2026-04-13', method: 'COD' },
]

export const CONSULTATIONS = [
  { id: 's1', client: 'Priya Sharma',  date: '2026-04-16', time: '10:00 AM', type: 'Regular',   status: 'Upcoming', hasPreForm: true,  notes: '' },
  { id: 's2', client: 'Karan Verma',   date: '2026-04-16', time: '11:30 AM', type: 'Follow-up', status: 'Upcoming', hasPreForm: false, notes: '' },
  { id: 's3', client: 'Sneha Iyer',    date: '2026-04-17', time: '2:00 PM',  type: 'Regular',   status: 'Upcoming', hasPreForm: true,  notes: '' },
  { id: 's4', client: 'Meera Joshi',   date: '2026-04-17', time: '4:00 PM',  type: 'Follow-up', status: 'Upcoming', hasPreForm: true,  notes: '' },
  { id: 's5', client: 'Ravi Mehta',    date: '2026-04-10', time: '10:00 AM', type: 'Regular',   status: 'Completed', hasPreForm: true, notes: 'Protein intake on track. Increase resistance training.' },
  { id: 's6', client: 'Anjali Patel',  date: '2026-04-08', time: '3:00 PM',  type: 'Regular',   status: 'Completed', hasPreForm: true, notes: 'Blood sugar levels improving. Continue current plan.' },
  { id: 's7', client: 'Deepa Rao',     date: '2026-04-07', time: '11:00 AM', type: 'Follow-up', status: 'Completed', hasPreForm: false, notes: 'Good progress. -2.1 kg this month.' },
]

export const AVAILABLE_SLOTS = [
  { date: '2026-04-16', slots: ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM'] },
  { date: '2026-04-17', slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
  { date: '2026-04-18', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
  { date: '2026-04-21', slots: ['9:30 AM', '11:00 AM', '2:30 PM', '4:00 PM'] },
  { date: '2026-04-22', slots: ['10:00 AM', '12:00 PM', '3:00 PM'] },
]

export const BLOCKED_DATES = ['2026-04-19', '2026-04-20', '2026-04-25', '2026-04-26']
