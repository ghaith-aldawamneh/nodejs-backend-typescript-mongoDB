import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';
import User from '../../database/model/User';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { RoleCode } from '../../database/model/Role';
import role from '../../helpers/role';
import authorization from '../../auth/authorization';
import authentication from '../../auth/authentication';
import KeystoreRepo from '../../database/repository/KeystoreRepo';

const router = express.Router();
//authentication:(gives the req.user and req.keystore from the Jwt.validate(Token))
/**
 * 1-auth: in req[header]
 * 2-getaccessToken
 * 3-JWT.validate--> payloud
 * 4-payloud validation !payloud.
 * 5-await UserRepo.findById(new Types.ObjectId(payload.sub))--> req.user = user
 * 6-await KeystoreRepo.findforKey(req.user, payload.prm)-->    req.keystore = keystore
 * 
 */
//----------------------------------------------------------------
router.use(authentication, role(RoleCode.ADMIN), authorization);
//----------------------------------------------------------------
/** 
 * authorization:
 * 
 * 
 * 
 * 
 * authentication for -->(profile, logout, credintials)
authentication:(validate auth:header,getToken, JWT.validate, validateTokenpayloud, setting user.user req.keystore)
1-{va_schema.auth(req[header]authorization: JoiAuthBearer(),header)}
2-getAccessToken(req.headers.authorization){no/or no barear-->error Barear Token}
3-payload = await JWT.validate
4-validateTokenData{||!payload.prm||payload.aud!==tokenInfo.audience||!Types.ObjectId.isValid(payload.sub)}
5-UserRepo.findById (req.user = user)--> KeystoreRepo.findforKey(req.keystore = keystore)
6-
role:(req:RoleRequest)
1- req.currentRoleCodes = roleCodes;
authorization:
1-(!req.user || !req.user.roles || !req.currentRoleCodes)
2-findByCodes(req.currentRoleCodes)


authorization:(!req.user || !req.user.roles || !req.currentRoleCodes)-->findByCodes(req.currentRoleCodes)-->for(constof req.user.roles)-->authorized
1-(!req.user || !req.user.roles || !req.currentRoleCodes)
2-findByCodes(req.currentRoleCodes)
3-for(const userRole of req.user.roles):
 if(authorized) break;
 for(const role of roles):if(userRole._id.equals(role._id))authorized = true;break;next or error
*/


//ApiKey:{_id,key,version,permissions,comments,status?,createdAt,updatedAt}
//currentRoleCodes:{currentRoleCodes,ApiKey}
//PublicRequest extends Request{apiKey}
//RoleRequest extends PublicRequest{currentRoleCodes}
//ProtectedRequest extend RoleRequest: {user,accessToken,keystore,RoleRequest}


//credential:
/**
 * 1-validate
 * 2-user=UserRepo.findByEmail
 * 3-passwordHash = await bcrypt.hash(req.body.password, 10);
 * 4-UserRepo.updateInfo({_id:user._id,password:passwordHash})
 * 5-KeystoreRepo.removeAllForClient(user)
 * 6-new SuccessResponse('')
 * 7-
 */
router.post(
  '/user/assign',
  validator(schema.credential),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User do not exists');

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    await UserRepo.updateInfo({
      _id: user._id,
      password: passwordHash,
    } as User);

    await KeystoreRepo.removeAllForClient(user);

    new SuccessResponse(
      'User password updated',
      _.pick(user, ['_id', 'name', 'email']), //_ is the lodash
    ).send(res);
  }),
);

export default router;
