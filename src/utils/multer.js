import multer from "multer";
import AppError from './appError.js';

export const filterObject = {
    image: ['image/png', 'image/jpeg', 'image/jpg'],
    xlsx: ['file/xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

const options = (filterArray, folderName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, `uploads/${folderName}`);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + "-" + file.originalname);
        }
    });
    async function fileFilter(req, file, cb) {
        if (!filterArray.includes(file.mimetype)) {
            return cb(new AppError("Invalid file format!"), false);
        }
        return cb(null, true);
    }

    return multer({ storage, fileFilter });
};

export const uploadSingleFile = (filterArray, fieldName, folderName) => options(filterArray, folderName).single(fieldName);

export const uploadMultipleFiles = (filterArray, arrOfFields, folderName) => options(filterArray, folderName).fields(arrOfFields);