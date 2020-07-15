import * as functions from 'firebase-functions';
import * as App from './app';

const app = App.createApp();
exports.app = functions.https.onRequest(app);
