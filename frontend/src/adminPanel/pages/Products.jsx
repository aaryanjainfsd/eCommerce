import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Eye, Pencil, Trash2, Images  } from "lucide-react";
import styles from "../assets/css/products.module.css";
import { fetchProductsAPI, deleteProductAPI } from "../apis/services/product.service";
import useAdminAuthStore from "../stores/adminAuthStore";

function getProductImageSources(product) {
    return [product.data?.images?.cloud, product.data?.images?.local].filter(
        (source, index, sources) => Boolean(source) && sources.indexOf(source) === index
    );
}

function Products() {
    const { user } = useAdminAuthStore();
    const [products, setProducts] = useState([]);
    const [popUpOpen, setPopupOpen] = useState(false);
    const [imageSourceOverrides, setImageSourceOverrides] = useState({});
    const clientIdValue =
        typeof user?.client_id === "string"
            ? user.client_id
            : user?.client_id?._id;

    useEffect(() => {
        if (!clientIdValue) {
            setProducts([]);
            return;
        }

        fetchProducts();
    }, [clientIdValue]);

    async function fetchProducts() {
        try {
            const productList = await fetchProductsAPI(clientIdValue);
            setProducts(productList || []);
            setImageSourceOverrides({});
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    function handleProductImageError(productIdentifier, imageSources) {
        setImageSourceOverrides((prev) => {
            const currentSource = Object.prototype.hasOwnProperty.call(prev, productIdentifier)
                ? prev[productIdentifier]
                : imageSources[0];
            const currentIndex = imageSources.indexOf(currentSource);
            const nextSource = currentIndex >= 0 ? imageSources[currentIndex + 1] : imageSources[1];

            return {
                ...prev,
                [productIdentifier]: nextSource || null,
            };
        });
    }


    async function deleteProductPermanently(productId)
    {
        try 
        {
            await deleteProductAPI(productId);
            await fetchProducts();
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
                    to="/adminPanel/product/add"
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
                                    const productIdentifier = product.data?.productCode || productId;
                                    const productImageSources = getProductImageSources(product);
                                    const productImage = Object.prototype.hasOwnProperty.call(imageSourceOverrides, productIdentifier)
                                        ? imageSourceOverrides[productIdentifier]
                                        : productImageSources[0];
                                    const stockStatus =
                                        product.data?.stockStatus || "Out of Stock";

                                    return (
                                        <tr key={productIdentifier}>
                                            <td>
                                                <div className={styles.productCell}>
                                                    <div className={styles.productThumb}>
                                                        {productImage ? (
                                                            <img
                                                                src={productImage}
                                                                alt={product.data?.name}
                                                                onError={() => handleProductImageError(productIdentifier, productImageSources)}
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
                                                            {productIdentifier}
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
                                                        to={`/adminPanel/product/addPhotos/${productIdentifier}`}
                                                        state={{ product }}
                                                        className={styles.photosButton}
                                                    >
                                                        <Images size={16} />
                                                        Add More Photos
                                                    </Link>
                                                    <button type="button" aria-label="View on StoreFront" >
                                                        <Eye size={16} />
                                                    </button>

                                                    <Link type="button" to={`/adminPanel/products/edit/${productIdentifier}`} state={{ product }} className={styles.editButton}>
                                                        <Pencil size={16} />
                                                    </Link>
                                                    <button type="button" onClick={() => deleteProductPermanently(productIdentifier)} aria-label="Delete product" >
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
