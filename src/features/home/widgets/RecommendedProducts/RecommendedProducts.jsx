import { Link } from "react-router-dom";
import styles from "./RecommendedProducts.module.css";
import product1 from "../../../../assets/products/product-1.webp";
import product2 from "../../../../assets/products/product-2.webp";
import product3 from "../../../../assets/products/product-3.webp";

const PRODUCTS = [
  { id: 1, name: "Green Detox Smoothie", price: "$6.50", img: product1 },
  { id: 2, name: "Immunity Booster Shot", price: "$4.99", img: product2 },
  { id: 3, name: "Protein Recovery Shake", price: "$7.25", img: product3 },
];

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export default function RecommendedProducts() {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>Recommended Products</span>
        <Link to="/dashboard/shop" className={styles.visitLink}>
          Visit Shop
        </Link>
      </div>

      <div className={styles.grid}>
        {PRODUCTS.map((p) => (
          <div key={p.id} className={styles.card}>
            <div className={styles.imgWrap}>
              <img src={p.img} alt={p.name} className={styles.img} />
            </div>
            <div className={styles.info}>
              <p className={styles.name}>{p.name}</p>
              <p className={styles.price}>{p.price}</p>
              <button type="button" className={styles.cartBtn}>
                <CartIcon />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
