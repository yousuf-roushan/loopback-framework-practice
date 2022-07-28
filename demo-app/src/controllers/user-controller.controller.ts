import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response, HttpErrors,
} from '@loopback/rest';
import {MyUser} from '../models';
import {MyUserRepository} from '../repositories';
import {Geocoder} from "../services";
import {inject} from "@loopback/core";
import {authenticate} from "@loopback/authentication";

@authenticate('jwt')
export class UserControllerController {
  constructor(
    @repository(MyUserRepository)
    public userRepository : MyUserRepository,
    @inject('services.Geocoder') protected geoService: Geocoder,
  ) {}

  @post('/user')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(MyUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MyUser, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<MyUser, 'id'>,
  ): Promise<MyUser> {
    return this.userRepository.create(user);
  }

  @get('/user/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MyUser) where?: Where<MyUser>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/user')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MyUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MyUser) filter?: Filter<MyUser>,
  ): Promise<MyUser[]> {
    return this.userRepository.find(filter);
  }

  @patch('/user')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MyUser, {partial: true}),
        },
      },
    })
    user: MyUser,
    @param.where(MyUser) where?: Where<MyUser>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/user/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MyUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MyUser, {exclude: 'where'}) filter?: FilterExcludingWhere<MyUser>
  ): Promise<MyUser> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/user/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MyUser, {partial: true}),
        },
      },
    })
    user: MyUser,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/user/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: MyUser,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/user/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
