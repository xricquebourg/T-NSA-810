import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import 'reflect-metadata';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerStats from 'swagger-stats';
import * as swaggerUi from 'swagger-ui-express';
import {createConnection} from 'typeorm';
import routes from './routes';

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Test API',
      version: '1.0.0',
      description: 'Test Express API with autogenerated swagger doc',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['**/routes/auth.ts', '**/controller/Admin/*.ts'],
};

const specs = swaggerJSDoc(options);
// Connects to the Database -> then starts the express
createConnection()
  .then(() => {
    // Create a new express application instance

    // Call midlewares
    const app = express();
    app.use(cors());
    app.use(swaggerStats.getMiddleware({}));
    app.use(helmet());
    app.use(bodyParser.json());
    morgan.token('header-auth', (req, res) => req.headers.auth);
    morgan.token('body', (req, res) => req.body.toString());
    app.use(morgan('[:date[web]] Started :method :url for :remote-addr', true));
    app.use(morgan('[:date[web]] Started with token :header-auth', true));
    app.use(morgan('[:date[web]] Started with body :body', true));
    app.use(
      morgan(
        '[:date[iso]] Completed :status :res[content-length] in :response-time ms',
      ),
    );
    // Set all routes from routes folder
    app.use('/', routes);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.listen(3000, async () => {
      console.log('Server started on port 3000!');
    });
  })
  .catch(e => console.log(e));