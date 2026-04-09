import { create } from "zustand";
import { persist } from "zustand/middleware";

function sanitizeQuantity(value) {
    const quantity = Number(value);
    if (!Number.isFinite(quantity) || quantity <= 0) return 0;
    return Math.floor(quantity);
}

function normalizeAddress(address) {
    if (!address) return null;

    const next = {
        label: address.label?.trim() ?? "",
        line1: address.line1?.trim() ?? "",
        line2: address.line2?.trim() ?? "",
        phone: address.phone?.trim() ?? "",
    };

    if (!next.label || !next.line1 || !next.line2 || !next.phone) {
        return null;
    }

    return next;
}

export const useShopCartStore = create(
    persist(
        (set, get) => ({
            cartById: {},
            deliveryAddress: null,

            addItem: (productId, amount = 1) => {
                const increaseBy = sanitizeQuantity(amount);
                if (!productId || increaseBy <= 0) return;

                set((state) => ({
                    cartById: {
                        ...state.cartById,
                        [productId]: (state.cartById[productId] ?? 0) + increaseBy,
                    },
                }));
            },

            increaseItem: (productId) => {
                get().addItem(productId, 1);
            },

            decreaseItem: (productId) => {
                if (!productId) return;

                set((state) => {
                    const current = state.cartById[productId] ?? 0;
                    if (current <= 1) {
                        const { [productId]: _removed, ...rest } = state.cartById;
                        return { cartById: rest };
                    }

                    return {
                        cartById: {
                            ...state.cartById,
                            [productId]: current - 1,
                        },
                    };
                });
            },

            removeItem: (productId) => {
                if (!productId) return;

                set((state) => {
                    const { [productId]: _removed, ...rest } = state.cartById;
                    return { cartById: rest };
                });
            },

            clearCart: () => {
                set({ cartById: {} });
            },

            setDeliveryAddress: (address) => {
                set({ deliveryAddress: normalizeAddress(address) });
            },

            clearDeliveryAddress: () => {
                set({ deliveryAddress: null });
            },
        }),
        {
            name: "health-shop-cart",
            version: 1,
            partialize: (state) => ({
                cartById: state.cartById,
            }),
        }
    )
);
