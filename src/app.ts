import express, { Request, Response, NextFunction ,ErrorRequestHandler, RequestHandler} from 'express';
import Logger from './core/Logger';// initialize and using
import cors from 'cors';
import { corsUrl, environment } from './config1';
import './database'; // initialize database
import './cache'; // initialize cache
import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorType,
} from './core/ApiError';
import routes from './routes';
import 'dotenv/config';


process.on('uncaughtException', (e) => {
  console.log("inside the app.ts file the process.on")
  Logger.error(e);
});

const app = express();
app.use(express.json({ limit: '10mb' })); //:NextHandleFunction

//(...handlers: Array<RequestHandler<RouteParameters<Route>>>): T;

app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);


app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));


// Routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));


// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
Logger.error(
`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
);}
else{
Logger.error(`500-${err.message}-${req.originalUrl}-${req.method}-${req.ip}`,
);
Logger.error(err);
if (environment === 'development') {
return res.status(500).send(err);
}
ApiError.handle(new InternalError(), res);
}
});

export default app;

    /** 
     constructor(type message ){supertype}
     handle(extend apiError, res) return class extend ApiRespons .send(res)
      
    */
    /** 
     InternalError=> extends (ApiError that has the handle) {
  constructor(message = 'Internal error'){super(ErrorType.INTERNAL, message);}}
    */
   //interface Error {name,message,stack? all string} and has the handle inside it 
   //ApiError extend Error also constructor(public type: ErrorType, public message:string ='error'){super(type);}
   //



    /** Error(name, message,stack?)
     * ApiError(type,message){super(type)}
     * handle(err: extend ApiError, res)return new AuthFailureResponse(err.message) extend ApiResponse .send(res)
     * AuthFailureResponse extend ApiResponse() constructor(message = 'Authentication Failure'){
              super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
     send(res,header={}):Response){return this.prepare<ApiResponse>(res,this,header)}
     prepare<>(res,response:T,header):Response{for header res.append
    return res.status(this.status).json(ApiResponse.sanitize(response)))
    }
     * 
     * 
     * 
    */
/** 
    //.handle (err: ApiError, res: Response): Response
           //inside the switch it returns new AuthFailureResponse(err.message).send(res);
    //AuthFailureResponse is a class extend ApiResponse(class)  //constructor+super
             //  constructor(message = 'Authentication Failure') {
              //super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
    //ApiResponse no extend, it is 
                 //constructor( protected statusCode: StatusCode, 
                 //protected status: ResponseStatus, 
                 //protected message: string, ) {}
  */
 
        /***send(res,headers:{[key:string]:string}={}):Response
 {return this.prepare<ApiResponse>(res, this/ApiResponse/, headers)}

 prepare<T,ApiResponse>(res:,response:,headers:):Response{for,headers=>res.append(key, value)}
 return res.status(this.status).json(ApiResponse.sanitize(response)))

 static sanitize<T/ApiResponse>(response:T):T
 {clone: T = {} as T;Object.assign(clone, response);
 delete clone.status;
 for (const i in clone)clone[i] === 'undefined'=>delete
 return clone;
}
*/