import { Request } from 'express';
import User from '../database/model/User';
import Keystore from '../database/model/Keystore';
import ApiKey from '../database/model/ApiKey';

declare interface PublicRequest extends Request {
  apiKey: ApiKey;
}
//currentRoleCodes:s,
//ApiKey(_id,key,version,permissions,comments,status?,createdAt,updatedAt)
declare interface RoleRequest extends PublicRequest {
  currentRoleCodes: string[];
}
//ApiKey:{_id,key,version,permissions,comments,status?,createdAt,updatedAt}
//currentRoleCodes:{currentRoleCodes,ApiKey}
//PublicRequest extends Request{apiKey}
//RoleRequest extends PublicRequest{currentRoleCodes}
//ProtectedRequest extend RoleRequest: {user,accessToken,keystore,RoleRequest}


declare interface ProtectedRequest extends RoleRequest {
  user: User;
  accessToken: string;
  keystore: Keystore;
}
//Tokens{accessToken,refreshToken}
declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}

/**
declare namespace Express {
  export class pr_print12 {
    pr_print12: (data: string) => void;
  }
  }
*/

/** 
declare namespace qw {
  export function (s:string)=>{
    console.log(s)
  }
}
*/
