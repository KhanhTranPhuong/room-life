import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from '../user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Register user and return sanitized user + token
  async register(createUserDto: CreateUserDto): Promise<{ success: boolean; message: string }> {
    await this.userService.create(createUserDto);
    return {
      success: true,
      message: 'User registered successfully',
    };
  }

  // Login and return sanitized user + token
  async login(loginDto: LoginDto): Promise<{ user: any; access_token: string }> {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.validatePassword(password, (user as any).password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: (user as any).email,
      sub: (user as any)._id,
      role: (user as any).role,
    };

    const token = this.jwtService.sign(payload);

    const safeUser = (user as any).toObject ? (user as any).toObject() : { ...(user as any) };
    delete safeUser.password;

    return {
      user: safeUser,
      access_token: token,
    };
  }

  // helper used by guards if needed
  async validateUser(payload: any): Promise<any> {
    return this.userService.findById(payload.sub);
  }
}