// GroceryListPage — /dashboard/journal/grocery-list
// Left: categorised checklist. Right: summary + export + health tip.
import { useState, useCallback, useMemo } from 'react'
import { useNutritionStore } from '../../../store/useNutritionStore'
import GroceryCategory from '../components/GroceryCategory/GroceryCategory'
import ShoppingSummary from '../components/ShoppingSummary/ShoppingSummary'
import ExportOptions from '../components/ExportOptions/ExportOptions'
import styles from './GroceryListPage.module.css'

const CATEGORIES = ['PROTEINS', 'VEGETABLES', 'GRAINS & PANTRY', 'DAIRY', 'FRUITS', 'CUSTOM LOGS']
const EMPTY = []

function todayIsoDate() {
  return new Date().toISOString().split('T')[0]
}

function ingredientCategory(name) {
  const label = name.toLowerCase()
  if (/(chicken|salmon|tuna|beef|lamb|egg|prawn|cod|protein)/.test(label)) return 'PROTEINS'
  if (/(spinach|greens|broccoli|pepper|tomato|carrot|onion|garlic|cucumber|celery|courgette|sweet potato|potato|vegetable)/.test(label)) return 'VEGETABLES'
  if (/(milk|yogurt|feta|halloumi|cheese|cottage)/.test(label)) return 'DAIRY'
  if (/(banana|blueberries|berries|apple|kiwi|mango|watermelon|fruit|dates|strawberries|lemon)/.test(label)) return 'FRUITS'
  return 'GRAINS & PANTRY'
}

const HEALTH_TIP = "Shop the perimeter of the store first; that's where the fresh, unprocessed foods are usually kept."

export default function GroceryListPage() {
  const getPlanForDate = useNutritionStore((state) => state.getPlanForDate)
  const mealLogsByDate = useNutritionStore((state) => state.mealLogsByDate)
  const [customItems, setCustomItems] = useState(EMPTY)
  const [plannedOverrides, setPlannedOverrides] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty] = useState('')
  const [newCat, setNewCat] = useState('PROTEINS')
  const [addErr, setAddErr] = useState('')

  const date = todayIsoDate()
  const todayPlan = getPlanForDate(date)
  const logsForToday = mealLogsByDate[date] ?? EMPTY

  const loggedPlanIds = useMemo(
    () => new Set(logsForToday.map((entry) => entry.planMealId).filter(Boolean)),
    [logsForToday]
  )

  const plannedItems = useMemo(() => {
    const todayIngredientMealIds = (todayPlan?.meals ?? EMPTY).reduce((acc, meal) => {
      (meal.groceries ?? EMPTY).forEach((ingredient) => {
        const key = ingredient.trim().toLowerCase()
        if (!acc[key]) acc[key] = new Set()
        acc[key].add(meal.id)
      })
      return acc
    }, {})

    const ingredientsMap = (todayPlan?.meals ?? EMPTY).reduce((acc, meal) => {
      ; (meal.groceries ?? EMPTY).forEach((rawIngredient) => {
        const ingredient = rawIngredient.trim()
        const key = ingredient.toLowerCase()

        if (!acc[key]) {
          acc[key] = {
            id: `plan-${todayPlan.date}-${key.replace(/[^a-z0-9]+/g, '-')}`,
            category: ingredientCategory(ingredient),
            name: ingredient,
            note: 'From today\'s meal plan',
            quantityCount: 0,
            checked: false,
          }
        }

        acc[key].quantityCount += 1
      })

      return acc
    }, {})

    return Object.entries(ingredientsMap).map(([key, item]) => {
      const mealIds = todayIngredientMealIds[key]
      const autoChecked = mealIds ? Array.from(mealIds).every((mealId) => loggedPlanIds.has(mealId)) : false

      return {
        id: item.id,
        category: item.category,
        name: item.name,
        note: item.note,
        quantity: `${item.quantityCount}x today`,
        checked: autoChecked,
      }
    })
  }, [todayPlan, loggedPlanIds])

  const customMealItems = useMemo(() => {
    const customLogs = logsForToday.filter((entry) => !entry.planMealId && entry.mealName)

    const grouped = customLogs.reduce((acc, entry) => {
      const key = entry.mealName.trim().toLowerCase()
      if (!acc[key]) {
        acc[key] = {
          id: `logged-${key.replace(/[^a-z0-9]+/g, '-')}`,
          category: 'CUSTOM LOGS',
          name: entry.mealName.trim(),
          note: 'From custom meal logs',
          quantityCount: 0,
        }
      }

      acc[key].quantityCount += 1
      return acc
    }, {})

    return Object.values(grouped).map((item) => ({
      ...item,
      quantity: `${item.quantityCount}x logged`,
      checked: false,
    }))
  }, [logsForToday])

  const mergedItems = useMemo(() => {
    const planned = plannedItems.map((item) => {
      const overrideChecked = plannedOverrides[item.id]
      return {
        ...item,
        checked: typeof overrideChecked === 'boolean' ? overrideChecked : item.checked,
      }
    })

    const fromCustomMeals = customMealItems.map((item) => {
      const overrideChecked = plannedOverrides[item.id]
      return {
        ...item,
        checked: typeof overrideChecked === 'boolean' ? overrideChecked : item.checked,
      }
    })

    return [...planned, ...fromCustomMeals, ...customItems]
  }, [plannedItems, customMealItems, plannedOverrides, customItems])

  // Toggle a single item
  const handleToggle = useCallback((id) => {
    if (id.startsWith('custom-')) {
      setCustomItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)))
      return
    }

    setPlannedOverrides((prev) => {
      const fallback = plannedItems.find((item) => item.id === id)?.checked ?? false
      return { ...prev, [id]: !(prev[id] ?? fallback) }
    })
  }, [plannedItems])

  // Computed summary stats
  const purchased = useMemo(() => mergedItems.filter((i) => i.checked).length, [mergedItems])

  const categoryOrder = useMemo(() => {
    const dynamicCategories = mergedItems
      .map((item) => item.category)
      .filter((category) => !CATEGORIES.includes(category))

    return [...CATEGORIES, ...Array.from(new Set(dynamicCategories))]
  }, [mergedItems])

  // Group items by category preserving order
  const grouped = useMemo(() => {
    return categoryOrder
      .map((cat) => ({ cat, items: mergedItems.filter((i) => i.category === cat) }))
      .filter((g) => g.items.length > 0)
  }, [categoryOrder, mergedItems])

  // Add custom item
  const handleAddItem = () => {
    if (!newName.trim()) { setAddErr('Item name is required'); return }
    if (!newQty.trim()) { setAddErr('Quantity is required'); return }
    setAddErr('')
    const id = `custom-${Date.now()}`
    setCustomItems((prev) => [...prev, { id, category: newCat, name: newName.trim(), note: 'Custom item', quantity: newQty.trim(), checked: false }])
    setNewName(''); setNewQty(''); setShowAdd(false)
  }

  const handleExportPdf = () => {
    const lines = ['Smart Grocery List', '=================', '']
    categoryOrder.forEach((cat) => {
      const catItems = mergedItems.filter((i) => i.category === cat)
      if (!catItems.length) return
      lines.push(cat, '-'.repeat(cat.length))
      catItems.forEach((i) => lines.push(`[${i.checked ? 'x' : ' '}] ${i.name} — ${i.quantity}`))
      lines.push('')
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'grocery-list.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    const text = mergedItems.map((i) => `${i.checked ? 'x' : 'o'} ${i.name} (${i.quantity})`).join('\n')
    navigator.clipboard.writeText(`Smart Grocery List\n\n${text}`)
  }

  return (
    <div className={styles.page}>

      {/* Page header */}
      <header className={styles.pageHeader}>
        <div className={styles.titleCol}>
          <h1 className={styles.heading}>Grocery List</h1>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={handleShare} className={styles.shareBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share List
          </button>
          <button type="button" onClick={() => setShowAdd((v) => !v)} className={styles.addBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Custom Item
          </button>
        </div>
      </header>

      {/* Add custom item inline form */}
      {showAdd && (
        <div className={styles.addForm}>
          <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className={styles.addSelect}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="Item name" value={newName}
            onChange={(e) => { setNewName(e.target.value); setAddErr('') }}
            className={styles.addInput} />
          <input type="text" placeholder="Qty e.g. 500g" value={newQty}
            onChange={(e) => { setNewQty(e.target.value); setAddErr('') }}
            className={`${styles.addInput} ${styles.addInputQty}`} />
          <button type="button" onClick={handleAddItem} className={styles.addConfirmBtn}>Add</button>
          <button type="button" onClick={() => { setShowAdd(false); setAddErr('') }} className={styles.addCancelBtn}>✕</button>
          {addErr && <p className={styles.addErr} role="alert">{addErr}</p>}
        </div>
      )}

      {/* Two-column layout */}
      <div className={styles.layout}>

        {/* Left — categorised list */}
        <div className={styles.listCol}>
          {grouped.map(({ cat, items: catItems }) => (
            <GroceryCategory key={cat} type={cat} items={catItems} onToggle={handleToggle} />
          ))}
        </div>

        {/* Right — summary + export + tip */}
        <div className={styles.sideCol}>
          <ShoppingSummary total={mergedItems.length} purchased={purchased} />
          <ExportOptions tip={HEALTH_TIP} onExportPdf={handleExportPdf} />
        </div>

      </div>
    </div>
  )
}
