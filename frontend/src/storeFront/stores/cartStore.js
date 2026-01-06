import { create } from "zustand";
import { persist } from "zustand/middleware";


const useCartStore = create(
    persist(
        function (set, get) {
            return {
                cart: [],

                // -------------------------
                // ADD ITEM TO CART
                // -------------------------
                addToCart: function (id, quantity = 1) {
                    const cart = get().cart;
                    const existingItem = cart.find(function (item) {
                        return item.id === id
                    });

                    if (existingItem) {
                        const updatedCart = cart.map(function (item) {
                            if (item.id === id) {
                                return {
                                    ...item,
                                    quantity: item.quantity + quantity
                                };
                            }
                            else {
                                return item;
                            }
                        })

                        set({ cart: updatedCart });
                    }
                    else {
                        const newCart = [...cart, { id, quantity }];
                        set({ cart: newCart });
                    }
                },

                // -------------------------
                // INCREASE QUANTITY BY 1
                // -------------------------
                increaseQty: function (id) {
                    const cart = get().cart;
                    const updatedCart = cart.map(function (item) {
                        if (item.id === id) {
                            return { ...item, quantity: item.quantity + 1 };
                        }
                        else {
                            return item;
                        }
                    })
                    set({ cart: updatedCart });
                },

                // -------------------------
                // DECREASE QUANTITY BY 1
                // If quantity becomes 0, remove item
                // -------------------------
                decreaseQty: function (id) {
                    const cart = get.cart();
                    const updatedCart = cart.map(function (item) {
                        if (item.id === id) {
                            return { ...item, quantity: item.quantity - 1 };
                        }
                        else {
                            return item;
                        }
                    })
                        .filter(function (item) {
                            return item.quantity > 0;
                        })

                    set({ cart: updatedCart });
                },

                // -------------------------
                // SET QUANTITY MANUALLY
                // Used when user types quantity in input
                // -------------------------
                setQty: function (id, quantity) {
                    const cart = get().cart;

                    if (quantity <= 0) {
                        const updatedCart = cart.filter(function (item) {
                            return item.id !== id;
                        });

                        set({ cart: updatedCart });
                    } else {
                        const updatedCart = cart.map(function (item) {
                            if (item.id === id) {
                                return {
                                    ...item,
                                    quantity: quantity
                                };
                            } else {
                                return item;
                            }
                        });

                        set({ cart: updatedCart });
                    }
                },

                // -------------------------
                // REMOVE ITEM COMPLETELY
                // -------------------------
                removeFromCart: function (id) {
					const cart = get().cart;

					const updatedCart = cart.filter(function (item) {
						return item.id !== id;
					});

					set({ cart: updatedCart });
				}
            };
        },
        // Persist configuration
        {
            // This is the key name in localStorage
            name: "storedCart"
        }
    )
);

// Export the store so it can be used anywhere
export default useCartStore;
