import Joi, { string } from 'joi';
import { Request, Response, NextFunction } from 'express';
import Logger from '../core/Logger';
import { BadRequestError } from '../core/ApiError';
import { Types } from 'mongoose';
import { request } from 'http';

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error('any.invalid');
    return value;
  }, 'Object Id Validation');

export const JoiUrlEndpoint = () =>
  Joi.string().custom((value: string, helpers) => {
    if (value.includes('://')) return helpers.error('any.invalid');
    return value;
  }, 'Url Endpoint Validation');

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith('Bearer ')) return helpers.error('any.invalid');
    if (!value.split(' ')[1]) return helpers.error('any.invalid');
    return value;
  }, 

  
  'Authorization Header Validation from the joi custom error');


//ValidationSource { BODY = 'body', HEADER = 'headers', QUERY = 'query', PARAM = 'params', }
export default (
    schema: Joi.AnySchema,
    source: ValidationSource = ValidationSource.BODY,
  ) =>

  /*** 
   * schema.validate(req[source]);
   * error=>next()
   * replacing '"=>join(,)
   * 
   * 
   * 
   * 
  */

  //schema.validate(req[source]); -->  -->  -->  -->  -->


  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("validator_file_req:",req)
      console.log("schema:",schema)


      const { error } = schema.validate(req[source]);


      console.log("validator_file{error}:",error)


      const error_T  = schema.validate(req[source]);


      console.log("validator_file_error_T:",error_T)


      if (!error) return next();//error=false

      const { details } = error;
      console.log("validator_file, details:",details)
      const message = details
      .map((i) => i.message.replace(/['"]+/g, ''))
      .join(',');
      console.log("validator_file, message:",message)
      Logger.error(message);

      next(new BadRequestError(message));
    } catch (error) {
      next(error);
    }
  };

  /**
   * try{
   * ... code
   * next(error)
   * }
   * catch(error){
   * next(error)
   * }
   */
