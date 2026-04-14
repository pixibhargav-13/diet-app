import { useState } from 'react'
import { DIET_PLAN_TEMPLATES, PLAN_DAYS, CLIENTS } from '../data/adminMockData'
import styles from './DietPlanManagement.module.css'

export default function DietPlanManagement() {
  const [selectedTemplate, setSelectedTemplate] = useState(DIET_PLAN_TEMPLATES[0])
  const [activeDay, setActiveDay] = useState(0)
  const [assignClient, setAssignClient] = useState('')
  const [assignSuccess, setAssignSuccess] = useState(false)
  const [cloneSuccess, setCloneSuccess] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [editingMeal, setEditingMeal] = useState(null)
  const [mealDraft, setMealDraft] = useState({})

  const day = PLAN_DAYS[activeDay] ?? PLAN_DAYS[0]

  const handleAssign = () => {
    if (!assignClient) return
    setAssignSuccess(true)
    setTimeout(() => setAssignSuccess(false), 2000)
  }

  const handleClone = () => {
    setCloneSuccess(true)
    setTimeout(() => setCloneSuccess(false), 2000)
  }

  const handleExport = () => {
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 2000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Diet Plan Management</h1>
          <p className={styles.sub}>Build, assign and manage diet plans for your clients.</p>
        </div>
        <button type="button" className={styles.newBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Template
        </button>
      </div>

      <div className={styles.layout}>
        {/* Template library */}
        <div className={styles.sidebar}>
          <p className={styles.sidebarTitle}>Template Library</p>
          <div className={styles.templateList}>
            {DIET_PLAN_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`${styles.templateItem} ${selectedTemplate?.id === t.id ? styles.templateItemActive : ''}`}
                onClick={() => setSelectedTemplate(t)}
              >
                <div className={styles.templateName}>{t.name}</div>
                <div className={styles.templateMeta}>
                  <span className={styles.goalChip}>{t.goal}</span>
                  <span className={styles.clientCount}>{t.clients} clients</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Plan editor */}
        <div className={styles.editor}>
          {selectedTemplate && (
            <>
              {/* Template header */}
              <div className={styles.editorHeader}>
                <div>
                  <h2 className={styles.templateTitle}>{selectedTemplate.name}</h2>
                  <div className={styles.templateStats}>
                    <span>{selectedTemplate.kcal} kcal / day</span>
                    <span>·</span>
                    <span>{selectedTemplate.clients} clients assigned</span>
                    <span>·</span>
                    <span>Updated {selectedTemplate.lastUpdated}</span>
                  </div>
                </div>
                <div className={styles.editorActions}>
                  <button type="button" className={styles.actionBtn} onClick={handleClone}>
                    {cloneSuccess ? '✓ Cloned' : 'Clone Plan'}
                  </button>
                  <button type="button" className={styles.actionBtn} onClick={handleExport}>
                    {exportSuccess ? '✓ Exported' : 'Export PDF'}
                  </button>
                </div>
              </div>

              {/* Assign to client */}
              <div className={styles.assignCard}>
                <p className={styles.assignLabel}>Assign to Client</p>
                <div className={styles.assignRow}>
                  <select value={assignClient} onChange={(e) => setAssignClient(e.target.value)} className={styles.assignSelect}>
                    <option value="">Select client…</option>
                    {CLIENTS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <button type="button" className={styles.assignBtn} onClick={handleAssign}>
                    {assignSuccess ? '✓ Assigned' : 'Assign Plan'}
                  </button>
                </div>
              </div>

              {/* Day tabs */}
              <div className={styles.dayTabs}>
                {PLAN_DAYS.map((d, i) => (
                  <button
                    key={d.day}
                    type="button"
                    className={`${styles.dayTab} ${activeDay === i ? styles.dayTabActive : ''}`}
                    onClick={() => setActiveDay(i)}
                  >
                    {d.day}
                  </button>
                ))}
                <button type="button" className={`${styles.dayTab} ${styles.addDayBtn}`}>+ Add Day</button>
              </div>

              {/* Meal slots */}
              <div className={styles.mealList}>
                {day.meals.map((meal, idx) => (
                  <div key={idx} className={styles.mealRow}>
                    <div className={styles.mealSlot}>{meal.slot}</div>
                    <div className={styles.mealDetails}>
                      {editingMeal === idx ? (
                        <div className={styles.mealEdit}>
                          <input
                            className={styles.mealInput}
                            value={mealDraft.name ?? meal.name}
                            onChange={(e) => setMealDraft((d) => ({ ...d, name: e.target.value }))}
                            placeholder="Meal name"
                          />
                          <div className={styles.macroInputs}>
                            {['kcal', 'protein', 'carbs', 'fat'].map((field) => (
                              <div key={field} className={styles.macroField}>
                                <label className={styles.macroLabel}>{field}</label>
                                <input
                                  type="number"
                                  className={styles.macroInput}
                                  value={mealDraft[field] ?? meal[field]}
                                  onChange={(e) => setMealDraft((d) => ({ ...d, [field]: e.target.value }))}
                                />
                              </div>
                            ))}
                          </div>
                          <div className={styles.mealEditActions}>
                            <button type="button" className={styles.saveSmallBtn} onClick={() => setEditingMeal(null)}>Save</button>
                            <button type="button" className={styles.cancelSmallBtn} onClick={() => { setEditingMeal(null); setMealDraft({}) }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className={styles.mealName}>{meal.name}</p>
                          <div className={styles.mealMacros}>
                            <span>{meal.kcal} kcal</span>
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                            <span>F: {meal.fat}g</span>
                          </div>
                        </>
                      )}
                    </div>
                    {editingMeal !== idx && (
                      <button type="button" className={styles.editBtn} onClick={() => { setEditingMeal(idx); setMealDraft({}) }}>Edit</button>
                    )}
                  </div>
                ))}
              </div>

              {/* Version note */}
              <div className={styles.versionNote}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Version history is tracked automatically. Last edit saved on {selectedTemplate.lastUpdated}.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
