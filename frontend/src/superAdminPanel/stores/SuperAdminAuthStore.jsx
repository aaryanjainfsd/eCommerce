import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSuperAdminAuthStore = create(
    persist(
        function (set, get)
        {
            return {
                isLoggedIn: false,
                user: {
                    name: null,
                    username: null,
                    role: null
                },

                setUser: function (userData)
                {
                    set({
                        user: userData,
                        isLoggedIn: true
                    });
                },

                setLoggedOut: function ()
                {
                    set ({
                        isLoggedIn: false,
                        user: {
                            name: null,
                            username: null,
                            role: null
                        }
                    });
                }
            };
        },
        {
            name: "super-admin-user",
            partialize: function (state)
            {
                return {
                    isLoggedIn: state.isLoggedIn,
                    user: state.user
                }
            }
        }
    )
);

export default useSuperAdminAuthStore;