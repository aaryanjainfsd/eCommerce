import styles from "../assets/css/dashboard.module.css";
import useAdminAuthStore from "../stores/adminAuthStore";


function Dashboard() {
    const { user } = useAdminAuthStore();
    const userDetails = user?.client_id || {};
    const clientName = userDetails?.clientName || "Partner";
    const businessName = userDetails?.businessName || "Your Business";

    // Keep these values safe even when backend counters are not ready yet.
    const totalProducts = Number(userDetails?.totalProducts || 0);
    const recentOrders = Number(userDetails?.recentOrders || 0);

    return (
        <section className={styles.dashboardPage}>
            <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
            <p className={styles.dashboardSubtitle}>
                Manage your operations from one place.
            </p>

            <article className={styles.welcomePanel}>
                <h2 className={styles.welcomeTitle}>
                    Welcome {clientName}
                </h2>
                <p className={styles.welcomeMessage}>
                    Get in and keep exploring your business,
                    <span className={styles.welcomeBusiness}>
                        {` ${businessName}`}
                    </span>
                    . Big results come from consistent effort every day.
                </p>
            </article>

            <div className={styles.dashboardGrid}>
                <article className={styles.dashboardCard}>
                    <h3>Total Products</h3>
                    <p className={styles.metricValue}>{totalProducts}</p>
                    <p className={styles.metricHint}>
                        Products currently available in your catalog.
                    </p>
                </article>
                <article className={styles.dashboardCard}>
                    <h3>Recent Orders</h3>
                    <p className={styles.metricValue}>{recentOrders}</p>
                    <p className={styles.metricHint}>
                        Latest incoming orders waiting for action.
                    </p>
                </article>
            </div>
        </section>
    );
}

export default Dashboard;