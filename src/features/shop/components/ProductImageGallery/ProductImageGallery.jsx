// ProductImageGallery — main image + thumbnail strip
import { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ProductImageGallery.module.css'

export default function ProductImageGallery({ images, name }) {
  const [active, setActive] = useState(0)

  return (
    <div className={styles.wrap}>
      {/* Main image */}
      <div className={styles.main}>
        <img
          src={images[active]}
          alt={`${name} view ${active + 1}`}
          className={styles.mainImg}
        />
      </div>

      {/* Thumbnails */}
      <div className={styles.thumbRow} role="list" aria-label="Product images">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`${styles.thumb} ${active === i ? styles.thumbActive : ''}`}
            aria-label={`View image ${i + 1}`}
            aria-pressed={active === i}
          >
            <img src={src} alt={`${name} thumbnail ${i + 1}`} className={styles.thumbImg} />
          </button>
        ))}
      </div>
    </div>
  )
}

ProductImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  name:   PropTypes.string.isRequired,
}
