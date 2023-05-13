import express from 'express';
import { ProtectedRequest } from 'app-request';
import { AuthFailureError } from '../core/ApiError';
import RoleRepo from '../database/repository/RoleRepo';
import asyncHandler from '../helpers/asyncHandler';

const router = express.Router();
/***
 * 
 * 
 * authorization:
 * - req.user, user.user.roles,user.id
 * - find roles from Repo_roles(user.user.roles)
 * - for(of req.user.roles)for(of roles) authorized
 * 
authorization:
1-(!req.user || !req.user.roles || !req.currentRoleCodes)
2-findByCodes(req.currentRoleCodes)
3-for(const userRole of req.user.roles):
 if(authorized) break;
 for(const role of roles):if(userRole._id.equals(role._id))authorized = true;break;next or error
 

 * 
 */
export default router.use(
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    if (!req.user || !req.user.roles || !req.currentRoleCodes)
      throw new AuthFailureError('Permission denied');
    
    const roles = await RoleRepo.findByCodes(req.currentRoleCodes);
    if (roles.length === 0) throw new AuthFailureError('Permission denied');

    let authorized = false;

    for (const userRole of req.user.roles) {
      if (authorized) break;
      for (const role of roles) {
        if (userRole._id.equals(role._id)) {
          authorized = true;
          break;
        }
      }
    }
    
   
    if (!authorized) throw new AuthFailureError('Permission denied');

    return next();
  }),
);
