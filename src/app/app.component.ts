import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AppStore } from './app.store';
import { UserModel } from './model/user.model';
import { SocketService } from './service/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public user: UserModel;

  constructor(private socketService: SocketService) {
    AppStore.user.subscribe(user => {
      this.user = user;
      console.log(this.user);
    });

    if (!environment.production) {
      console.log('BIG BUNDLE 😱');
    } else {
      console.log('Small bundle 😎');
    }

  }
}
