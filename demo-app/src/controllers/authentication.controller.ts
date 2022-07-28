// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';

import {
  TokenServiceBindings,
  MyUserService,
  UserServiceBindings,
  UserRepository, Credentials, User
} from "@loopback/authentication-jwt";

import {TokenService} from "@loopback/authentication";

import {SecurityBindings, UserProfile} from '@loopback/security';

import {model, property, repository} from '@loopback/repository';

import {post, requestBody, SchemaObject, getModelSchemaRef} from '@loopback/rest';

import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';

@model()
export class NewAuthenticateRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class AuthenticationController {
  constructor(
      @inject(TokenServiceBindings.TOKEN_SERVICE)
      public jwtService: TokenService,
      @inject(UserServiceBindings.USER_SERVICE)
      public userService: MyUserService,
      @inject(SecurityBindings.USER, {optional: true})
      public user: UserProfile,
      @inject(UserServiceBindings.USER_REPOSITORY)
      protected userRepository: UserRepository,
  ) { }

  @post('/app/registerUser', {
    responses: {
      '200': {
        description: 'AuthToken',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  }) async signUp(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(NewAuthenticateRequest, {
              title: 'NewToken',
            }),
          },
        },
      })
      newAuthenticateRequest: NewAuthenticateRequest,
  ): Promise<User> {
    const password = await hash(newAuthenticateRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
        _.omit(newAuthenticateRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

  //  await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }

  @post('/app/authenticate',{
        responses: {
          '200': {
            description: 'Access-Token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                    }
                  }
                }
              }
            }
          }
        }
      }) async login (
          @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

}
