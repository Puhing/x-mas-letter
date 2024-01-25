import multer from "multer";

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "public/uploads/");
    },
    filename: function (req, file, callback) {
        if (file.mimetype === 'image/png'){
            callback(null, Date.now() + "img_" + file.originalname + ".jpeg");
        } else {
            callback(null, Date.now() + "_" + file.originalname + ".webm");
        }
    },
});

const limits = {
    filedSize: 1024 * 1024,
    fileSize: 1024 * 1024 * 20, // 20mb
    files: 10,
};

export const upload = multer({
    limits: limits, // 이미지 업로드 제한 설정
    storage: storage,
});
