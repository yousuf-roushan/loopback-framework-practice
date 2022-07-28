import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {

  @property ({
    type: 'string'
  })
  remindAtAddress?: string;

  @property({
    type:'string'
  })
  remindAtGeo?: string;

  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property(
      {
        type: 'string',
      })
  address?: string;

  @property({
    type: 'date',
  })
  dob?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'number',
  })
  mobileNumber?: number;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
