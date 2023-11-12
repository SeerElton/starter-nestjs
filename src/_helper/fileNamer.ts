import { extname } from "path";
import jwt_decode from "jwt-decode";
export const editMenuItemFileName = (req, file, callback) => {
    const name = req.body.Id;
    const fileExtName = '.jpg';//extname(file.originalname);
    callback(null, `${name}${fileExtName}`);
};

export const qrTemplateFileName = (req, file, callback) => {
    //const name = req.body.Id;

    var token = req.headers.authorization;
    var decoded: any = jwt_decode(token);

    const name = decoded.data.RestaurantId;
    const fileExtName = '.jpg';//extname(file.originalname);
    callback(null, `${name}${fileExtName}`);
};