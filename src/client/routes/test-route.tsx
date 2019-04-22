import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { GuestTop } from '../views/guest-top';
import { GuestReact } from '../views/guest-react';
import { GuestRedux } from '../views/guest-redux';
import { NotFound } from '../views/components/notfound';

interface IProps  {
  // routes: any;
}

interface IState {
  hasError: boolean;
}

export const routes = [
  {
    path: '/test',
    component: GuestTop,
    exact: true
  }, {
    path: '/test/*',
    component: NotFound,
    exact: false
  }
];

export class TestRouteComponent extends React.Component<IProps, IState> {
  // Remove the server-side injected CSS.
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render () {
    // const { match } = this.props;
    return (
      renderRoutes(routes)
    );
  }
}
