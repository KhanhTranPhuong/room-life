import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('🔑 JWT Strategy - using secret:', jwtSecret);
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // payload is the decoded JWT payload. Return the user object or a subset attached to request.user
  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    if (!user) return null;
    
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role,
      user: user
    };
  }
}