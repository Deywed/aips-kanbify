import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const usernameRegex = /^(?![0-9])[A-Za-z0-9_]+$/;

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(usernameRegex, {
    message:
      'Username can only contain letters, numbers, and underscores, and cannot start with a number',
  })
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(passwordRegex, {
    message:
      'Password must be at least 6 characters, with 1 number, 1 lowercase, and 1 uppercase',
  })
  password: string;
}
