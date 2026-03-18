// Import the `create` function from Zustand.
// This function is used to create a global state store.
import { create } from "zustand";


// Import the `persist` middleware from Zustand.
// Middleware means something that wraps around the store
// and adds extra functionality.
//
// In this case persist will:
// - save the store data in localStorage
// - restore the data after page refresh
import { persist } from "zustand/middleware";

// `create()` is the main function used to define a Zustand store.
const useAdminAuthStore = create(
	// This means the store data will be saved in localStorage.
	persist(
		// Zustand provides two important functions here:
		// set → used to update the state
		// get → used to read the current state
		function (set, get) {

			// The function must return an object.
			// This object contains:
			// - the state
			// - the functions that modify the state
			return {
				// This value represents is logged in default value
				isLoggedIn: false,

				// Initially both are null because
				// no user is logged in yet.
				user: {
					username: null,
					role: null
				},


				// -------------------------
				// SET USER AFTER LOGIN
				// Called when login is successful
				// -------------------------
				setUser: function (userData) {
					set({
						user: userData,
						isLoggedIn: true
					});
				},

				// -------------------------
				// LOGOUT ADMIN
				// -------------------------
				setLoggedOut: function () {
					set({
						isLoggedIn: false,
						user: {
							username: null,
							role: null
						}
					});
				}
			};
		},



		// -------------------------
		// PERSIST CONFIGURATION
		// -------------------------
		{

			// `name` defines the key used in localStorage.
			name: "admin-auth-storage",

			// partialize controls which parts of the store
			// should actually be saved in localStorage.
			partialize: function (state) {
				// We only save these two values:
				//
				// isLoggedIn
				// user
				//
				// If the store later contains other properties
				// they will NOT be persisted.
				return {

					isLoggedIn: state.isLoggedIn,
					user: state.user

				};
			}
		}
	)
);
export default useAdminAuthStore;