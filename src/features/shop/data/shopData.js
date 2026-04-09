import product1 from '../../../assets/products/product-1.webp'
import product2 from '../../../assets/products/product-2.webp'
import product3 from '../../../assets/products/product-3.webp'
import product4 from '../../../assets/products/product-4.webp'
import product5 from '../../../assets/products/product-5.webp'

export const PRODUCT_DETAILS = {
    p1: {
        id: 'p1',
        sku: 'HF-9921-CV',
        badge: 'Clinical Grade',
        name: 'Green Detox Smoothie',
        descriptor: '12oz • Organic Kale & Ginger',
        price: 12.5,
        rating: 4.9,
        reviews: 128,
        desc: 'A precision-engineered green blend designed for cellular detoxification and metabolic support. Formulated with cold-pressed organic kale, spinach and ginger to optimize your HealthFlow baseline.',
        img: product1,
        images: [product1, product2, product3, product4],
        ingredients: [
            { name: 'Organic Kale (cold-pressed)', amount: '4,000 mg' },
            { name: 'Spinach Extract', amount: '2,000 mg' },
            { name: 'Ginger Root', amount: '500 mg (20% gingerols)' },
            { name: 'Vitamin C (Ascorbic Acid)', amount: '200 mg (222% DV)' },
            { name: 'Chlorophyll Concentrate', amount: '100 mg' },
        ],
    },
    p2: {
        id: 'p2',
        sku: 'HF-4412-IB',
        badge: 'Clinical Grade',
        name: 'Immunity Booster Shot',
        descriptor: '20oz • Turmeric & Lemon',
        price: 4.95,
        rating: 4.8,
        reviews: 85,
        desc: 'A 20oz high-potency immunity shot with turmeric, lemon and black pepper extract for maximum bioavailability.',
        img: product2,
        images: [product2, product1, product3, product4],
        ingredients: [
            { name: 'Turmeric (95% Curcuminoids)', amount: '500 mg' },
            { name: 'Lemon (cold-pressed)', amount: '1,200 mg' },
            { name: 'Black Pepper Extract (BioPerine)', amount: '10 mg' },
            { name: 'Zinc Picolinate', amount: '15 mg (136% DV)' },
            { name: 'Vitamin D3 (Cholecalciferol)', amount: '2,000 IU (250% DV)' },
        ],
    },
    p3: {
        id: 'p3',
        sku: 'HF-3301-PR',
        badge: 'Clinical Grade',
        name: 'Protein Recovery Shake',
        descriptor: '16oz • 30g Whey Isolate',
        price: 14,
        rating: 5,
        reviews: 210,
        desc: 'A high-absorption post-workout shake with whey isolate and essential cofactors to support lean muscle recovery and reduce downtime after training sessions.',
        img: product3,
        images: [product3, product1, product5, product2],
        ingredients: [
            { name: 'Whey Protein Isolate', amount: '30 g' },
            { name: 'L-Leucine', amount: '2,500 mg' },
            { name: 'L-Glutamine', amount: '1,500 mg' },
            { name: 'Electrolyte Matrix', amount: '420 mg' },
            { name: 'Digestive Enzymes', amount: '120 mg' },
        ],
    },
    p4: {
        id: 'p4',
        sku: 'HF-7614-OM',
        badge: 'Clinical Grade',
        name: 'Omega-3 Combo',
        descriptor: '60 Capsules • EPA/DHA High Potency',
        price: 32,
        rating: 4.7,
        reviews: 56,
        desc: 'A high-potency EPA and DHA omega-3 formula designed to support cardiovascular, cognitive and inflammatory balance with ultra-purified fish oil.',
        img: product4,
        images: [product4, product5, product1, product2],
        ingredients: [
            { name: 'EPA (Eicosapentaenoic Acid)', amount: '720 mg' },
            { name: 'DHA (Docosahexaenoic Acid)', amount: '480 mg' },
            { name: 'Natural Vitamin E', amount: '10 IU' },
            { name: 'Astaxanthin', amount: '2 mg' },
            { name: 'Lemon Oil (Deodorized)', amount: '25 mg' },
        ],
    },
    p5: {
        id: 'p5',
        sku: 'HF-5508-DV',
        badge: 'Clinical Grade',
        name: 'Daily Vitamin Pack',
        descriptor: '30 Daily Pouches • Personalized Core',
        price: 45,
        rating: 4.9,
        reviews: 340,
        desc: 'A precision-engineered micronutrient matrix designed for cellular metabolic support. Formulated with high-bioavailability chelates and bio-identical vitamins to optimize your HealthFlow baseline.',
        img: product5,
        images: [product5, product1, product2, product3],
        ingredients: [
            { name: 'Vitamin D3 (Cholecalciferol)', amount: '2,000 IU (250% DV)' },
            { name: 'Magnesium Glycinate', amount: '200 mg (48% DV)' },
            { name: 'Zinc Picolinate', amount: '15 mg (136% DV)' },
            { name: 'Methylcobalamin (B12)', amount: '500 mcg (20833% DV)' },
            { name: 'Folate (5-MTHF)', amount: '400 mcg DFE (100% DV)' },
        ],
    },
}

const PRODUCT_ORDER = ['p1', 'p2', 'p3', 'p4', 'p5']

export const SHOP_PRODUCTS = PRODUCT_ORDER.map((id) => PRODUCT_DETAILS[id])

export const PRODUCT_REVIEWS_BY_ID = {
    p1: [
        { id: 'p1-r1', author: 'Maya S.', date: 'Mar 18, 2026', rawDate: '2026-03-18', rating: 5, headline: 'Great morning energy', body: 'I take this before work and my focus is smoother all morning. The taste is clean and not overly sweet.', helpful: 11 },
        { id: 'p1-r2', author: 'Rohan P.', date: 'Feb 27, 2026', rawDate: '2026-02-27', rating: 4, headline: 'Good formula', body: 'Solid ingredients and no crash. I would like a slightly larger serving size.', helpful: 5 },
        { id: 'p1-r3', author: 'Ella T.', date: 'Jan 30, 2026', rawDate: '2026-01-30', rating: 5, headline: 'Digests well', body: 'No bloating and my digestion feels better. Fits perfectly in my morning plan.', helpful: 8 },
    ],
    p2: [
        { id: 'p2-r1', author: 'Daniel K.', date: 'Mar 9, 2026', rawDate: '2026-03-09', rating: 5, headline: 'Great during travel', body: 'Used this during a busy travel week and stayed consistent with my routine.', helpful: 9 },
        { id: 'p2-r2', author: 'Neha R.', date: 'Feb 16, 2026', rawDate: '2026-02-16', rating: 4, headline: 'Strong flavor, works well', body: 'Potent flavor but effective. I usually pair it with breakfast.', helpful: 4 },
        { id: 'p2-r3', author: 'Chris B.', date: 'Jan 22, 2026', rawDate: '2026-01-22', rating: 5, headline: 'Noticeable support', body: 'Felt a difference in recovery after a few weeks. Easy to include daily.', helpful: 6 },
    ],
    p3: [
        { id: 'p3-r1', author: 'Ariana M.', date: 'Mar 21, 2026', rawDate: '2026-03-21', rating: 5, headline: 'Best post workout shake', body: 'Mixes quickly and helps me recover faster after strength sessions.', helpful: 13 },
        { id: 'p3-r2', author: 'Leo F.', date: 'Mar 2, 2026', rawDate: '2026-03-02', rating: 5, headline: 'High quality protein', body: 'No chalky texture. Great amino profile and easy on the stomach.', helpful: 10 },
        { id: 'p3-r3', author: 'Sam J.', date: 'Feb 11, 2026', rawDate: '2026-02-11', rating: 4, headline: 'Very good overall', body: 'Protein quality feels premium, just wish there were more flavor options.', helpful: 3 },
    ],
    p4: [
        { id: 'p4-r1', author: 'Olivia D.', date: 'Mar 14, 2026', rawDate: '2026-03-14', rating: 5, headline: 'Easy to take daily', body: 'No fishy aftertaste and quality seems excellent based on my routine results.', helpful: 7 },
        { id: 'p4-r2', author: 'Ishan V.', date: 'Feb 18, 2026', rawDate: '2026-02-18', rating: 4, headline: 'Clean and reliable', body: 'I like the purity standards and consistent dosing. Would buy again.', helpful: 4 },
        { id: 'p4-r3', author: 'Mina H.', date: 'Jan 24, 2026', rawDate: '2026-01-24', rating: 4, headline: 'Solid omega option', body: 'Good formulation and easy to include in my evening stack.', helpful: 2 },
    ],
    p5: [
        { id: 'p5-r1', author: 'Julian S.', date: 'Mar 25, 2026', rawDate: '2026-03-25', rating: 5, headline: 'Effective and clean ingredients', body: 'After three weeks of consistent use, I noticed less afternoon fatigue. The formula feels high purity.', helpful: 17 },
        { id: 'p5-r2', author: 'Priya K.', date: 'Mar 8, 2026', rawDate: '2026-03-08', rating: 5, headline: 'Best multi I have tried', body: 'This is the first multi where I felt a difference within a week. Great daily baseline.', helpful: 22 },
        { id: 'p5-r3', author: 'Tom W.', date: 'Feb 13, 2026', rawDate: '2026-02-13', rating: 4, headline: 'Strong quality', body: 'Excellent quality and ingredient transparency. Subscription pricing would make it even better.', helpful: 6 },
    ],
}

export const DEFAULT_REVIEW_BREAKDOWN = { 5: 75, 4: 15, 3: 6, 2: 2, 1: 2 }

export const REVIEW_BREAKDOWN_BY_ID = {
    p1: { 5: 72, 4: 19, 3: 6, 2: 2, 1: 1 },
    p2: { 5: 67, 4: 23, 3: 7, 2: 2, 1: 1 },
    p3: { 5: 82, 4: 14, 3: 3, 2: 1, 1: 0 },
    p4: { 5: 61, 4: 28, 3: 8, 2: 2, 1: 1 },
    p5: DEFAULT_REVIEW_BREAKDOWN,
}

export function getProductDetail(productId) {
    return PRODUCT_DETAILS[productId] ?? null
}
