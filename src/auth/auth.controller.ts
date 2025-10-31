import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from '../user/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    const u: any = result.user;
    return {
      message: 'Login successful',
      data: {
        user: {
          id: u._id || u.id,
          fullName: u.fullName,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        },
        access_token: result.access_token,
      },
    };
  }
}