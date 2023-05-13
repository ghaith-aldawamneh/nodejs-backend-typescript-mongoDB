import { Request, Response, NextFunction,RequestHandler } from 'express';

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;
//Type AsyncFunction = Type RequestHandler
//otherproject//
//(RequestHandler/void/):RequestHandler/void/=>Promise<any>=>{return await requestHandler/that returns void/}

//(3*=>Promise<any>)=>(1,2,3)=>{(3*Promise<any>.catch(next)}//at the end is void
export default (execution: AsyncFunction) =>// value as an arg
  (req: Request, res: Response, next: NextFunction):void => {
    execution(req, res, next).catch(next);//void at the end as a return
  };
//(RequestHandler/void/):
  export function asyncHandler(
    handler: RequestHandler
  ):(req: Request, res: Response, next: NextFunction)=>void 

  {
    return function (req: Request, res: Response, next: NextFunction): void 
    {
      Promise.resolve(handler(req, res, next)).catch(err => {next(err);});
    };
  }