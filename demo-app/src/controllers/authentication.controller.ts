// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';

import {
  TokenServiceBindings,
  MyUserService,
  UserServiceBindings,
  UserRepository, Credentials
} from "@loopback/authentication-jwt";

import {TokenService} from "@loopback/authentication";

import {SecurityBindings, UserProfile} from '@loopback/security';

import {repository} from '@loopback/repository';

import {post, requestBody, SchemaObject} from '@loopback/rest';

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
      @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @post('/users/login',{
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
