import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CommonQueryDTO<T> {
  @IsOptional()
  @Transform(({ value }) => {
    const values = value.split(',');
    const select = {};
    for (const key of values) {
      select[key] = 1;
    }
    return value ? select : {};
  })
  select?: Record<string, unknown>;
  @IsOptional()
  @Transform(({ value }) => {
    const search = value ? JSON.parse(value) : {};
    return search;
  })
  s?: Partial<Record<keyof T, unknown>>;
  @IsOptional()
  filter?: string;
  @IsOptional()
  @Transform(({ value }) => {
    const values = value.split(',');
    const select = {};
    for (const key of values) {
      select[key.split('-').join('')] = key.indexOf('-') ? 1 : -1;
    }
    return value ? select : {};
  })
  sort?: Partial<Record<keyof T, unknown>>;
  @IsOptional()
  limit?: number = 20;
  @IsOptional()
  page?: number = 1;
  @IsOptional()
  @Transform((params) => {
    const {
      value,
      obj: { page = 1, limit = 0 },
    } = params;
    const offset = value + limit * (page - 1);
    return offset;
  })
  offset: number = this.limit * (this.page - 1);
}
