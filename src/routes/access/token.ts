import express from 'express';
import { TokenRefreshResponse } from '../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { Types } from 'mongoose';
import UserRepo from '../../database/repository/UserRepo';
import { AuthFailureError } from '../../core/ApiError';
import JWT from '../../core/JWT';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import crypto from 'crypto';
import {
  validateTokenData,
  createTokens,
  getAccessToken,
} from '../../auth/authUtils';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';

const router = express.Router();

/**
 * RefreshToken:
 * 1- val(header, body's refresh Token)
 * -------------------req.accessToken----------------------------
 * 2- //JWT.decode(req.accessToken){ignoreExpiration: true} same as the validate
 * 3- validateTokenData/payloudData/
 * 4- //user = await UserRepo.findById(.sub) --> req.user = user
 * ---------------------------------------------------------------------------
 * ---------------------refreshTokenPayload --------------------------------------------
 * 5-  /||/refreshTokenPayload = await JWT.validate(req.body.refreshToken); 
 * 6-  validateTokenData(refreshTokenPayload);
 * 7-if (accessTokenPayload.sub !== refreshTokenPayload.sub)
 * 8-  keystore = await KeystoreRepo.find( req.user, accessTokenPayload.prm, refreshTokenPayload.prm, );
 * 9-  /||/KeystoreRepo.remove(keystore._id);
 * 10-  const accessTokenKey,refreshTokenKey = crypto.randomBytes(64).toString('hex');
 * 11- /||/KeystoreRepo.create(req.user, accessTokenKey, refreshTokenKey);{KeystoreModel.create}
 * //Tokens{accessToken:string_bysign;refreshToken:string_bysign;}
 * 12- /||/tokens=await createTokens(req.user,accessTokenKey,refreshTokenKey)
 *   - /||/tokens=await createTokens(req.user,encode(iss,aud,_id,accessTokenKey,Val),encode(refreshTokenKey,...)
 * 13- 
 * 
 * refreshToken:
 * getaccessToken
 * valignore
 * finduser
 * 
 * payloud=validate(refreshtoken)
 * find keystore
 * delete from the keystore where id,accesstoken, refreshtoken
 * accesstoken, refreshtoken=hex
 * 
 * KeystoreRepo.create
 * createTokens{req.user,accessTokenKey,refreshTokenKey}
 * 
 */


router.post(
  '/refresh',
  validator(schema.auth, ValidationSource.HEADER),
  validator(schema.refreshToken),
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    const accessTokenPayload = await JWT.decode(req.accessToken);
    validateTokenData(accessTokenPayload);

    const user = await UserRepo.findById(
      new Types.ObjectId(accessTokenPayload.sub),
    );
    if (!user) throw new AuthFailureError('User not registered');
    req.user = user;

    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

     
    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
      throw new AuthFailureError('Invalid access token');

    const keystore = await KeystoreRepo.find(
      req.user,
      accessTokenPayload.prm,
      refreshTokenPayload.prm,
    );

    if (!keystore) throw new AuthFailureError('Invalid access token');
    await KeystoreRepo.remove(keystore._id);

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(req.user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(
      req.user,
      accessTokenKey,
      refreshTokenKey,
    );
    //normally headers = {}
// (const [key, value] of headers-->res.append ())
// so nothing will be appended to res

//public send -->protected prepare -->
//res.status(this.status).json(ApiResponse.sanitize(response));
 

//in brief: 
//res.status(this.status).json(ApiResponse.sanitize(response))

new TokenRefreshResponse(
      'Token Issued',
      tokens.accessToken,
      tokens.refreshToken,
    ).send(res);//public method return prepare that returns Response
  }),
);

export default router;

/**
 * public send(res,headers){
 * return this.prepare<ApiResponse>(res,this,headers)
 * }
 * 
 * protected prepare<T extends ApiResponse>(res:res,RESPONSE:T,headers):Response
 * for headers
 * return res.status(res).json()
 * 
 * 
 */
/**
 * send (){
 * super.prepare<TokenRefreshResponse>(res,this,headers)
 * }
 * 
 * 
 */
