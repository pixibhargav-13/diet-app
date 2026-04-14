import { StarIcon } from "@heroicons/react/20/solid";
import styles from "./ProductSection.module.css";
import prodcut1 from "../../../assets/products/product-1.webp";
import prodcut2 from "../../../assets/products/product-2.webp";
import prodcut3 from "../../../assets/products/product-3.webp";
import prodcut4 from "../../../assets/products/product-4.webp";
import prodcut5 from "../../../assets/products/product-5.webp";

const USD_TO_INR = 83;
const formatINR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const products = [
  {
    id: 1,
    name: "Omega-3 Fish Oil",
    category: "Supplements",
    imageSrc: prodcut1,
    imageAlt: "Omega-3 fish oil supplement capsules",
    priceUSD: 28,
    rating: 5,
    reviewCount: 124,
  },
  {
    id: 2,
    name: "Whey Protein — Vanilla",
    category: "Protein",
    imageSrc: prodcut2,
    imageAlt: "Vanilla whey protein powder tub",
    priceUSD: 54,
    rating: 4,
    reviewCount: 87,
  },
  {
    id: 3,
    name: "Resistance Band Set",
    category: "Equipment",
    imageSrc: prodcut3,
    imageAlt: "Set of coloured resistance bands",
    priceUSD: 36,
    rating: 4,
    reviewCount: 62,
  },
  {
    id: 4,
    name: "Magnesium Complex",
    category: "Supplements",
    imageSrc: prodcut4,
    imageAlt: "Magnesium supplement bottle",
    priceUSD: 22,
    rating: 5,
    reviewCount: 49,
  },
  {
    id: 5,
    name: "BPA-Free Shaker Bottle",
    category: "Accessories",
    imageSrc: prodcut5,
    imageAlt: "BPA-free shaker bottle with measurement markings",
    priceUSD: 18,
    rating: 4,
    reviewCount: 38,
  },
];

export default function ProductSection() {
  return (
    <section
      id="products"
      className={styles.section}
      style={{ scrollMarginTop: "88px" }}
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.eyebrow}>Shop</p>
            <h2 className={styles.heading}>Recommended for you</h2>
          </div>
        </div>

        {/* Bordered grid */}
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.cell}>
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className={styles.image}
              />
              <div className={styles.cellBody}>
                <p className={styles.productCategory}>{product.category}</p>
                <h3 className={styles.productName}>{product.name}</h3>

                <div className={styles.starsWrap}>
                  <div className={styles.stars}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <StarIcon
                        key={i}
                        className={
                          product.rating > i
                            ? styles.starFilled
                            : styles.starEmpty
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className={styles.price}>
                  {formatINR.format(product.priceUSD * USD_TO_INR)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
