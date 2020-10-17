import multer from 'multer';
import path from  'path';

export default{
    storage: multer.diskStorage({
        destination: path.join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb)=>{
            const filenName = `${Date.now()}-${file.originalname}`
            cb(null, filenName)
        }
    })
}