import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'userdb',
  connector: 'memory',
  localStorage: '',
  file: './data/userdb.json'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class UserdbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'userdb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.userdb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
