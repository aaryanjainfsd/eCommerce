import { ArrowUpRight } from "lucide-react";
import styles from "../assets/css/sectionPage.module.css";

function SectionPage({ eyebrow, title, description, stats, highlights, tableTitle, rows }) {
    return (
        <section className={styles.page}>
            <div className={styles.hero}>
                <div>
                    <p className={styles.eyebrow}>{eyebrow}</p>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                </div>
                <div className={styles.badge}>Super Admin View</div>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((stat) => (
                    <article key={stat.label} className={styles.statCard}>
                        <p className={styles.statLabel}>{stat.label}</p>
                        <strong className={styles.statValue}>{stat.value}</strong>
                        <span className={styles.statMeta}>{stat.meta}</span>
                    </article>
                ))}
            </div>

            <div className={styles.contentGrid}>
                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <p className={styles.panelEyebrow}>Priority items</p>
                            <h3 className={styles.panelTitle}>Current focus</h3>
                        </div>
                    </div>

                    <div className={styles.highlightList}>
                        {highlights.map((item) => (
                            <div key={item.title} className={styles.highlightItem}>
                                <div>
                                    <strong className={styles.highlightTitle}>{item.title}</strong>
                                    <p className={styles.highlightText}>{item.text}</p>
                                </div>
                                <span className={styles.highlightStatus}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <p className={styles.panelEyebrow}>Live records</p>
                            <h3 className={styles.panelTitle}>{tableTitle}</h3>
                        </div>
                        <button type="button" className={styles.inlineAction}>
                            Review all
                            <ArrowUpRight size={16} />
                        </button>
                    </div>

                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Record</th>
                                    <th>Status</th>
                                    <th>Owner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.name}>
                                        <td>{row.name}</td>
                                        <td>{row.status}</td>
                                        <td>{row.owner}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
        </section>
    );
}

export default SectionPage;