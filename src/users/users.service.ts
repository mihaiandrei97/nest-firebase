import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UsersService {
  constructor(private firebaseService: FirebaseService) {}

  getUsers() {
    return this.firebaseService.getAuth().listUsers();
  }
}
