import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CartItemRow from './components/CartItemRow/CartItemRow'
import DeliveryAddress from './components/DeliveryAddress/DeliveryAddress'
import OrderSummary from './components/OrderSummary/OrderSummary'
import PaymentProtocol from './components/PaymentProtocol/PaymentProtocol'
import { SHOP_PRODUCTS } from './data/shopData'
import { useShopCartStore } from '../../store/useShopCartStore'
import styles from './CheckoutPage.module.css'

const EMPTY_ADDRESS = {
    label: '',
    line1: '',
    line2: '',
    phone: '',
}

const HANDLING = 5.5
const CONFIRM_REDIRECT_DELAY_MS = 5000

export default function CheckoutPage() {
    const navigate = useNavigate()

    const cartById = useShopCartStore((state) => state.cartById)
    const deliveryAddress = useShopCartStore((state) => state.deliveryAddress)
    const increaseItem = useShopCartStore((state) => state.increaseItem)
    const decreaseItem = useShopCartStore((state) => state.decreaseItem)
    const removeItem = useShopCartStore((state) => state.removeItem)
    const clearCart = useShopCartStore((state) => state.clearCart)
    const setDeliveryAddress = useShopCartStore((state) => state.setDeliveryAddress)
    const clearDeliveryAddress = useShopCartStore((state) => state.clearDeliveryAddress)

    const [placing, setPlacing] = useState(false)
    const [editingAddress, setEditingAddress] = useState(false)
    const [addressDraft, setAddressDraft] = useState(EMPTY_ADDRESS)
    const [addressError, setAddressError] = useState('')
    const [confirmedOrder, setConfirmedOrder] = useState(null)

    const items = useMemo(
        () =>
            SHOP_PRODUCTS.filter((product) => (cartById[product.id] ?? 0) > 0).map((product) => ({
                ...product,
                qty: cartById[product.id],
                badge: 'IN STOCK',
            })),
        [cartById]
    )

    const itemCount = useMemo(
        () => items.reduce((sum, item) => sum + item.qty, 0),
        [items]
    )
    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
        [items]
    )
    const handling = itemCount > 0 ? HANDLING : 0
    const total = subtotal + handling

    useEffect(() => {
        if (!confirmedOrder) return undefined

        const timeoutId = setTimeout(() => {
            navigate('/dashboard', { replace: true, state: { orderSuccess: true } })
        }, CONFIRM_REDIRECT_DELAY_MS)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [confirmedOrder, navigate])

    const openAddressEditor = useCallback(() => {
        setAddressDraft(deliveryAddress ?? EMPTY_ADDRESS)
        setAddressError('')
        setEditingAddress(true)
    }, [deliveryAddress])

    const closeAddressEditor = useCallback(() => {
        setEditingAddress(false)
        setAddressError('')
    }, [])

    const handleAddressInput = useCallback((event) => {
        const { name, value } = event.target
        setAddressDraft((current) => ({ ...current, [name]: value }))
        setAddressError('')
    }, [])

    const handleSaveAddress = useCallback(() => {
        const hasBlankField = Object.values(addressDraft).some((field) => !field.trim())
        if (hasBlankField) {
            setAddressError('Please complete all address fields before continuing.')
            return
        }

        setDeliveryAddress(addressDraft)
        setEditingAddress(false)
        setAddressError('')
    }, [addressDraft, setDeliveryAddress])

    const handlePlaceOrder = useCallback(
        async (method) => {
            if (itemCount === 0) {
                setAddressError('Your cart is empty. Add products before placing an order.')
                return
            }

            if (!deliveryAddress) {
                openAddressEditor()
                setAddressError('Please add a delivery address before placing your order.')
                return
            }

            void method
            setPlacing(true)
            try {
                await new Promise((resolve) => setTimeout(resolve, 1200))

                setConfirmedOrder({
                    itemCount,
                    total,
                    address: deliveryAddress,
                })
                clearCart()
                clearDeliveryAddress()
            } finally {
                setPlacing(false)
            }
        },
        [clearCart, clearDeliveryAddress, deliveryAddress, itemCount, openAddressEditor, total]
    )

    if (confirmedOrder) {
        return (
            <div className={styles.confirmationWrap}>
                <section className={styles.confirmationCard}>
                    <p className={styles.confirmationEyebrow}>Order Confirmed</p>
                    <h1 className={styles.confirmationTitle}>Your order is on the way</h1>
                    <p className={styles.confirmationText}>
                        Your order for {confirmedOrder.itemCount} item{confirmedOrder.itemCount !== 1 ? 's' : ''} totaling ${confirmedOrder.total.toFixed(2)} is confirmed.
                        You will be redirected to home in 5 seconds.
                    </p>
                    <div className={styles.confirmationAddress}>
                        <span className={styles.confirmationAddressLabel}>Delivering to</span>
                        <span>{confirmedOrder.address.label}</span>
                        <span>{confirmedOrder.address.line1}</span>
                        <span>{confirmedOrder.address.line2}</span>
                        <span>{confirmedOrder.address.phone}</span>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div>
                <h1 className={styles.heading}>Checkout</h1>
                <p className={styles.subtext}>Complete your payment and confirm your delivery details</p>
            </div>

            <div className={styles.layout}>
                <div className={styles.leftCol}>
                    <div className={styles.card}>
                        <p className={styles.cardSectionLabel}>Prescription &amp; Supplements</p>
                        {items.length === 0 ? (
                            <p className={styles.emptyMsg}>No products in cart. Add products to continue.</p>
                        ) : (
                            <div className={styles.itemList}>
                                {items.map((item) => (
                                    <CartItemRow
                                        key={item.id}
                                        item={item}
                                        onIncrease={increaseItem}
                                        onDecrease={decreaseItem}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.card}>
                        <DeliveryAddress
                            address={deliveryAddress}
                            onChangeAddress={openAddressEditor}
                        />

                        {editingAddress && (
                            <div className={styles.addressForm}>
                                <input
                                    type="text"
                                    name="label"
                                    value={addressDraft.label}
                                    onChange={handleAddressInput}
                                    className={styles.addressInput}
                                    placeholder="Address label (e.g. Home, Office)"
                                />
                                <input
                                    type="text"
                                    name="line1"
                                    value={addressDraft.line1}
                                    onChange={handleAddressInput}
                                    className={styles.addressInput}
                                    placeholder="Address line 1"
                                />
                                <input
                                    type="text"
                                    name="line2"
                                    value={addressDraft.line2}
                                    onChange={handleAddressInput}
                                    className={styles.addressInput}
                                    placeholder="Address line 2"
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    value={addressDraft.phone}
                                    onChange={handleAddressInput}
                                    className={styles.addressInput}
                                    placeholder="Phone number"
                                />
                                {addressError && <p className={styles.addressError}>{addressError}</p>}
                                <div className={styles.addressActions}>
                                    <button type="button" onClick={closeAddressEditor} className={styles.secondaryBtn}>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={handleSaveAddress} className={styles.primaryBtn}>
                                        Save Address
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.rightCol}>
                    {itemCount === 0 ? (
                        <div className={styles.emptyStateCard}>
                            <p className={styles.emptyStateTitle}>No products in cart</p>
                            <p className={styles.emptyStateText}>Add products from the shop to see your order summary and payment options.</p>
                            <button type="button" onClick={() => navigate('/dashboard/shop')} className={styles.primaryBtn}>
                                Add Products
                            </button>
                        </div>
                    ) : (
                        <>
                            <OrderSummary
                                subtotal={subtotal}
                                handling={handling}
                            />

                            <PaymentProtocol
                                onPlaceOrder={handlePlaceOrder}
                                placing={placing}
                            />
                        </>
                    )}

                    {!editingAddress && addressError && (
                        <p className={styles.addressError}>{addressError}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
