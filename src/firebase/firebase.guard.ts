import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';
import { UserPayload } from './firebase.middleware';
import { FirebaseService } from './firebase.service';
import { Request } from 'express';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private auth: Auth;

  constructor(firebaseService: FirebaseService) {
    this.auth = firebaseService.getAuth();
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    return this.validateRequest(request);
  }

  async validateRequest(req: Request): Promise<boolean> {
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
        return true;
      } catch (error) {
        throw new UnauthorizedException(error);
      }
    } else {
      return false;
    }
  }
}
