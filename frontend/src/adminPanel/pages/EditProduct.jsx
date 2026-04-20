import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Save, UploadCloud, CheckCircle2, XCircle, X } from "lucide-react";
import styles from "../assets/css/addProduct.module.css";
import { fetchProductAPI, updateProductAPI } from "../apis/services/product.service";

const initialProductState = {
    name: "",
    slug: "",
    category: "",
    sellingPrice: "",
    stockQuantity: "",
    stockStatus: "In Stock",
    shortDescription: "",
    brand: "",
    sku: "",
    mrp: "",
    image: null,
    productVisibility: "Show on Storefront",
    productLabel: "Standard Product",
};

function Popup({ show, type, message, onClose }) {
    if (!show) return null;

    const Icon = type === "success" ? CheckCircle2 : XCircle;

    return (
        <div className={styles.popupOverlay} onClick={onClose}>
            <div className={styles.popupDialog} onClick={(event) => event.stopPropagation()}>
                <button className={styles.popupClose} type="button" onClick={onClose} aria-label="Close popup">
                    <X size={18} />
                </button>

                <div className={styles.popupIconWrapper}>
                    <Icon
                        className={`${styles.popupIcon} ${type === "success" ? styles.popupIconSuccess : styles.popupIconError}`}
                    />
                </div>

                <h3 className={styles.popupTitle}>{type === "success" ? "Product updated" : "Error"}</h3>
                <p className={styles.popupMessage}>{message}</p>

                <button className={styles.popupButton} type="button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

function Loader() {
    return <span className={styles.buttonLoader} aria-hidden="true" />;
}

function createSlug(value = "") {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function formatSkuSegment(text, maxLength) {
    return text
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "")
        .slice(0, maxLength);
}

function generateSku(name, category) {
    const categorySegment = formatSkuSegment(category, 2) || "XX";
    const nameSegment = formatSkuSegment(name, 4) || "PRD";
    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    return `${categorySegment}-${nameSegment}-${uniqueNumber}`;
}

function mapProductToForm(product) {
    return {
        name: product.data?.name || "",
        slug: product.data?.slug || "",
        category: product.data?.category || "",
        sellingPrice: product.data?.sellingPrice ?? "",
        stockQuantity: product.data?.stockQuantity ?? "",
        stockStatus: product.data?.stockStatus || "In Stock",
        shortDescription: product.data?.shortDescription || "",
        brand: product.data?.brand || "",
        sku: product.data?.sku || "",
        mrp: product.data?.mrp ?? "",
        image: null,
        productVisibility: product.data?.productVisibility || "Show on Storefront",
        productLabel: product.data?.productLabel || "Standard Product",
    };
}

function EditProduct() {
    const { productId } = useParams();
    const location = useLocation();

    const [productData, setProductData] = useState(initialProductState);
    const [imagePreview, setImagePreview] = useState("");
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [isSkuModified, setIsSkuModified] = useState(false);
    const [isSlugModified, setIsSlugModified] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupMessage, setPopupMessage] = useState("");
    const [resetAfterPopup, setResetAfterPopup] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadProduct() {
            setIsLoading(true);
            setLoadError("");

            const productFromState = location.state?.product;

            if (productFromState && productFromState.data) {
                const formData = mapProductToForm(productFromState);
                if (!isMounted) return;

                setProductData(formData);
                setImagePreview(productFromState.data.images?.cloud || productFromState.data.images?.local || "");
                setIsSkuModified(true);
                setIsSlugModified(true);
                setIsLoading(false);
                return;
            }

            try {
                const product = await fetchProductAPI(productId);
                if (!isMounted) return;

                if (!product || !product.data) {
                    setLoadError("Product not found.");
                } else {
                    setProductData(mapProductToForm(product));
                    setImagePreview(product.data.images?.cloud || product.data.images?.local || "");
                    setIsSkuModified(true);
                    setIsSlugModified(true);
                }
            } catch (error) {
                setLoadError(error?.message || "Failed to load product data.");
                console.error("Error loading product:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProduct();

        return () => {
            isMounted = false;
        };
    }, [location.state, productId]);

    useEffect(() => {
        if (!productData.image) return;

        const previewUrl = URL.createObjectURL(productData.image);
        setImagePreview(previewUrl);

        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [productData.image]);

    function openPopup(type, message, resetOnClose = false) {
        setPopupType(type);
        setPopupMessage(message);
        setShowPopup(true);
        setResetAfterPopup(resetOnClose);
    }

    function closePopup() {
        setShowPopup(false);
        if (resetAfterPopup) {
            setProductData(initialProductState);
            setFileInputKey(Date.now());
            setIsSkuModified(false);
            setIsSlugModified(false);
            setResetAfterPopup(false);
        }
    }

    function handleChange(event) {
        const { name, value, type, files } = event.target;

        setProductData((prev) => {
            const nextData = {
                ...prev,
                [name]: type === "file" ? files[0] : value,
            };

            if (name === "sku") {
                setIsSkuModified(true);
                return nextData;
            }

            if (name === "slug") {
                setIsSlugModified(true);
                return nextData;
            }

            if (name === "name") {
                if (!isSlugModified) {
                    nextData.slug = createSlug(value);
                }

                if (!isSkuModified && value.trim() && prev.category.trim()) {
                    nextData.sku = generateSku(value, prev.category);
                }
            }

            if (name === "category" && !isSkuModified && prev.name.trim()) {
                nextData.sku = generateSku(prev.name, value);
            }

            return nextData;
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!productData.name.trim()) {
            openPopup("error", "Product name is required.");
            return;
        }

        if (!productData.category.trim()) {
            openPopup("error", "Product category is required.");
            return;
        }

        if (!productData.sku.trim()) {
            openPopup("error", "Product SKU is required.");
            return;
        }

        if (!productData.slug.trim()) {
            openPopup("error", "Product slug is required.");
            return;
        }

        if (!productData.brand.trim()) {
            openPopup("error", "Brand is required.");
            return;
        }

        if (productData.mrp === "" || Number(productData.mrp) < 0) {
            openPopup("error", "Please enter a valid MRP.");
            return;
        }

        if (productData.sellingPrice === "" || Number(productData.sellingPrice) < 0) {
            openPopup("error", "Please enter a valid selling price.");
            return;
        }

        if (productData.stockQuantity === "" || Number(productData.stockQuantity) < 0) {
            openPopup("error", "Please enter a valid stock quantity.");
            return;
        }

        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
            if (key === "image") {
                if (value) {
                    formData.append("image", value);
                }
            } else {
                formData.append(key, value);
            }
        });

        try {
            setIsSubmitting(true);
            const result = await updateProductAPI(productId, formData);
            openPopup("success", result?.message || "Product updated successfully.", false);
        } catch (error) {
            console.error("Submit error:", error);
            openPopup("error", error?.message || error?.error || "Failed to update product.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <section className={styles.page}>
                <p>Loading product details...</p>
            </section>
        );
    }

    if (loadError) {
        return (
            <section className={styles.page}>
                <p>{loadError}</p>
                <Link to="/adminPanel/products" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
            </section>
        );
    }

    return (
        <section className={styles.page}>
            <Popup show={showPopup} type={popupType} message={popupMessage} onClose={closePopup} />

            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.pageTag}>Admin • Edit Product</p>
                </div>

                <Link to="/adminPanel/products" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
            </header>

            <form className={styles.formCard} noValidate onSubmit={handleSubmit} encType="multipart/form-data">
                <div className={styles.formTop}>
                    <div>
                        <span className={styles.formBadge}>Product setup</span>
                        <p className={styles.formIntro}>
                            Update the product fields and save changes to apply them.
                        </p>
                    </div>
                </div>

                <div className={styles.formBody}>
                    <div className={styles.inputRow}>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="name">
                                Product Name <span className={styles.requiredMark}>*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={productData.name}
                                onChange={handleChange}
                                placeholder="Type product name"
                            />
                        </div>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="category">
                                Category <span className={styles.requiredMark}>*</span>
                            </label>
                            <select id="category" name="category" value={productData.category} onChange={handleChange}>
                                <option value="">Select category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home Decor">Home Decor</option>
                                <option value="Groceries">Groceries</option>
                            </select>
                        </div>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="brand">
                                Brand <span className={styles.requiredMark}>*</span>
                            </label>
                            <input
                                id="brand"
                                name="brand"
                                type="text"
                                value={productData.brand}
                                onChange={handleChange}
                                placeholder="Enter brand name"
                            />
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="mrp">
                                MRP (Rs.) <span className={styles.requiredMark}>*</span>
                            </label>
                            <input
                                id="mrp"
                                name="mrp"
                                type="number"
                                min="0"
                                value={productData.mrp}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="sellingPrice">
                                Selling Price (Rs.) <span className={styles.requiredMark}>*</span>
                            </label>
                            <input
                                id="sellingPrice"
                                name="sellingPrice"
                                type="number"
                                min="0"
                                value={productData.sellingPrice}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="stockQuantity">
                                Stock Quantity <span className={styles.requiredMark}>*</span>
                            </label>
                            <input
                                id="stockQuantity"
                                name="stockQuantity"
                                type="number"
                                min="0"
                                value={productData.stockQuantity}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="stockStatus">
                                Stock Status <span className={styles.requiredMark}>*</span>
                            </label>
                            <select id="stockStatus" name="stockStatus" value={productData.stockStatus} onChange={handleChange}>
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                                <option value="Pre Order">Pre Order</option>
                            </select>
                        </div>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="sku">
                                SKU <span className={styles.requiredMark}>*</span>
                            </label>
                            <input
                                id="sku"
                                name="sku"
                                type="text"
                                value={productData.sku}
                                onChange={handleChange}
                                placeholder="Ex: PRD-1001"
                            />
                        </div>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="slug">
                                Slug <span className={styles.requiredMark}>*</span>
                            </label>
                            <input
                                id="slug"
                                name="slug"
                                type="text"
                                value={productData.slug}
                                onChange={handleChange}
                                placeholder="example-product-slug"
                            />
                        </div>
                    </div>

                    <label className={styles.textareaLabel} htmlFor="shortDescription">
                        Short Description
                        <span className={styles.fieldHint}>
                            A short summary for cards and search results.
                        </span>
                        <textarea
                            id="shortDescription"
                            name="shortDescription"
                            rows="4"
                            value={productData.shortDescription}
                            onChange={handleChange}
                            placeholder="Write a concise product description"
                        />
                    </label>

                    <div className={styles.inputRow}>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="productVisibility">
                                Product Visibility
                            </label>
                            <select
                                id="productVisibility"
                                name="productVisibility"
                                value={productData.productVisibility}
                                onChange={handleChange}
                            >
                                <option value="Show on Storefront">Show on Storefront</option>
                                <option value="Keep in Draft Mode">Keep in Draft Mode</option>
                                <option value="Hide for Now">Hide for Now</option>
                            </select>
                        </div>
                        <div className={styles.inputBlock}>
                            <label className={styles.inputLabel} htmlFor="productLabel">
                                Product Label
                            </label>
                            <select id="productLabel" name="productLabel" value={productData.productLabel} onChange={handleChange}>
                                <option value="Standard Product">Standard Product</option>
                                <option value="New Arrival">New Arrival</option>
                                <option value="Best Seller">Best Seller</option>
                                <option value="Featured Pick">Featured Pick</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.fileUploadCard}>
                        <div className={styles.fileUploadHeader}>
                            <div>
                                <p className={styles.inputLabel}>
                                    Product Main Image <span className={styles.requiredMark}>*</span>
                                </p>
                                <p className={styles.fileUploadInfo}>
                                    Add a high-resolution product image for the storefront.
                                </p>
                            </div>
                            <span className={styles.fileBadge}>Image</span>
                        </div>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Product preview" className={styles.imagePreview} />
                        ) : null}
                        <label htmlFor="product-image" className={styles.fileUploadButton}>
                            <UploadCloud size={20} />
                            <span>{productData.image ? productData.image.name : "Click to upload image"}</span>
                        </label>
                        <input
                            id="product-image"
                            key={fileInputKey}
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className={styles.hiddenFileInput}
                        />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                        {isSubmitting ? <Loader /> : <Save size={16} />}
                        {isSubmitting ? "Submitting..." : "Submit Product"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default EditProduct;
