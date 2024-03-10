import multer, { diskStorage } from "multer";
import AppError from "./appError.js";

export const filterObject = {
    image: ['image/png', 'image/jpeg', 'image/jpg'],
    pdf: ['application/pdf'],
    video: ['video/mp4'],
    excel: ['file/xlsx']
};

export const fileUpload = (filterArray) => {
    const fileFilter = (req, file, cb) => {
        console.log(file);
        if (!filterArray.includes(file.mimetype)) {
            return cb(new AppError("Invalid file format!"), false);
        }
        return cb(null, true);
    };
    return multer({ storage: diskStorage({}), fileFilter });
};