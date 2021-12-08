import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, ServiceAccount, App } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import getFirebaseConfig from './firebase-config';

@Injectable()
export class FirebaseService {
  private firebaseApp: App;
  private firebaseAuth: Auth;

  constructor(configService: ConfigService) {
    this.firebaseApp = initializeApp({
      credential: cert({
        ...getFirebaseConfig(configService),
      } as ServiceAccount),
      databaseURL: 'https://tutorial-auth-d9a34.firebaseio.com',
    });
    this.firebaseAuth = getAuth(this.firebaseApp);
  }

  getAuth() {
    return this.firebaseAuth;
  }
}
