import Logger from './core/Logger';
import 'dotenv/config';
import app from './app';
import { port1 } from './config1';


app
  .listen(port1, () => {
    Logger.info(`Logger.info server running on port : ${port1}`);
  })
  .on('error', (e) => Logger.error(e));

  