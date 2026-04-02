import styles from "../assets/css/header.module.css";

function Dashboard() {
    return (
        <section className={styles.dashboardPage}>
            <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
            <p className={styles.dashboardSubtitle}>
                Manage your operations from one place.
            </p>

            <div className={styles.dashboardGrid}>
                <article className={styles.dashboardCard}>
                    <h3>Total Products</h3>
                    <p>Track your current catalog and stock updates.</p>
                </article>
                <article className={styles.dashboardCard}>
                    <h3>Recent Orders</h3>
                    <p>Monitor incoming orders and fulfillment status.</p>
                </article>
                <article className={styles.dashboardCard}>
                    <h3>Partner Insights</h3>
                    <p>Review account health and business activity.</p>
                </article>
            </div>
        </section>
    );
}

export default Dashboard;