/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Lunascape Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
import express from 'express';
import session from 'express-session';
import path from 'path';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// import expressValidator from 'express-validator';
import glob from 'glob';
import flash from 'express-flash';
import { logger } from './base/utilities/logger';

import { envs } from './env';
import { isTestMode, isDevMode } from './base/utilities/debug';

import connectRedis = require('connect-redis');

export class AppServer {

  constructor(
    public app?
  ) {
    if (app === undefined) {
      this.app = express();
    }
  }

  // start express application
  public initalize(app) {

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // validator
    // app.use(expressValidator());

    // favicon
    let faviconPath = path.join(__dirname, '.', 'public', 'favicon.ico');
    app.use(favicon(faviconPath)); // uncomment after placing your favicon in /public

    // logger
    app.use(morgan('dev'));

    // bodyParser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // cookieParser
    app.use(cookieParser());

    // session
    let sess: session.SessionOptions = {
      secret: envs.SESSION_SECRET.value as string,
      resave: envs.SESSION_RESAVE.value as boolean,
      saveUninitialized: envs.SESSION_SAVE_UNINITIALIZED.value as boolean,
      cookie: {
        maxAge: envs.SESSION_COOKIE_MAXAGE.value as number,
      }
    };

    // choose session storage
    let driver: string = envs.SESSION_DRIVER.value as string;

    switch (driver) {
      case 'redis':
        // redis session
        const RedisStore = connectRedis(session);
        let redisOptions: connectRedis.RedisStoreOptions;

        if (envs.SESSION_DRIVER_OPTION.value === undefined) {
          redisOptions = {};
        } else {
          // Clones options for unlock read-only properties
          // -> Effect logErrors param overriding in connect-redis
          redisOptions = JSON.parse(JSON.stringify(envs.SESSION_DRIVER_OPTION.value));
        }

        if (
          envs.SESSION_DRIVER_HOST.value === undefined ||
          envs.SESSION_DRIVER_HOST.value.length < 1
        ) {
          throw new Error('process.env.SESSION_DRIVER_HOST must be set when session driver is redis.');
        }
        redisOptions.host = envs.SESSION_DRIVER_HOST.value;

        if (envs.SESSION_DRIVER_PORT.value !== undefined) {
          redisOptions.port = parseInt(envs.SESSION_DRIVER_PORT.value);
        }
        if (envs.SESSION_DRIVER_PASSWORD !== undefined) {
          redisOptions.pass = envs.SESSION_DRIVER_PASSWORD.value;
        }
        sess.store = new RedisStore(redisOptions);

        break;

      default:
        // default in-memory session
        break;
    }

    app.use(session(sess));

    // public folder path
    app.use(express.static(path.join(__dirname, '.', 'public'), {
      maxAge: envs.STATIC_CONTENTS_CACHE.value,
      lastModified: true,
      redirect: true
    }
    ));

    // Sample cache of extension match
    if (process.env.HTTP_CACHE !== undefined) {
      app.use(function (req, res, next) {
        if (req.url.match(/^\/(css|js|img|font)\/.+/)) {
          res.setHeader('Cache-Control', 'public, max-age=' + process.env.HTTP_CACHE_MAXAGE);
        }
        next();
      });
    }

    // Initialize connect-flash
    app.use(flash());

    // Setup express middlewares
    let middlewares = glob.sync(__dirname + '/middlewares/*.+(js|jsx|ts|tsx)');

    middlewares.forEach(middleware => {
      if (!isTestMode()) {
        logger.info('Loading middleware : ' + middleware);
      }
      try {
        require(middleware)(app);
      } catch (err) {
        logger.fatal(err);
        process.exit(1);
      }
    });

    // Setup express routes
    let routes = glob.sync(__dirname + '/routes/*.+(js|jsx|ts|tsx)');
    routes.forEach(route => {
      if (!isTestMode()) {
        logger.info('Loading route : ' + route);
      }
      require(route)(app);
    });

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      res.status(404);
      res.render('not-found', {
        title: 'Not Found',
      });
    });

    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        title: 'Error',
        message: err.message,
        error: (isDevMode()) ? err : {}
      });
    });

    return app;
  }
}
