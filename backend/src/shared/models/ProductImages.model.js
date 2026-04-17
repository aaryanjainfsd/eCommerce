import {Schema, model} from 'mongoose';

const ProductMultipleImagesSchema = new Schema(
    {
        foreignKeys:
        {
            product_id:{
                type: Schema.Types.ObjectId,
                ref: "client_product",
                required: true,
                unique: true 
            },
            future_sample_id:
            {
                type:String,
                default:""
            }
        },
        images:{
            local:{
                type:[String],
                default:[]
            },
            cloud:{
                type: [String],
                default: []
            }
        }
    },
    { timestamps: true, collection: "client_product_images"}
);

const ProductMultipleImagesModel = model("client_product_images", ProductMultipleImagesSchema);

export default ProductMultipleImagesModel;