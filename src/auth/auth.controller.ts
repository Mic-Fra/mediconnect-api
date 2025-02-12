// src/auth/auth.controller.ts
import { Controller, Post, Body, Res, HttpStatus, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Login and return both access and refresh tokens
  @Post('login')
  async login(@Body() loginDto: { email: string, password: string }, @Res() res: Response) {
    try {
      const { access_token} = await this.authService.validateUser(loginDto.email, loginDto.password);
      

      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        
        maxAge: 3600 * 1000, // 1 hour
      });

      
      return res.status(HttpStatus.OK).json({ message: 'Login successful' });
    } catch (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }
  }

  // Route to refresh access token
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: { refresh_token: string }, @Res() res: Response) {
    try {
      const { access_token, refresh_token } = await this.authService.refreshToken(refreshTokenDto.refresh_token);

      // Set the new access token in cookies
      res.cookie('access_token', access_token, {
        httpOnly: true, // Make sure the cookie is not accessible from JavaScript
        secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
        sameSite: 'strict',
        maxAge: 3600 * 1000, // 1 hour
      });

      // Set the new refresh token in cookies
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(HttpStatus.OK).json({ message: 'Token refreshed successfully' });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // Validate token route (for testing)
  @Get('validate')
  validate(@Req() req: Request) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
  

    // TODO: Verify the token using AuthService
    return { success: true, token };
  }



  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
  }
}
