import { Schema, model } from "mongoose";
// SCHEMA
const productSchema = new Schema({
    name: { type: String, required: true},
    slug: { type: String, required: true, unique : true },
    category: { type: String, required: true},
    discountedPrice: { type: String, required: true},
    orignalPrice: { type: String, required: true},
    description: { type: String, required: true},
    images: {
		local: { type: String, default: "" },
		cloud: { type: String, default: "" }
	}
    
}, { timestamps: true });


const ProductModel = model("product-model", productSchema);

export default ProductModel; 


