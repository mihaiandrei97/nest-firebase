import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Auth } from 'firebase-admin/auth';
import { FirebaseService } from './firebase.service';

export interface UserPayload {
  user_id: string;
  email: string;
  roles: string[];
}

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  private auth: Auth;

  constructor(firebaseService: FirebaseService) {
    this.auth = firebaseService.getAuth();
  }

  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      try {
        const decodedToken = await this.auth.verifyIdToken(
          token.replace('Bearer ', ''),
        );
        req['user'] = {
          email: decodedToken.email,
          roles: decodedToken.roles || [],
          user_id: decodedToken.user_id,
        } as UserPayload;
        next();
      } catch (error) {
        if (error.code === 'auth/id-token-expired') {
          FirebaseAuthMiddleware.refreshTokenExpired(res, error);
        } else {
          FirebaseAuthMiddleware.accessDenied(req.url, res);
        }
      }
    } else {
      FirebaseAuthMiddleware.accessDenied(req.url, res);
    }
  }

  private static accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'access denied',
    });
  }

  private static refreshTokenExpired(res: Response, error: any) {
    res.status(403).json({
      statusCode: 401,
      timestamp: new Date().toISOString(),
      message: error.message,
      code: error.code,
    });
  }
}
