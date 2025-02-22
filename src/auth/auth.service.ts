// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  // Login and validate user credentials
  async validateUser(email: string, password: string) {
    console.log("Checking user login for:", email); // 🔹 Debug log

    const user = await this.authRepository.findOne({where:{email}});

    if (!user) {
      console.error("User not found for email:", email);
      throw new UnauthorizedException("Invalid credentials");
    }

    console.log("User found:", user); // 🔹 Debug log

    // 🔹 Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password validation:", isPasswordValid); // 🔹 Debug log

    if (!isPasswordValid) {
      console.error("Incorrect password for:", email);
      throw new UnauthorizedException("Invalid credentials");
    }

    // 🔹 Generate JWT token
    const payload = { id: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  // Generate both Access and Refresh Tokens
  async generateTokens(user: Auth) {
    const payload = { email: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '1h', // Access token expires in 1 hour
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token expires in 7 days
    });

    return { access_token, refresh_token };
  }

  // Refresh Token method
  async refreshToken(refresh_token: string) {
    try {
      // Verify and decode the refresh token
      const decoded = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_SECRET || 'yourSecretKey',
      });

      const user = await this.authRepository.findOne({ where: { id: decoded.sub } });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate new access and refresh tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Validate the JWT token
  async validateToken(token: string): Promise<Auth> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'yourSecretKey',
      });

      const user = await this.authRepository.findOne({ where: { id: decoded.sub } });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
