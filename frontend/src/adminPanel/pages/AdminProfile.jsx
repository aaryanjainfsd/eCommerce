import styles from "../assets/css/adminProfile.module.css";
import useAdminAuthStore from "../stores/adminAuthStore";

function formatText(value) {
    if (value === null || value === undefined || value === "") {
        return "Not provided";
    }

    return value;
}

function formatDate(value) {
    if (!value) {
        return "Not available";
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not available";
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getWebsiteHref(url) {
    if (!url) {
        return "#";
    }

    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function AdminProfile() {
    const { user } = useAdminAuthStore();
    const client = user?.client_id || {};
    const hasProfileData = Object.keys(client).length > 0;

    const detailItems = [
        { label: "Client Name", value: client.clientName },
        { label: "Business Name", value: client.businessName },
        { label: "Email Address", value: client.email },
        { label: "Phone Number", value: client.phone },
        { label: "Website URL", value: client.websiteURL, isLink: true },
        { label: "Category", value: client.category },
        { label: "Status", value: client.status },
        { label: "Client ID", value: client._id },
        { label: "Created At", value: formatDate(client.createdAt) },
        { label: "Updated At", value: formatDate(client.updatedAt) },
    ];

    return (
        <section className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Client Profile</h1>
                    <p className={styles.subtitle}>
                        View the full details saved for this admin account.
                    </p>
                </div>
                <span className={styles.statusBadge}>
                    {client.status || "Profile details"}
                </span>
            </div>

            {hasProfileData ? (
                <>
                    <div className={styles.heroGrid}>
                        <article className={styles.card}>
                            <p className={styles.eyebrow}>Primary Contact</p>
                            <h2 className={styles.name}>{formatText(client.clientName)}</h2>
                            <p className={styles.meta}>{formatText(client.businessName)}</p>
                        </article>

                        <article className={styles.card}>
                            <p className={styles.eyebrow}>Quick Contact</p>
                            <div className={styles.quickList}>
                                <span>{formatText(client.email)}</span>
                                <span>{formatText(client.phone)}</span>
                            </div>
                        </article>
                    </div>

                    <div className={styles.sectionGrid}>
                        <article className={styles.card}>
                            <h3 className={styles.cardTitle}>Complete Information</h3>
                            <div className={styles.detailsGrid}>
                                {detailItems.map((item) => (
                                    <div key={item.label} className={styles.detailItem}>
                                        <p className={styles.detailLabel}>{item.label}</p>
                                        {item.isLink && item.value ? (
                                            <a
                                                className={styles.detailLink}
                                                href={getWebsiteHref(item.value)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className={styles.detailValue}>
                                                {formatText(item.value)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className={styles.card}>
                            <h3 className={styles.cardTitle}>Security</h3>
                            <div className={styles.detailItem}>
                                <label className={styles.detailLabel} htmlFor="admin-password-status">
                                    Password
                                </label>
                                <input
                                    id="admin-password-status"
                                    className={styles.input}
                                    type="text"
                                    value="Password not changed yet"
                                    readOnly
                                />
                                <p className={styles.hint}>
                                    This field is currently shown for status only.
                                </p>
                            </div>
                        </article>
                    </div>
                </>
            ) : (
                <article className={styles.card}>
                    <h3 className={styles.cardTitle}>No profile data found</h3>
                    <p className={styles.hint}>
                        Client information is not available in the current session.
                    </p>
                </article>
            )}
        </section>
    );
}

export default AdminProfile;
