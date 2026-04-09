import { Link } from "react-router-dom";
import { Plus, Search, Filter, Eye, Pencil, Trash2 } from "lucide-react";
import styles from "../assets/css/products.module.css";

function Products() {
    const products = [
        {
            id: "PRD-1001",
            name: "Premium Wireless Headphones",
            category: "Electronics",
            price: "4,999",
            stock: 42,
            status: "Active",
            sku: "HDP-WLS-001",
        },
        {
            id: "PRD-1002",
            name: "Organic Cotton T-Shirt",
            category: "Fashion",
            price: "899",
            stock: 130,
            status: "Active",
            sku: "TSH-ORG-210",
        },
        {
            id: "PRD-1003",
            name: "Smart LED Desk Lamp",
            category: "Home Decor",
            price: "1,799",
            stock: 8,
            status: "Low Stock",
            sku: "LMP-SMT-051",
        },
        {
            id: "PRD-1004",
            name: "Stainless Steel Water Bottle",
            category: "Lifestyle",
            price: "699",
            stock: 0,
            status: "Out of Stock",
            sku: "BTL-STL-087",
        },
    ];

    return (
        <section className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>Catalog Management</p>
                    <h1 className={styles.title}>Products</h1>
                    <p className={styles.subtitle}>
                        View your full product inventory, monitor stock status,
                        and manage listings.
                    </p>
                </div>

                <Link
                    to="/adminPanel/products/add"
                    className={styles.primaryButton}
                >
                    <Plus size={18} />
                    Add Product
                </Link>
            </header>

            <section className={styles.statsGrid}>
                <article className={styles.statCard}>
                    <p className={styles.statLabel}>Total Products</p>
                    <h3>248</h3>
                    <span className={styles.statHint}>
                        Across all categories
                    </span>
                </article>
                <article className={styles.statCard}>
                    <p className={styles.statLabel}>Active Listings</p>
                    <h3>219</h3>
                    <span className={styles.statHint}>
                        Visible to customers
                    </span>
                </article>
                <article className={styles.statCard}>
                    <p className={styles.statLabel}>Low Stock</p>
                    <h3>17</h3>
                    <span className={styles.statHint}>Needs replenishment</span>
                </article>
                <article className={styles.statCard}>
                    <p className={styles.statLabel}>Out of Stock</p>
                    <h3>12</h3>
                    <span className={styles.statHint}>
                        Currently unavailable
                    </span>
                </article>
            </section>

            <section className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <div className={styles.searchBox}>
                        <Search size={17} />
                        <input
                            type="text"
                            placeholder="Search by product name, SKU or category"
                        />
                    </div>

                    <button type="button" className={styles.secondaryButton}>
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>SKU</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className={styles.productCell}>
                                            <div
                                                className={styles.productThumb}
                                            >
                                                {product.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p
                                                    className={
                                                        styles.productName
                                                    }
                                                >
                                                    {product.name}
                                                </p>
                                                <span
                                                    className={styles.productId}
                                                >
                                                    {product.id}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{product.category}</td>
                                    <td>Rs. {product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${
                                                product.status === "Active"
                                                    ? styles.active
                                                    : product.status ===
                                                        "Low Stock"
                                                      ? styles.lowStock
                                                      : styles.outOfStock
                                            }`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                    <td>{product.sku}</td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <button
                                                type="button"
                                                aria-label="View product"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Edit product"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Delete product"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </section>
    );
}

export default Products;
