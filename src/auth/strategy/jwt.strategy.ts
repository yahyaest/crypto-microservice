import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../interface/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  // async validate(payload: { sub: number; email: string }) {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       id: payload.sub,
  //     },
  //   });
  //   delete user.password;
  //   return user;
  // }

  async validate(payload: {
    sub: number;
    email: string;
  }): Promise<AuthenticatedUser> {
    // Add any necessary validation logic here
    // For example, you can retrieve the user from the database based on the payload information

    // If the user is not found or does not have the necessary permissions, throw an UnauthorizedException
    if (!payload.email ) {
      throw new UnauthorizedException();
    }

    // Return the authenticated user
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
