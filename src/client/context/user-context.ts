/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Lunascape Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export type IContextProps = {
  userType: 'guest' | 'member' | 'admin' | 'test';
};

export const UserContext = React.createContext<IContextProps>({
  userType: 'guest'
});
