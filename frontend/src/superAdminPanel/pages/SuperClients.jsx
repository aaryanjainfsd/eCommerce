import { useState } from "react";
import styles from "../assets/css/clientManager.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Define a blank form template
//
// This object holds the default (empty) value for every single form field.
// We use it in two places:
//   a) As the initial value when the component first loads (nothing typed yet)
//   b) In resetForm() to wipe everything clean after a submit or cancel
// ─────────────────────────────────────────────────────────────────────────────
const emptyForm = {
    clientName: "",
    businessName: "",
    websiteURL: "",
    email: "",
    phone: "",
    status: "Active", // pre-select "Active" so the dropdown already has a value
    username: "",
    password: "",
};

function SuperClients() {

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2 — Set up state variables
    //
    // State is React's way of remembering data while the page is open.
    // Every time a state value changes, React automatically re-renders
    // the part of the page that depends on it.
    //
    //  formData → holds every value the user has typed into the form fields
    //  clients  → holds the list of all clients added so far
    // ─────────────────────────────────────────────────────────────────────────
    const [formData, setFormData] = useState(emptyForm); // start with a blank form
    const [clients,  setClients]  = useState([]);         // start with an empty list

    // ─────────────────────────────────────────────────────────────────────────
    // handleInputChange
    //
    // WHAT IT DOES:
    //   Runs every time the user types in any input field or changes a select.
    //   It reads which field changed and what the new value is, then updates
    //   only that one field inside formData — all other fields stay the same.
    //
    // HOW IT WORKS — step by step:
    //   1. The browser fires an "onChange" event on the input.
    //   2. event.target is the actual <input> element that the user typed in.
    //   3. Every <input> in our form has a "name" attribute (e.g. name="email").
    //      That name matches the matching key inside formData exactly.
    //   4. We read  event.target.name  → tells us WHICH field changed
    //              event.target.value  → tells us WHAT the user typed
    //   5. setFormData replaces the old formData with a new object where:
    //        ...previousValue      → copies ALL existing fields as-is
    //        [fieldName]: fieldValue → then overwrites only the one that changed
    // ─────────────────────────────────────────────────────────────────────────
    function handleInputChange(event) {

        const fieldName  = event.target.name;   // e.g. "email"    (which field changed?)
        const fieldValue = event.target.value;  // e.g. "john@..." (what did user type?)

        setFormData((previousValue) => ({
            ...previousValue,           // keep all other fields exactly the same
            [fieldName]: fieldValue,    // update only the field that just changed
        }));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // resetForm
    //
    // WHAT IT DOES:
    //   Clears the entire form back to blank after a client is added.
    //
    // WHEN IS IT CALLED:
    //   After a client is successfully added (inside handleSubmit)
    // ─────────────────────────────────────────────────────────────────────────
    function resetForm() {

        // Replace whatever is in the form fields with the original blank values
        setFormData(emptyForm);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // handleSubmit
    //
    // WHAT IT DOES:
    //   Runs when the user clicks "Add Client".
    //   Sends the form data to the backend to create a new client.
    //
    // ── HOW DATA IS SENT TO THE BACKEND (real app flow) ──────────────────────
    //
    //   We send a POST request to the backend with formData as the body.
    //   The backend saves the data in the database and returns the new
    //   client object (including the real database ID it was assigned).
    //   We then add that returned client to our local clients list.
    //
    //   axios.post("/api/super-admin/clients", formData)
    //
    // ── FOR NOW (no backend connected yet) ───────────────────────────────────
    //   We store everything in local React state only.
    //   Data disappears on page refresh.
    //   The TODO comment below marks exactly where to add the real API call.
    // ─────────────────────────────────────────────────────────────────────────
    async function handleSubmit(event) {

        // Stop the browser from doing its default behaviour (refreshing the page)
        // when a form is submitted — we handle everything ourselves in JS
        event.preventDefault();

        // TODO: Replace the block below with a real backend call, like this:
        // ─────────────────────────────────────────────────────────────────────
        // const response = await axios.post(
        //     "/api/super-admin/clients",  // URL: backend endpoint for creating clients
        //     formData                     // BODY: all form fields sent as JSON
        // );
        // const savedClient = response.data; // backend returns the new client with a real DB id
        // Then use savedClient instead of newClient below
        // ─────────────────────────────────────────────────────────────────────

        // For now: build the new client object locally
        const newClient = {
            id: Date.now(), // temporary ID using timestamp — replace with real DB id later
            ...formData,    // spread all form fields (clientName, email, phone, etc.) in
        };

        // Add the new client to the FRONT of the list so it appears at the top
        setClients((previousClients) => [newClient, ...previousClients]);

        resetForm(); // clear the form so the user can add another client
    }

    function handleDeleteClient(clientId) {
        setClients((previousClients) => previousClients.filter((client) => client.id !== clientId));
    }

    return (
        <section className={styles.page}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.title}>Add Client</h2>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Client Details Section */}
                    <fieldset className={styles.formSection}>
                        <legend className={styles.sectionTitle}>Client Details</legend>
                        
                        <div className={styles.fieldGroup}>
                            <label className={styles.field}>
                                <span className={styles.label}>Client Name *</span>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </label>

                            <label className={styles.field}>
                                <span className={styles.label}>Business Name *</span>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleInputChange}
                                    placeholder="ABC Corp"
                                    required
                                />
                            </label>
                        </div>

                        <label className={styles.field}>
                            <span className={styles.label}>Website URL *</span>
                            <input
                                type="text"
                                name="websiteURL"
                                value={formData.websiteURL}
                                onChange={handleInputChange}
                                placeholder="https://example.com"
                                required
                            />
                        </label>

                        <div className={styles.fieldGroup}>
                            <label className={styles.field}>
                                <span className={styles.label}>Email *</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                    required
                                />
                            </label>

                            <label className={styles.field}>
                                <span className={styles.label}>Phone *</span>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+1 (555) 123-4567"
                                    required
                                />
                            </label>
                        </div>

                        <label className={styles.field}>
                            <span className={styles.label}>Status *</span>
                            <select name="status" value={formData.status} onChange={handleInputChange}>
                                <option value="Active">Active</option>
                                <option value="Onboarding">Onboarding</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </label>
                    </fieldset>

                    {/* Login Credentials Section */}
                    <fieldset className={styles.formSection}>
                        <legend className={styles.sectionTitle}>Login Credentials</legend>
                        
                        
                            <label className={styles.field}>
                                <span className={styles.label}>Username *</span>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Enter username"
                                    required
                                />
                            </label>

                            <label className={styles.field}>
                                <span className={styles.label}>Password *</span>
                                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter password" required />
                            </label>
                        
                    </fieldset>

                    <button type="submit" className={styles.primaryButton}>
                        Add Client
                    </button>
                </form>
            </div>

            <div className={styles.card}>
                <h2 className={styles.title}>Added Clients</h2>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Client Name</th>
                                <th>Business Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.emptyState}>
                                        No clients added yet.
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.id}>
                                        <td>{client.clientName}</td>
                                        <td>{client.businessName}</td>
                                        <td>{client.email}</td>
                                        <td>{client.phone}</td>
                                        <td>{client.status}</td>
                                        <td>
                                            <div className={styles.actionRow}>
                                                <button
                                                    type="button"
                                                    className={styles.editButton}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteClient(client.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default SuperClients;