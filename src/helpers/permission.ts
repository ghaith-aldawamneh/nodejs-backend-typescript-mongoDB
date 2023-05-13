import { Response, NextFunction,Request } from 'express';
import { ForbiddenError } from '../core/ApiError';
import { PublicRequest } from '../types/app-request';

export default  (permission: string) =>

  (req: PublicRequest, res: Response, next: NextFunction) => {
    
    try {
      //console.log('permission_file,permission:',permission)
      if (!req.apiKey?.permissions)
        return next(new ForbiddenError('Permission Denied'));
        
      console.log('permission_file,req.apiKey.permissions:',
      req.apiKey.permissions,"typepermissions ", typeof req.apiKey.permissions)


      const exists = req.apiKey.permissions.find(
        (entry) => entry === permission,
      );
      if (!exists) return next(new ForbiddenError('Permission Denied'));
//!req.Apikey?.permission
      next();
    } catch (error) {
      next(error);
    }
  };
