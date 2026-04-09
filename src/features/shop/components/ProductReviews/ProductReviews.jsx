// ProductReviews — sentiment summary, write review form, scrollable list (sort + show more)
import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import styles from './ProductReviews.module.css'

// ── Sub-components ────────────────────────────────────────────────────────────

function Stars({ rating, size = 16, interactive = false, onRate }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`${styles.star} ${n <= Math.round(rating) ? styles.starFilled : styles.starEmpty}`}
          style={{ width: size, height: size, cursor: interactive ? 'pointer' : 'default' }}
          onClick={interactive ? () => onRate(n) : undefined}
          tabIndex={interactive ? 0 : -1}
          aria-label={interactive ? `Rate ${n} star${n !== 1 ? 's' : ''}` : undefined}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width={size} height={size}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

Stars.propTypes = { rating: PropTypes.number.isRequired, size: PropTypes.number, interactive: PropTypes.bool, onRate: PropTypes.func }

function SentimentPanel({ rating, totalReviews, breakdown }) {
  return (
    <div className={styles.sentiment}>
      <p className={styles.sentimentLabel}>Customer Sentiment</p>
      <div className={styles.sentimentScore}>
        <span className={styles.sentimentNum}>{rating.toFixed(1)}</span>
        <span className={styles.sentimentDenom}> / 5</span>
      </div>
      <div className={styles.sentimentStarsRow}>
        <Stars rating={rating} size={18} />
        <span className={styles.sentimentCount}>{totalReviews} reviews</span>
      </div>
      {/* Breakdown bars */}
      <div className={styles.breakdown}>
        {[5, 4, 3, 2, 1].map((star) => {
          const pct = breakdown[star] ?? 0
          return (
            <div key={star} className={styles.bRow}>
              <span className={styles.bStar}>{star}</span>
              <div className={styles.bTrack}>
                <div className={styles.bFill} style={{ width: `${pct}%`, background: star >= 4 ? '#2a4365' : star === 3 ? '#7faad6' : '#d1d5db' }} />
              </div>
              <span className={styles.bPct}>{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

SentimentPanel.propTypes = { rating: PropTypes.number.isRequired, totalReviews: PropTypes.number.isRequired, breakdown: PropTypes.object.isRequired }

function WriteReviewForm({ onSubmit }) {
  const [rating,   setRating]   = useState(0)
  const [headline, setHeadline] = useState('')
  const [body,     setBody]     = useState('')
  const [saving,   setSaving]   = useState(false)

  const handleSubmit = async () => {
    if (!rating || !body.trim()) return
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      onSubmit({ rating, headline, body })
      setRating(0); setHeadline(''); setBody('')
    } finally { setSaving(false) }
  }

  return (
    <div className={styles.writeForm}>
      <p className={styles.writeTitle}>Write a Review</p>

      <div className={styles.writeField}>
        <span className={styles.writeFieldLabel}>Overall Rating</span>
        <Stars rating={rating} size={24} interactive onRate={setRating} />
      </div>

      <div className={styles.writeField}>
        <label htmlFor="rev-headline" className={styles.writeFieldLabel}>Review Headline</label>
        <input id="rev-headline" type="text" value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Summarize your experience"
          className={styles.writeInput} />
      </div>

      <div className={styles.writeField}>
        <label htmlFor="rev-body" className={styles.writeFieldLabel}>Clinical Feedback</label>
        <textarea id="rev-body" rows={4} value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your detailed results with HealthFlow"
          className={styles.writeTextarea} />
      </div>

      <button type="button" onClick={handleSubmit} disabled={saving || !rating || !body.trim()} className={styles.writeSubmit}>
        {saving ? 'Submitting…' : 'Submit Review'}
      </button>
    </div>
  )
}

WriteReviewForm.propTypes = { onSubmit: PropTypes.func.isRequired }

function ReviewCard({ review }) {
  const initials = review.author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewAvatar}>{initials}</div>
        <div className={styles.reviewAuthorInfo}>
          <span className={styles.reviewAuthorName}>{review.author}</span>
          <span className={styles.reviewDate}>{review.date}</span>
        </div>
        <div className={styles.reviewStarsRight}>
          <Stars rating={review.rating} size={14} />
        </div>
      </div>

      {review.headline && <h4 className={styles.reviewHeadline}>{review.headline}</h4>}
      <p className={styles.reviewBody}>{review.body}</p>

      <div className={styles.reviewActions}>
        <button type="button" className={styles.reviewActionBtn}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <path d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 1H9.198a1.8 1.8 0 0 0-1.984 1.67l-1.06 9.336C5.94 13.318 7.006 14 8.25 14h2.082a1.8 1.8 0 0 0 1.742-1.367l1.56-6.24A1.8 1.8 0 0 0 11.89 4H11V2.25A1.25 1.25 0 0 0 9.75 1Z" />
          </svg>
          Helpful ({review.helpful})
        </button>
        <button type="button" className={styles.reviewActionBtn}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v8A1.5 1.5 0 0 0 3.5 13H6v4.5l3-3 3 3V13h2.5a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 2h-11Z" />
          </svg>
          Reply
        </button>
      </div>
    </div>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    author: PropTypes.string.isRequired, date: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired, headline: PropTypes.string,
    body: PropTypes.string.isRequired,   helpful: PropTypes.number.isRequired,
  }).isRequired,
}

// ── Main export ───────────────────────────────────────────────────────────────

const SORT_OPTIONS = ['Most Recent', 'Highest Rated', 'Lowest Rated', 'Most Helpful']
const PAGE_SIZE = 5

export default function ProductReviews({ reviews: initialReviews, rating, breakdown }) {
  const [reviews,    setReviews]    = useState(initialReviews)
  const [sortBy,     setSortBy]     = useState('Most Recent')
  const [showAll,    setShowAll]    = useState(false)

  const sorted = useMemo(() => {
    const r = [...reviews]
    if (sortBy === 'Most Recent')    r.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
    if (sortBy === 'Highest Rated')  r.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'Lowest Rated')   r.sort((a, b) => a.rating - b.rating)
    if (sortBy === 'Most Helpful')   r.sort((a, b) => b.helpful - a.helpful)
    return r
  }, [reviews, sortBy])

  const visible = showAll ? sorted : sorted.slice(0, PAGE_SIZE)

  const handleNewReview = (data) => {
    setReviews((prev) => [{
      author: 'You', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rawDate: new Date().toISOString(),
      rating: data.rating, headline: data.headline, body: data.body, helpful: 0,
    }, ...prev])
  }

  return (
    <section className={styles.section} aria-label="Product reviews">
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Clinical Testimonials</h2>
          <p className={styles.sectionDesc}>Data-driven testimonials from active HealthFlow users.</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left — sentiment + write form */}
        <div className={styles.leftCol}>
          <SentimentPanel rating={rating} totalReviews={reviews.length} breakdown={breakdown} />
          <WriteReviewForm onSubmit={handleNewReview} />
        </div>

        {/* Right — scrollable review list */}
        <div className={styles.rightCol}>
          {/* Sort bar */}
          <div className={styles.sortBar}>
            <span className={styles.sortLabel}>Sort by:</span>
            <div className={styles.sortWrap}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect} aria-label="Sort reviews">
                {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.sortChevron} width="14" height="14">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Scrollable container — shows 5 then "Load more" */}
          <div className={styles.reviewList}>
            {visible.map((r, i) => <ReviewCard key={i} review={r} />)}
          </div>

          {/* Load more */}
          {sorted.length > PAGE_SIZE && (
            <button type="button" onClick={() => setShowAll((v) => !v)} className={styles.loadMore}>
              {showAll ? 'Show Less' : `Load ${sorted.length - PAGE_SIZE} More Reviews`}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

ProductReviews.propTypes = {
  reviews:   PropTypes.array.isRequired,
  rating:    PropTypes.number.isRequired,
  breakdown: PropTypes.object.isRequired,
}
