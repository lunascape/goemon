import React from 'react';

import { SheetsRegistry } from 'react-jss/lib/jss';
import { JssProvider } from 'react-jss/lib';
import { MuiThemeProvider, createGenerateClassName } from '@material-ui/core/styles';
import { AppContainer } from './app-container';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import i18n from '../../localization/i18n';

interface IProps {
  store: any;
  location?: string;
  context?: any;
  basename?: string;
  theme?: any;
  sheetsRegistry?: SheetsRegistry;
}

class MyUtils extends MomentUtils {

  constructor(value) {
    super(value);

    // this.yearFormat = 'YYYY';
    this.yearMonthFormat = 'MMM YYYY';
    this.dateTime12hFormat = 'MMM Do hh:mm a';
    this.dateTime24hFormat = 'MMM Do HH:mm';
    // this.time12hFormat = 'hh:mm A';
    // this.time24hFormat = 'HH:mm';
    this.dateFormat = 'MMM Do';
    // this.locale = 'ja';
  }

  getDatePickerHeaderText(date) {
    return date.utcOffset(9).format('ddd, MMM Do');
  }
}

export class MaterialUiAppContainer extends React.Component<IProps, {}> {
  // Remove the server-side injected CSS.
  componentDidMount() {
    // if there is this code, design desapperes when production mode
    // const jssStyles = document.getElementById('jss-server-side');
    // if (jssStyles && jssStyles.parentNode) {
    //   jssStyles.parentNode.removeChild(jssStyles);
    // }
  }

  render() {
    const { theme, sheetsRegistry } = this.props;

    const generateClassName = createGenerateClassName();

    moment.locale(i18n.language);

    if (typeof window !== 'undefined') { // Check whether this method is called on client or server
      return (
        <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MyUtils}>
              <AppContainer {...this.props} />
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </JssProvider>
      );
    } else {
      return (
        <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
            <MuiPickersUtilsProvider utils={MyUtils}>
              <AppContainer {...this.props} />
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </JssProvider>
      );
    }
  }
}
