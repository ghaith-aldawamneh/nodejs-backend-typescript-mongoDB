import express from 'express';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';
//logout,credential,profile
const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

//ApiKey:{_id,key,version,permissions,comments,status?,createdAt,updatedAt}
//RoleRequest:{currentRoleCodes,ApiKey}
//ProtectedRequest: {user,accessToken,keystore,RoleRequest}

router.delete(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    await KeystoreRepo.remove(req.keystore._id);
    new SuccessMsgResponse('Logout success').send(res);
  }),
);

export default router;
