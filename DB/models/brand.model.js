import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, "Brand name is required"],
        trim: true,
        uppercase: true,
        unique: [true, "Brand name already exists"],
    },
});
const Brand = mongoose.model("Brand", brandSchema);
export default Brand;