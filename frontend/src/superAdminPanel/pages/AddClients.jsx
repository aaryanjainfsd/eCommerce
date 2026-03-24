import { useState } from "react";
import { addClient,addClientCredentials } from "../../shared/apis/services/client.service.jsx";
import styles from "../assets/css/clientManager.module.css";

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

    const [formData, setFormData] = useState(emptyForm); // start with a blank form
    const [clients,  setClients]  = useState([]);         // start with an empty list

    function handleInputChange(event) {

        const fieldName  = event.target.name;   // e.g. "email"    (which field changed?)
        const fieldValue = event.target.value;  // e.g. "john@..." (what did user type?)

        setFormData((previousValue) => ({
            ...previousValue,           // keep all other fields exactly the same
            [fieldName]: fieldValue,    // update only the field that just changed
        }));
    }

    function resetForm() 
    {
        setFormData(emptyForm);
    }

    async function handleSubmit(event) 
    {
        event.preventDefault();
        const clientPayload = {
            clientName: formData.clientName,
            businessName: formData.businessName,
            websiteURL: formData.websiteURL,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            category: formData.category
        };
        const addClientResponse = await addClient(clientPayload);
        
        const loginPayload = {
            clientId: addClientResponse.data._id, // use the real client ID returned from the backend
            username: formData.username,
            password: formData.password,
        };
        const addClientCredentialsResponse = await addClientCredentials(loginPayload);
        resetForm(); // clear the form so the user can add another client
    }

    function getClientIdentifier(client) {
        return client._id || client.id || client.email;
    }

    function handleDeleteClient(clientId) {
        setClients((previousClients) => previousClients.filter((client) => getClientIdentifier(client) !== clientId));
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
                                    type="text"
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
                        
                        <label className={styles.field}>
                            <span className={styles.label}>Category *</span>
                            <select name="category" value={formData.category} onChange={handleInputChange}>
                                <option value="starter">Starter Plan Client</option>
                                <option value="premium">Premium Plan Client</option>
                                <option value="luxury">Luxury Plan Client</option>
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
                                <th>Role</th>
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
                                    <tr key={getClientIdentifier(client)}>
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
                                                    onClick={() => handleDeleteClient(getClientIdentifier(client))}
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