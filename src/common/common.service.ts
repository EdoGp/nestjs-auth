import { CommonInterface } from './common.interface';
import {
  ConflictException,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { FilterQuery, Model, ObjectId, UpdateQuery } from 'mongoose';
import { CommonSchema } from './Schemas/common.schema';

export abstract class Service<T extends CommonSchema>
  implements CommonInterface
{
  private readonly modelName: string;
  private readonly serviceLogger: LoggerService;
  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   *
   * @param { Logger } logger - The injected logger.
   * @param { Model } model - The injected model.
   */
  constructor(logger: LoggerService, private readonly model: Model<T>) {
    this.serviceLogger = logger;
    for (const modelName of Object.keys(model.modelName)) {
      if (model.collection.conn.models[modelName] === this.model) {
        this.modelName = modelName;
        break;
      }
    }
  }

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   *
   * @template { T } Model of the returned value
   * @param { T } conditions - The search conditions for the model
   * @param { string } projection - The projection conditions
   * for the return value.
   * @param { Record } options - The return value options
   * @returns { Promise<T> } Model - The instance of the model found
   */
  async findOne<T>(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, unknown> = {},
    options: Record<string, any> = {},
  ): Promise<T> {
    try {
      this.serviceLogger.debug(
        `findOne: ${this.modelName} ${JSON.stringify(conditions)}`,
      );
      return await this.model.findOne(
        conditions as FilterQuery<T>,
        projection,
        options,
      );
    } catch (error) {
      this.serviceLogger.error(`Could not find ${this.modelName} entry:`);
      this.serviceLogger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   *
   * @template { T } Model of the returned value
   * @param { T } conditions - The search conditions for the model
   * @param { string } projection - The projection conditions
   * for the return value.
   * @param { Record } options - The return value options
   * @returns { Promise<T[]> } Model array - An array of the models that match
   * the search parameters
   */
  async findMany<T>(
    conditions: Partial<Record<keyof T, unknown>> = {},
    projection: string | Record<string, unknown> = {},
    options: Record<string, any> = {},
  ): Promise<T[]> {
    try {
      return await this.model.find(
        conditions as FilterQuery<T>,
        projection,
        options,
      );
    } catch (error) {
      this.serviceLogger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   * @template { T } Model of the returned value
   * @param { T } conditions - The search conditions for the model
   * @param { string } projection - The projection conditions
   * for the return value.
   * @param { Record } options - The return value options
   * @returns { Promise<number> } number - The number of items that match the search
   */
  async countMany<T>(
    conditions: Partial<Record<keyof T, unknown>>,
    options: Record<string, unknown> = {},
  ): Promise<number> {
    try {
      return await this.model
        .find(conditions as FilterQuery<T>, options)
        .countDocuments();
    } catch (error) {
      this.serviceLogger.error(error);

      throw new InternalServerErrorException();
    }
  }

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   * @template { T } Model of the returned value
   * @param { T } conditions - The search conditions for the model
   * @param { string } projection - The projection conditions
   * for the return value.
   * @param { Record } options - The return value options
   * @returns { Promise<number> } number - The number of items that match the search
   */
  async createOneOrMany<T>(item: Partial<T> | Partial<T[]>): Promise<T | T[]> {
    try {
      const items = await this.model.create(item);
      return items as T | T[];
    } catch (error) {
      this.serviceLogger.error(error);
      if (error.code === 11000) {
        throw new ConflictException(
          `Invalid unique field "${
            Object.keys(error.keyValue)[0]
          }", with value "${error.keyValue[Object.keys(error.keyValue)[0]]}"`,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   * @template { T } Model of the returned value
   * @param { T } conditions - The search conditions for the model
   * @param { string } projection - The projection conditions
   * for the return value.
   * @param { Record } options - The return value options
   * @returns { Promise<number> } number - The number of items that match the search
   */
  async updateOneById<T>(
    _id: ObjectId | string,
    item: UpdateQuery<T>,
    options: Record<string, unknown> = {},
  ): Promise<T> {
    try {
      const updatedItem = await this.model.findByIdAndUpdate(_id, item, {
        new: true,
        useFindAndModify: false,
        ...options,
      });
      return updatedItem as T;
    } catch (error) {
      this.serviceLogger.error(error);
      if (error.code === 11000) {
        throw new ConflictException(
          `Invalid unique field "${
            Object.keys(error.keyValue)[0]
          }", with value "${error.keyValue[Object.keys(error.keyValue)[0]]}"`,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   * @param { T } conditions - The search conditions for the model
   * @param { string } projection - The projection conditions
   * for the return value.
   * @param { Record } options - The return value options
   * @returns { Promise<number> } number - The number of items that match the search
   */
  async deleteById(_id: ObjectId | string): Promise<void> {
    const filterQuery = { _id };
    try {
      await this.model.deleteOne(filterQuery as FilterQuery<T>);
      return;
    } catch (error) {
      this.serviceLogger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   * @template { T } Model of the returned value
   * @param { T } conditions - The search conditions for the model
   * @param { string } projection - The projection conditions
   * for the return value.
   * @param { Record } options - The return value options
   * @returns { Promise<number> } number - The number of items that match the search
   */
  async deleteSoftById(_id: ObjectId | string): Promise<void> {
    try {
      await this.model.findByIdAndUpdate(_id, {
        deleted: true,
      } as unknown as UpdateQuery<T>);
      return;
    } catch (error) {
      this.serviceLogger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
