import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from '../interface/auth.interface';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CustomLogger } from 'src/myLogger';

@Injectable()
export class CryptoAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  private readonly logger = new CustomLogger(CryptoAuthMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException();
      }

      const payload = await this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      // Check token validity in gateway by checking user exitance based on its email extracted from token payload
      const userMail = payload.email;
      const gatewayBaseUrl = this.config.get('GATEWAY_BASE_URL');
      const checkUserByEmailUrl = `${gatewayBaseUrl}/api/users/is_user`;
      this.logger.log(`Checking user with email ${userMail} existance in gataway`);
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let is_user = await axios.post(
        checkUserByEmailUrl,
        { email: userMail },
        options,
      );
      is_user = is_user.data;

      if (!is_user) {
        throw new Error(
          `Invalid token. User with email${userMail} doesn't exist`,
        );
      }

      const user: AuthenticatedUser = payload;

      // You can attach the authenticated user to the request object for future use in controllers or services
      req['user'] = user;

      next();
    } catch (error) {
      if (error.response) this.logger.error(error.response.data);
      else this.logger.error(error);
      throw new UnauthorizedException();
    }
  }
}
