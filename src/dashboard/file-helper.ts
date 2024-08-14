export const imageFileFilter = (req:any, file:any, callback:any)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        req.fileValidationError ='only image file allowed';
        return callback(null,false);
    }
    callback(null,true);
}