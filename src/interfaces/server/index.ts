import './env';
import Server from './ExpressServer';
import routes from '../routes';

const port = parseInt(process.env.PORT as string || '3000');
export default new Server().router(routes).listen(port);