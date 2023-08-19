import { ObjectId } from 'mongoose';

export interface CommonInterface {
  findOne<T>(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, unknown>,
    options: Record<string, any>,
  ): Promise<T>;
  findMany<T>(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, unknown>,
    options: Record<string, any>,
  ): Promise<T[]>;
  countMany<T>(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, unknown>,
    options: Record<string, any>,
  ): Promise<number>;
  createOneOrMany<T>(item: Partial<T> | Partial<T[]>): Promise<T[] | T>;
  updateOneById<T>(
    _id: ObjectId,
    item: Partial<T>,
    options: Record<string, unknown>,
  ): Promise<T>;
  deleteById(_id: ObjectId | string): Promise<void>;
  deleteSoftById(_id: ObjectId | string): Promise<void>;
}
