import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Eye, Pencil, Trash2, Images  } from "lucide-react";
import styles from "../assets/css/products.module.css";
import { fetchProductsAPI } from "../apis/services/product.service";

function Products() {
    const [products, setProducts] = useState([]);
    const [popUpOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const productList = await fetchProductsAPI();
            setProducts(productList || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }


    async function deleteProductPermanently(productId)
    {
        try 
        {
        }
        catch(error)
        {
            console.error("Error deleting product:", error);
        }
        finally
        {
            setPopupOpen(false);
        }
    }

    const totalProducts = products.length;
    const activeListings = products.filter(
        (product) => product.data?.productVisibility === "Show on Storefront"
    ).length;
    const lowStockProducts = products.filter(
        (product) => product.data?.stockStatus === "Low Stock"
    ).length;
    const outOfStockProducts = products.filter(
        (product) => product.data?.stockStatus === "Out of Stock"
    ).length;

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
                    <h3>{totalProducts}</h3>
                    <span className={styles.statHint}>
                        Across all categories
                    </span>
                </article>
                <article className={styles.statCard}>
                    <p className={styles.statLabel}>Active Listings</p>
                    <h3>{activeListings}</h3>
                    <span className={styles.statHint}>
                        Visible to customers
                    </span>
                </article>
                <article className={styles.statCard}>
                    <p className={styles.statLabel}>Low Stock</p>
                    <h3>{lowStockProducts}</h3>
                    <span className={styles.statHint}>Needs replenishment</span>
                </article>
                <article className={styles.statCard}>
                    <p className={styles.statLabel}>Out of Stock</p>
                    <h3>{outOfStockProducts}</h3>
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
                                <th>Total Images</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>SKU</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const productId = product._id || product.id;
                                    const productImage =
                                        product.data?.images?.cloud || product.data?.images?.local;
                                    const stockStatus =
                                        product.data?.stockStatus || "Out of Stock";

                                    return (
                                        <tr key={productId}>
                                            <td>
                                                <div className={styles.productCell}>
                                                    <div className={styles.productThumb}>
                                                        {productImage ? (
                                                            <img
                                                                src={productImage}
                                                                alt={product.data?.name}
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            product.data?.name?.charAt(0) || "P"
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={styles.productName}>
                                                            {product.data?.name || "Unnamed Product"}
                                                        </p>
                                                        <span className={styles.productId}>
                                                            {productId}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{product.data?.category || "—"}</td>
                                            <td>{product.totalImagesUploaded ?? 0}</td>
                                            <td>{product.data?.stockQuantity ?? 0}</td>
                                            <td>
                                                <span
                                                    className={`${styles.statusBadge} ${
                                                        stockStatus === "In Stock"
                                                            ? styles.active
                                                            : stockStatus === "Low Stock"
                                                              ? styles.lowStock
                                                              : styles.outOfStock
                                                    }`}
                                                >
                                                    {stockStatus}
                                                </span>
                                            </td>
                                            <td>{product.data?.sku || "—"}</td>
                                            <td>
                                                <div className={styles.actionGroup}>
                                                    <Link
                                                        to={`/adminPanel/products/${productId}/photos`}
                                                        state={{ product }}
                                                        className={styles.photosButton}
                                                    >
                                                        <Images size={16} />
                                                        Add More Photos
                                                    </Link>
                                                    <button type="button" aria-label="View product" >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button type="button" aria-label="Edit product" >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button type="button" onClick={() => deleteProductPermanently(productId)} aria-label="Delete product" >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </section>
    );
}

export default Products;
