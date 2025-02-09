// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // The JwtAuthGuard is configured to use the 'jwt' strategy defined in JwtStrategy.
  // It will handle the token validation for incoming requests.
}
