import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MyUserdbDataSource} from '../datasources';
import {MyUser, MyUserRelations} from '../models';

export class MyUserRepository extends DefaultCrudRepository<
  MyUser,
  typeof MyUser.prototype.id,
  MyUserRelations
> {
  constructor(
    @inject('datasources.myuserdb') dataSource: MyUserdbDataSource,
  ) {
    super(MyUser, dataSource);
  }
}
