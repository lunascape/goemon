/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Lunascape Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as config from 'react-global-configuration';
import { configureStore } from './stores/member-store';
import { createClientApp } from './base/react/app-creator';
import { TestRouteComponent } from './routes/test-route';
import { defaultConfig } from './config/default';
import { UserContext, IContextProps } from './context/user-context';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

Object.assign(defaultConfig, {
  protocol:  (('https:' == document.location.protocol) ? 'https://' : 'http://'),
  host: location.host
});
const preloadConfig = JSON.parse(document.getElementById('initialConfig').getAttribute('data-json'));
if ( preloadConfig !== null ) {
  Object.assign(defaultConfig, preloadConfig);
}

config.set(defaultConfig);

const initialState = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));
// const preloadedState = win.__PRELOADED_STATE__;
const store = configureStore(initialState);
const userContext: IContextProps = {
  userType: 'guest',
};
// export const app = createClientApp(
//   <UserContext.Provider value={userContext}>
//     <GuestRouteComponent />
//   </UserContext.Provider>
//   , store, '');

export const app =  (
  <Provider store={store}>
    <BrowserRouter>
      <UserContext.Provider value={userContext}>
        <TestRouteComponent />
      </UserContext.Provider>
    </BrowserRouter>
  </Provider>
);

ReactDOM.hydrate(app, document.getElementById('app'));
