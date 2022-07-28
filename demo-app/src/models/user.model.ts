import {Entity, model, property} from '@loopback/repository';

@model()
export class MyUser extends Entity {

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


  constructor(data?: Partial<MyUser>) {
    super(data);
  }
}

export interface MyUserRelations {
  // describe navigational properties here
}

export type UserWithRelations = MyUser & MyUserRelations;
