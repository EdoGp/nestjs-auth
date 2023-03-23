import { MinLength } from 'class-validator';

export class SignInDto {
  @MinLength(4)
  username: string;

  @MinLength(10)
  password: string;
}
