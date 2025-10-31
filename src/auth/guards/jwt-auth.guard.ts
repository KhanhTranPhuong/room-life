import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    console.log('🔒 JwtAuthGuard activated');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('🔍 Authorization header:', authHeader);
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🚨 JwtAuthGuard handleRequest:');
    console.log('  Error:', err);
    console.log('  User:', user);
    console.log('  Info:', info);
    
    if (err || !user) {
      console.log('❌ JWT Authentication failed');
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}