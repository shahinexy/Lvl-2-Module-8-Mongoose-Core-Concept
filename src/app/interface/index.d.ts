// import { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../Modules/user/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      propertyName: string 
    }
  }
}
