import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(3)
  firstName: string;

  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

  @MinLength(10)
  passwordConfirmation: string;
}
