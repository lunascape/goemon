import * as React from 'react';
import { Express, Router } from 'express';
import { configureStore } from '../client/stores/guest-store';
import { MemberHtml } from '../views/test';
import { TestRouteComponent, routes } from '../client/routes/test-route';
import { StaticRouter } from 'react-router-dom';
import { theme } from '../client/themes/material-ui-lightblue';
import { Renderer } from './base/route-base';
import * as ReactDOMServer from 'react-dom/server';

import { Provider } from 'react-redux';

const router = Router();
const store = configureStore();

// let renderer =  new Renderer(store, RouteComponent, routes, theme);

module.exports = function (app: Express) {
  app.use('/test', router);
};

router.get('/', (req, res) => {
  const initialData = {
    name: 'World 2'
  };

  ReactDOMServer.renderToNodeStream(
    <MemberHtml initialData={JSON.stringify(initialData)}>
      <Provider store={store}>
          <StaticRouter location={req.baseUrl + req.url}>
            <TestRouteComponent />
          </StaticRouter>
        </Provider>
    </MemberHtml>
  ).pipe(res);
});

router.get('*', (req, res) => {
  const initialData = {
    name: 'World 2'
  };

  ReactDOMServer.renderToNodeStream(
    <MemberHtml initialData={JSON.stringify(initialData)}>
      <Provider store={store}>
          <StaticRouter location={req.baseUrl + req.url}>
            <TestRouteComponent />
          </StaticRouter>
        </Provider>
    </MemberHtml>
  ).pipe(res);
});

// function authenticationHandler(req, res, next) {
//   if (req.isAuthenticated()) {
//     return res.redirect('/member');
//   }
//   return next();
// }
