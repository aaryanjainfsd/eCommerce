import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Images, Upload } from "lucide-react";
import styles from "../assets/css/addMorePhotos.module.css";
import { addMoreProductImagesAPI } from "../apis/services/product.service"; 

function AddMorePhotos() {
    const { productId } = useParams();
    const location = useLocation();
    const product = location.state?.product;
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [uploadedImageCount, setUploadedImageCount] = useState(null);

    function handleFileChange(event) {
        setSelectedFiles(Array.from(event.target.files || []));
    }

    async function handleUpload(event)
    {
        event.preventDefault();
        setUploadSuccess("");
        setUploadError("");

        if (selectedFiles.length === 0) {
            setUploadError("Please select at least one image to upload.");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((items) => {
            formData.append("images", items);               
        });

        try {
            const response = await addMoreProductImagesAPI(productId, formData);
            setUploadedImageCount(response.totalImagesUploaded ?? null);
            setUploadSuccess(`Successfully uploaded ${selectedFiles.length} image(s). Total uploaded images: ${response.totalImagesUploaded ?? 0}`);
            setSelectedFiles([]);
        } catch(error) {
            console.error("Error uploading photos:", error);
            setUploadError("Failed to upload photos. Please try again.");
        }
    }

    return (
        <section className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>Product Gallery</p>
                    <h1 className={styles.title}>Add More Photos</h1>
                    <p className={styles.subtitle}>
                        Select extra images for this product and keep its gallery
                        updated.
                    </p>
                </div>

                <Link to="/adminPanel/products" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
            </header>

            <section className={styles.card}>
                <div className={styles.productSummary}>
                    <div className={styles.iconWrap}>
                        <Images size={22} />
                    </div>

                    <div>
                        <h2>{product?.name || "Selected Product"}</h2>
                        <p>SKU: {product?.sku || "Not available"}</p>
                        <span>Product ID: {productId}</span>
                        {uploadedImageCount !== null ? (
                            <div className={styles.imageCount}>
                                Total Images Uploaded: {uploadedImageCount}
                            </div>
                        ) : null}
                    </div>
                </div>

                <label className={styles.uploadBox}>
                    <Upload size={22} />
                    <strong>Select product photos</strong>
                    <span>Choose one or more images from your computer.</span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                </label>

                {uploadSuccess && (
                    <div style={{ background: "#e6ffed", color: "#1b5e20", border: "1px solid #8bc34a", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
                        {uploadSuccess}
                    </div>
                )}
                {uploadError && (
                    <div style={{ background: "#ffebee", color: "#b71c1c", border: "1px solid #ef9a9a", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
                        {uploadError}
                    </div>
                )}

                {selectedFiles.length > 0 ? (
                    <div className={styles.fileList}>
                        <h3>Selected files</h3>
                        <ul>
                            {selectedFiles.map((file) => (
                                <li key={`${file.name}-${file.lastModified}`}>
                                    {file.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className={styles.emptyText}>No new photos selected yet.</p>
                )}
            </section>

            <button className={styles.uploadButton} onClick={handleUpload}>
                Upload Photos
            </button>
        </section>
    );
}

export default AddMorePhotos;
 