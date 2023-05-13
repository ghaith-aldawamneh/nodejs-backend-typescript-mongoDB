import express from 'express';
import ApiKeyRepo from '../database/repository/ApiKeyRepo';
import { ForbiddenError } from '../core/ApiError';
import Logger from '../core/Logger';
import { PublicRequest } from 'app-request';
import schema from './schema';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../helpers/asyncHandler';
import { Header } from '../core/utils';
import ApiKey from 'module';

const router = express.Router();

export default router.use(
  /***
schema.apiKey:Joi.object().keys({[Header.API_KEY]:Joi.string().required(),}).unknown(true)
   * 
   * enum ValidationSource { BODY = 'body', HEADER = 'headers', QUERY = 'query', PARAM = 'params', }
  ValidationSource.HEADER= 'headers'
*/
  //validator (schema,'headers')=>(req,res,next)=>{error}=schema.validate(req[source]);
  //!=>next();const { details } = error;

  //validator (schema,'headers')=>(req,res,next)=>*
  //*=>schema.validate(req[source]); !error=>next(); replacing '"=>join(,) next(new Error)
  //validator return is void nothing since it is Request handler
  validator(schema.apiKey, ValidationSource.HEADER),

  /***req.headers['api_key']?.toString() --> await ApiKeyRepo.findByKey(key);!throw-->
  req.apikey=api
*/
  asyncHandler( 
    
    async (req: PublicRequest, res, next) => {
    const key_p = req.headers[Header.API_KEY]//x-api-key
    console.log("req.headers[Header.API_KEY]",key_p,"typeof(key_p)",key_p)
    const key = req.headers[Header.API_KEY]?.toString();

    if (!key) throw new ForbiddenError();
    //unless yoy know what the typw 

    const apiKey   = await ApiKeyRepo.findByKey(key);
    if (!apiKey) throw new ForbiddenError();
    Logger.info("apiKey_file, apiKey:",apiKey,"typeof apikey", typeof apiKey);
  
    req.apiKey = apiKey;
    return next();
  }),


  
);
