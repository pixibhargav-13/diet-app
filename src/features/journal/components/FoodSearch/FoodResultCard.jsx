// FoodResultCard — a single row inside the search dropdown.

import styles from './FoodResultCard.module.css'

export default function FoodResultCard({ food, onClick }) {
    const kcal = food.per100g?.kcal
    const initial = (food.name ?? '?').charAt(0).toUpperCase()

    return (
        <button type="button" className={styles.row} onClick={onClick}>
            <div className={styles.thumbWrap}>
                {food.photo ? (
                    <img src={food.photo} alt="" className={styles.thumb} loading="lazy" />
                ) : (
                    <div className={styles.thumbFallback} aria-hidden="true">{initial}</div>
                )}
            </div>
            <div className={styles.info}>
                <p className={styles.name}>{food.name}</p>
                <p className={styles.meta}>
                    {food.brand && <span className={styles.brand}>{food.brand}</span>}
                    {food.brand && kcal != null && <span className={styles.sep}>·</span>}
                    {kcal != null && <span>{kcal} kcal / 100 g</span>}
                    {!food.brand && kcal == null && <span className={styles.dim}>Tap to view details</span>}
                </p>
            </div>
            <span className={styles.sourceTag} data-source={food.source}>
                {sourceLabel(food.source)}
            </span>
        </button>
    )
}

function sourceLabel(src) {
    switch (src) {
        case 'nutritionix': return 'NX'
        case 'usda': return 'USDA'
        case 'mock':
        default: return 'Local'
    }
}
