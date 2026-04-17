import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        foreignKeys: {
            client_id: {
                type: Schema.Types.ObjectId,
                ref: "client",
                required: true
            },
            future_sample_id: { type: String, required: true, trim: true }
        },
        data:
        {
            // Step 1: Basic Product Information
            name: { type: String, required: true, trim: true },
            slug: { type: String, unique: true, lowercase: true, trim: true, sparse: true },
            category: { type: String, required: true, trim: true },
            sellingPrice: { type: Number, required: true, min: 0 },
            stockQuantity: { type: Number, required: true, min: 0, default: 0 },
            sku: { type: String, trim: true, required: true, unique: true },
            stockStatus: {
                type: String,
                required: true,
                enum: ["In Stock", "Low Stock", "Out of Stock", "Pre Order"],
                default: "In Stock"
            },
            shortDescription: { type: String, trim: true, default: "" },

            // Step 2: Images & Extra Details
            brand: { type: String, trim: true, default: "" },
            mrp: { type: Number, min: 0, default: 0 },
            images: {
                local: { type: String, default: "" },
                cloud: { type: String, default: "" }
            },

            // Step 3: Publish Settings
            productVisibility: {
                type: String,
                enum: ["Show on Storefront", "Keep in Draft Mode", "Hide for Now"],
                default: "Show on Storefront"
            },
            productLabel: {
                type: String,
                enum: ["Standard Product", "New Arrival", "Best Seller", "Featured Pick"],
                default: "Standard Product"
            }
        }


    },
    { timestamps: true }
);

const ProductModel = model("client_product", productSchema);

export default ProductModel;


