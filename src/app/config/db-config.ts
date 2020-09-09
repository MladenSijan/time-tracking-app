import {DBConfig} from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'database',
  version: 1,
  objectStoresMeta: [
    {
      store: 'employees',
      storeConfig: {keyPath: 'id', autoIncrement: true},
      storeSchema: [
        {name: 'id', keypath: 'id', options: {unique: false}},
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'email', keypath: 'email', options: {unique: false}},
        {name: 'active', keypath: 'active', options: {unique: false}},
        {name: 'activities', keypath: 'activities', options: {unique: false}},
      ]
    }
  ]
};
