import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { addProductAPI } from "../apis/services/product.service";
import styles from "../assets/css/addProduct.module.css";

function AddProduct() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [productData, setProductData] = useState({
        name: "",
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
    });

    const stepDetails = {
        1: {
            label: "Step 1 of 3",
            title: "Basic Product Information",
            description:
                "Start with the essential product details. This is the main step you need to fill first.",
            badge: "Start Here",
        },
        2: {
            label: "Step 2 of 3",
            title: "Images & Extra Details",
            description:
                "Add a few supporting details if you want. This step is optional and can be skipped.",
            badge: "Optional Step",
        },
        3: {
            label: "Step 3 of 3",
            title: "Publish Settings",
            description:
                "Choose how the product should appear after save, then submit when you are ready.",
            badge: "Final Step",
        },
    };

    const activeStep = stepDetails[currentStep];

    function goToStep(step) {
        setCurrentStep(step);
    }

    function handleNextStep() {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }

    function handlePreviousStep() {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    }

    function handleChange(event) {
        const { name, value, type, files } = event.target;

        setProductData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();

        Object.entries(productData).forEach(([key, value]) => {
            if (key === "image") {
                if (value) formData.append("image", value);
            } else if (value !== "") {
                formData.append(key, value);
            }
        });

        try {
            setIsSubmitting(true);

            const result = await addProductAPI(formData);
            console.log("Server Response:", result);

            alert(result.message || "Product added successfully!");

            setProductData({
                name: "",
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
            });

            setCurrentStep(1);
        } catch (error) {
            console.error("Submit error:", error);
            alert(error?.message || error?.error || "Failed to add product");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Add New Product</h1>                   
                </div>

                <Link to="/adminPanel/products" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
            </header>

     

            <div className={styles.stepper}>
                <button
                    type="button"
                    className={`${styles.stepItem} ${currentStep === 1 ? styles.stepActive : ""}`}
                    onClick={() => goToStep(1)}
                >
                    <span className={styles.stepNumber}>1</span>
                    <div>
                        <strong>Basic Product Info</strong>
                        <p>Fill this first</p>
                    </div>
                </button>

                <button
                    type="button"
                    className={`${styles.stepItem} ${currentStep === 2 ? styles.stepActive : ""}`}
                    onClick={() => goToStep(2)}
                >
                    <span className={styles.stepNumber}>2</span>
                    <div>
                        <strong>Images & Extras</strong>
                        <p>Optional details</p>
                    </div>
                </button>

                <button
                    type="button"
                    className={`${styles.stepItem} ${currentStep === 3 ? styles.stepActive : ""}`}
                    onClick={() => goToStep(3)}
                >
                    <span className={styles.stepNumber}>3</span>
                    <div>
                        <strong>Publish Settings</strong>
                        <p>Finish and submit</p>
                    </div>
                </button>
            </div>

            <form className={styles.formCard} noValidate onSubmit={handleSubmit} encType="multipart/form-data">
                <div className={styles.stepHeader}>
                    <div>
                        <p className={styles.sectionLabel}>{activeStep.label}</p>
                        <h2>{activeStep.title}</h2>
                        <p className={styles.stepHeaderText}>{activeStep.description}</p>
                    </div>
                    <span className={styles.liveBadge}>{activeStep.badge}</span>
                </div>

                <div className={styles.formBody}>
                {currentStep === 1 && (
                    <>
                        <div className={styles.gridTwo}>
                            <label>
                                Product Name <span className={styles.requiredMark}>*</span>
                                <span className={styles.fieldHint}>
                                    Example: Premium Wireless Headphones
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    required
                                />
                            </label>

                            <label>
                                Category <span className={styles.requiredMark}>*</span>
                                <span className={styles.fieldHint}>
                                    Select the closest category
                                </span>
                                <select
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Home Decor">Home Decor</option>
                                    <option value="Groceries">Groceries</option>
                                </select>
                            </label>
                        </div>

                        <div className={styles.gridThree}>
                            <label>
                                Selling Price (Rs.) <span className={styles.requiredMark}>*</span>
                                <span className={styles.fieldHint}>Example: 1499</span>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    value={productData.sellingPrice}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </label>

                            <label>
                                Stock Quantity <span className={styles.requiredMark}>*</span>
                                <span className={styles.fieldHint}>
                                    How many units are available?
                                </span>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={productData.stockQuantity}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </label>

                            <label>
                                Stock Status <span className={styles.requiredMark}>*</span>
                                <span className={styles.fieldHint}>
                                    Pick the current availability
                                </span>
                                <select
                                    name="stockStatus"
                                    value={productData.stockStatus}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="In Stock">In Stock</option>
                                    <option value="Low Stock">Low Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                    <option value="Pre Order">Pre Order</option>
                                </select>
                            </label>
                        </div>

                        <label>
                            Short Description <span className={styles.requiredMark}>*</span>
                            <span className={styles.fieldHint}>
                                Keep it simple and customer-friendly in one or two lines
                            </span>
                            <textarea
                                rows="4"
                                name="shortDescription"
                                value={productData.shortDescription}
                                onChange={handleChange}
                                placeholder="Example: Stylish, durable and easy to use for everyday needs."
                                required
                            />
                        </label>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        

                        <div className={styles.gridThree}>
                            <label>
                                Brand
                                <span className={styles.fieldHint}>Example: Boat, Nike, Samsung</span>
                                <input
                                    type="text"
                                    name="brand"
                                    value={productData.brand}
                                    onChange={handleChange}
                                    placeholder="Enter brand name"
                                />
                            </label>

                            <label>
                                SKU
                                <span className={styles.fieldHint}>Internal product code</span>
                                <input
                                    type="text"
                                    name="sku"
                                    value={productData.sku}
                                    onChange={handleChange}
                                    placeholder="Ex: PRD-1001"
                                />
                            </label>

                            <label>
                                MRP (Rs.)
                                <span className={styles.fieldHint}>Original price if needed</span>
                                <input
                                    type="number"
                                    name="mrp"
                                    value={productData.mrp}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                />
                            </label>
                        </div>

                        <div className={styles.grid}>
                            

                            <label>
                                Upload Product Image
                                <span className={styles.fieldHint}>
                                    Choose an image file now — upload handling will be connected later
                                </span>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className={styles.fileInput}
                                />
                            </label>
                        </div>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <div className={styles.gridTwo}>
                            <label>
                                Product Visibility
                                <span className={styles.fieldHint}>
                                    Decide where this product should appear
                                </span>
                                <select
                                    name="productVisibility"
                                    value={productData.productVisibility}
                                    onChange={handleChange}
                                >
                                    <option value="Show on Storefront">Show on Storefront</option>
                                    <option value="Keep in Draft Mode">Keep in Draft Mode</option>
                                    <option value="Hide for Now">Hide for Now</option>
                                </select>
                            </label>

                            <label>
                                Product Label
                                <span className={styles.fieldHint}>
                                    Optional tag for better presentation
                                </span>
                                <select
                                    name="productLabel"
                                    value={productData.productLabel}
                                    onChange={handleChange}
                                >
                                    <option value="Standard Product">Standard Product</option>
                                    <option value="New Arrival">New Arrival</option>
                                    <option value="Best Seller">Best Seller</option>
                                    <option value="Featured Pick">Featured Pick</option>
                                </select>
                            </label>
                        </div>

                        <div className={styles.previewBox}>
                            <h3>After submit</h3>
                            <div className={styles.previewItems}>
                                <span>Can edit later</span>
                                <span>Can add more images</span>
                                <span>Can update pricing anytime</span>
                                <span>Safe for testing</span>
                            </div>
                            <p>
                                You are now on the proper final step, not a review-only
                                screen. Submit from here whenever you want.
                            </p>
                        </div>
                    </>
                )}

                <div className={styles.formActions}>
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={handlePreviousStep}
                        >
                            Back
                        </button>
                    ) : null}

                    {currentStep < totalSteps ? (
                        <>
                            <button
                                type="button"
                                className={styles.ghostButton}
                                onClick={() => goToStep(totalSteps)}
                            >
                                Skip to Final Step
                            </button>
                            <button
                                type="button"
                                className={styles.primaryButton}
                                onClick={handleNextStep}
                            >
                                Next Step
                                <ArrowRight size={16} />
                            </button>
                        </>
                    ) : (
                        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                            <Save size={16} />
                            {isSubmitting ? "Submitting..." : "Submit Product"}
                        </button>
                    )}
                </div>
                </div>
            </form>
        </section>
    );
}

export default AddProduct;
