import { useEffect, useState } from "react";
import {
    addClient,
    adminAuthCredentials,
    getAllClients,
    permanentlyDeleteClient,
    toggleClientStatus,
} from "../../shared/apis/services/client.service.jsx";
import styles from "../assets/css/clientManager.module.css";

const emptyForm = {
    clientName: "",
    businessName: "",
    websiteURL: "",
    email: "",
    phone: "",
    status: "Active", // pre-select "Active" so the dropdown already has a value
    category: "starter",
    username: "",
    password: "",
};

const categoryLabelMap = {
    starter: "Starter Plan",
    premium: "Premium Plan",
    luxury: "Luxury Plan",
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const VALID_STATUSES = ["Active", "Onboarding", "Inactive"];
const VALID_CATEGORIES = ["starter", "premium", "luxury"];

function validateForm(data) {
    const errors = {};

    const trimmedName = data.clientName.trim();
    if (!trimmedName) {
        errors.clientName = "Client name is required.";
    } else if (trimmedName.length < 2) {
        errors.clientName = "Must be at least 2 characters.";
    } else if (!/^[a-zA-Z\s.'\-]+$/.test(trimmedName)) {
        errors.clientName =
            "Only letters, spaces, dots, hyphens, and apostrophes allowed.";
    }

    if (!data.businessName.trim()) {
        errors.businessName = "Business name is required.";
    } else if (data.businessName.trim().length < 2) {
        errors.businessName = "Must be at least 2 characters.";
    }

    if (!data.websiteURL.trim()) {
        errors.websiteURL = "Website URL is required.";
    } else if (!URL_REGEX.test(data.websiteURL.trim())) {
        errors.websiteURL =
            "Enter a valid URL starting with http:// or https://.";
    }

    if (!data.email.trim()) {
        errors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
        errors.email = "Enter a valid email address (e.g. john@example.com).";
    }

    const phoneStr = String(data.phone).trim();
    if (!phoneStr) {
        errors.phone = "Phone number is required.";
    } else if (phoneStr.length < 10) {
        errors.phone = "Phone must be at least 10 digits.";
    } else if (phoneStr.length > 15) {
        errors.phone = "Phone must not exceed 15 digits.";
    }

    if (!VALID_STATUSES.includes(data.status)) {
        errors.status = "Please select a valid status.";
    }

    if (!VALID_CATEGORIES.includes(data.category)) {
        errors.category = "Please select a valid category.";
    }

    return errors;
}

function SuperClients() {
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [clients, setClients] = useState([]);
    const [isLoadingClients, setIsLoadingClients] = useState(false);
    const [statusUpdatingClientId, setStatusUpdatingClientId] = useState("");
    const [deletingClientId, setDeletingClientId] = useState("");
    const [clientsError, setClientsError] = useState("");

    async function fetchClientsFromDatabase() {
        try {
            setIsLoadingClients(true);
            setClientsError("");
            const response = await getAllClients();
            const visibleClients = (response.data || []).filter(
                (client) => client.status !== 0 && client.status !== "0",
            );
            setClients(visibleClients);
        } catch (error) {
            const errorMessage = error?.message || "Failed to load clients.";
            setClientsError(errorMessage);
        } finally {
            setIsLoadingClients(false);
        }
    }

    useEffect(() => {
        fetchClientsFromDatabase();
    }, []);

    function getCategoryLabel(category) {
        return categoryLabelMap[category] || category || "-";
    }

    function isClientInactive(statusValue) {
        const normalizedStatus =
            typeof statusValue === "string"
                ? statusValue.trim().toLowerCase()
                : "";

        return normalizedStatus === "inactive";
    }

    function handleInputChange(event) {
        const fieldName = event.target.name; // e.g. "email"    (which field changed?)
        let fieldValue = event.target.value; // e.g. "john@..." (what did user type?)

        if (fieldName === "phone") {
            fieldValue = fieldValue.replace(/\D/g, "");
        }

        setFormData((previousValue) => {
            const updatedValue = {
                ...previousValue,
                [fieldName]: fieldValue,
            };

            if (fieldName === "businessName") {
                updatedValue.username = fieldValue;
            }

            if (fieldName === "phone") {
                updatedValue.password = fieldValue;
            }

            return updatedValue;
        });

        setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }

    function resetForm() {
        setFormData(emptyForm);
        setErrors({});
        setTouched({});
    }

    function handleBlur(event) {
        const { name } = event.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const fieldErrors = validateForm(formData);
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }

    async function handleSubmit(event) {
        // console.log(errors);
        // console.log(touched);

        event.preventDefault();

        const allTouched = Object.keys(emptyForm).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {},
        );
        setTouched(allTouched);
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const autoUsername = formData.businessName;
            const autoPassword = formData.phone;

            const clientPayload = {
                clientName: formData.clientName,
                businessName: formData.businessName,
                websiteURL: formData.websiteURL,
                email: formData.email,
                phone: formData.phone,
                status: formData.status,
                category: formData.category,
            };
            const addClientResponse = await addClient(clientPayload);

            console.log("Client added successfully:", addClientResponse.data);

            const loginPayload = {
                client_id: addClientResponse.data._id, // use the real client ID returned from the backend
                username: autoUsername,
                password: autoPassword,
            };

            console.log(
                "Attempting to add admin credentials with payload:",
                loginPayload,
            );
            const adminAuthResponse = await adminAuthCredentials(loginPayload);
            console.log(
                "Admin auth credentials added successfully:",
                adminAuthResponse.data,
            );

            resetForm(); // clear the form so the user can add another client
            fetchClientsFromDatabase(); // refresh table with latest DB state
        } catch (error) {
            console.error("Failed to add client:", error);
        }
    }

    async function handleToggleClientStatus(client) {
        const clientId = client._id || client.id;

        try {
            setClientsError("");
            setStatusUpdatingClientId(clientId);
            const response = await toggleClientStatus(clientId);
            const updatedStatus = response?.data?.client?.status;

            setClients((prevClients) =>
                prevClients.map((item) =>
                    (item._id || item.id) === clientId
                        ? {
                              ...item,
                              status:
                                  updatedStatus ||
                                  (isClientInactive(item.status)
                                      ? "Active"
                                      : "Inactive"),
                          }
                        : item,
                ),
            );
        } catch (error) {
            const errorMessage =
                error?.message || "Failed to update client status.";
            setClientsError(errorMessage);
        } finally {
            setStatusUpdatingClientId("");
        }
    }

    async function handlePermanentDeleteClient(client) {
        const clientId = client._id || client.id;
        const businessLabel =
            client.businessName || client.clientName || "this client";

        const shouldDelete = window.confirm(
            `Permanently delete ${businessLabel}? This action cannot be undone.`,
        );

        if (!shouldDelete) return;

        try {
            setClientsError("");
            setDeletingClientId(clientId);
            await permanentlyDeleteClient(clientId);
            setClients((prevClients) =>
                prevClients.filter((item) => (item._id || item.id) !== clientId),
            );
        } catch (error) {
            const errorMessage =
                error?.message || "Failed to permanently delete client.";
            setClientsError(errorMessage);
        } finally {
            setDeletingClientId("");
        }
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
                        <legend className={styles.sectionTitle}>
                            Client Details
                        </legend>

                        <div className={styles.fieldGroup}>
                            <label className={styles.field}>
                                <span className={styles.label}>
                                    Client Name *
                                </span>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={
                                        touched.clientName && errors.clientName
                                            ? styles.inputError
                                            : ""
                                    }
                                    placeholder="John Doe"
                                />
                                {touched.clientName && errors.clientName && (
                                    <span className={styles.fieldError}>
                                        {errors.clientName}
                                    </span>
                                )}
                            </label>

                            <label className={styles.field}>
                                <span className={styles.label}>
                                    Business Name *
                                </span>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={
                                        touched.businessName &&
                                        errors.businessName
                                            ? styles.inputError
                                            : ""
                                    }
                                    placeholder="ABC Corp"
                                />
                                {touched.businessName &&
                                    errors.businessName && (
                                        <span className={styles.fieldError}>
                                            {errors.businessName}
                                        </span>
                                    )}
                            </label>
                        </div>

                        <label className={styles.field}>
                            <span className={styles.label}>Website URL *</span>
                            <input
                                type="text"
                                name="websiteURL"
                                value={formData.websiteURL}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={
                                    touched.websiteURL && errors.websiteURL
                                        ? styles.inputError
                                        : ""
                                }
                                placeholder="https://example.com"
                            />
                            {touched.websiteURL && errors.websiteURL && (
                                <span className={styles.fieldError}>
                                    {errors.websiteURL}
                                </span>
                            )}
                        </label>

                        <div className={styles.fieldGroup}>
                            <label className={styles.field}>
                                <span className={styles.label}>Email *</span>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={
                                        touched.email && errors.email
                                            ? styles.inputError
                                            : ""
                                    }
                                    placeholder="john@example.com"
                                />
                                {touched.email && errors.email && (
                                    <span className={styles.fieldError}>
                                        {errors.email}
                                    </span>
                                )}
                            </label>

                            <label className={styles.field}>
                                <span className={styles.label}>Phone *</span>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    inputMode="numeric"
                                    className={
                                        touched.phone && errors.phone
                                            ? styles.inputError
                                            : ""
                                    }
                                    placeholder="9876543210"
                                />
                                {touched.phone && errors.phone && (
                                    <span className={styles.fieldError}>
                                        {errors.phone}
                                    </span>
                                )}
                            </label>
                        </div>

                        <label className={styles.field}>
                            <span className={styles.label}>Status *</span>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={
                                    touched.status && errors.status
                                        ? styles.inputError
                                        : ""
                                }
                            >
                                <option value="Active">Active</option>
                                <option value="Onboarding">Onboarding</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {touched.status && errors.status && (
                                <span className={styles.fieldError}>
                                    {errors.status}
                                </span>
                            )}
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Category *</span>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={
                                    touched.category && errors.category
                                        ? styles.inputError
                                        : ""
                                }
                            >
                                <option value="starter">
                                    Starter Plan Client
                                </option>
                                <option value="premium">
                                    Premium Plan Client
                                </option>
                                <option value="luxury">
                                    Luxury Plan Client
                                </option>
                            </select>
                            {touched.category && errors.category && (
                                <span className={styles.fieldError}>
                                    {errors.category}
                                </span>
                            )}
                        </label>
                    </fieldset>

                    {/* Login Credentials Section */}
                    <fieldset className={styles.formSection}>
                        <legend className={styles.sectionTitle}>
                            Login Credentials
                        </legend>

                        <label className={styles.field}>
                            <span className={styles.label}>Username *</span>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                disabled
                                placeholder="Enter username"
                                required
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Password *</span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                disabled
                                placeholder="Enter password"
                                required
                            />
                        </label>
                    </fieldset>

                    <button type="submit" className={styles.primaryButton}>
                        Add Client
                    </button>
                </form>
            </div>

            <div className={styles.card}>
                <h2 className={styles.title}>Added Clients</h2>

                {clientsError && (
                    <p className={styles.emptyState}>{clientsError}</p>
                )}
                {isLoadingClients && (
                    <p className={styles.emptyState}>Loading clients...</p>
                )}

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Client Name</th>
                                <th>Business Name</th>
                                <th>Phone</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className={styles.emptyState}
                                    >
                                        No clients added yet.
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client, index) => (
                                    <tr
                                        key={
                                            client._id ||
                                            client.id ||
                                            client.email ||
                                            index
                                        }
                                        className={
                                            isClientInactive(client.status)
                                                ? styles.inactiveRow
                                                : ""
                                        }
                                    >
                                        <td>{client.clientName}</td>
                                        <td>{client.businessName}</td>
                                        <td>{client.phone}</td>
                                        <td>{client.username || "-"}</td>
                                        <td>{client.password || "-"}</td>
                                        <td>{client.status}</td>
                                        <td>
                                            {getCategoryLabel(client.category)}
                                        </td>
                                        <td>
                                            <div className={styles.actionRow}>
                                                <button
                                                    type="button"
                                                    className={styles.toggleButton}
                                                    onClick={() =>
                                                        handleToggleClientStatus(
                                                            client,
                                                        )
                                                    }
                                                    disabled={
                                                        statusUpdatingClientId ===
                                                            (client._id ||
                                                                client.id) ||
                                                        deletingClientId ===
                                                            (client._id ||
                                                                client.id)
                                                    }
                                                >
                                                    {statusUpdatingClientId ===
                                                    (client._id || client.id)
                                                        ? "Updating..."
                                                        : isClientInactive(
                                                                client.status,
                                                            )
                                                          ? "Activate"
                                                          : "Deactivate"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.deleteButton}
                                                    onClick={() =>
                                                        handlePermanentDeleteClient(
                                                            client,
                                                        )
                                                    }
                                                    disabled={
                                                        deletingClientId ===
                                                            (client._id ||
                                                                client.id) ||
                                                        statusUpdatingClientId ===
                                                            (client._id ||
                                                                client.id)
                                                    }
                                                >
                                                    {deletingClientId ===
                                                    (client._id || client.id)
                                                        ? "Deleting..."
                                                        : "Permanently Delete"}
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
