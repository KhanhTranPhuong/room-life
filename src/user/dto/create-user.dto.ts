import { IsEmail, IsString, MinLength, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { IsPasswordMatching } from '../../common/decorators/password-matching.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Full name must not exceed 50 characters' })
  @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, { message: 'Full name can only contain letters and spaces' })
  fullName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)'
  })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @IsString({ message: 'Confirm password must be a string' })
  @IsPasswordMatching('password')
  confirmPassword: string;
}