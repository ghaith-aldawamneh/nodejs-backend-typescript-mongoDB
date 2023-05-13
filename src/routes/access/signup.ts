import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';
import User from '../../database/model/User';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { RoleCode } from '../../database/model/Role';
import { getUserData } from './utils';

const router = express.Router();
//

//ApiKey:{_id,key,version,permissions,comments,status?,createdAt,updatedAt}
//currentRoleCodes:{currentRoleCodes,ApiKey}
//PublicRequest extends Request{apiKey}
//RoleRequest extends PublicRequest{currentRoleCodes}
//ProtectedRequest extend RoleRequest: {user,accessToken,keystore,RoleRequest}


router.post(
  '/basic',
  validator(schema.signup),


  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    console.log("signup_file accessTokenKey",accessTokenKey)
    console.log("signup_file refreshTokenKey",refreshTokenKey)
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    console.log("signup_file passwordHash",passwordHash)
    const { user: createdUser, keystore } = await UserRepo.create(
      {
        name: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.LEARNER,
    );
    
    
    console.log("signup_file createdUser",createdUser)
    console.log("signup_file user",user)
    //Tokens{accessToken:string;refreshToken:string;}
    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey,
    );//Tokens{accessToken:string;refreshToken:string;}
    const userData = await getUserData(createdUser);


    new SuccessResponse('Signup Successful', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);


export default router;

