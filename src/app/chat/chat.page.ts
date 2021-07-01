import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import { FirestoreMessagesService } from '../services/firestore-messages.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface messageData {
  name: string;
  message: string;
  date: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  messageList = [];
  messageData: messageData;
  messageForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private firestoremessagesservice: FirestoreMessagesService,
  ) {
    this.messageData = {} as messageData;
  }

  ngOnInit() {
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.messageData.name = res.email;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });

    this.firestoremessagesservice.read().subscribe(data => {
      this.messageList = data.map(e => {
        if(!e.payload.doc.data()){
          console.log('null');
        }
        return {
          id: e.payload.doc.id,
          // eslint-disable-next-line @typescript-eslint/dot-notation
          name: e.payload.doc.data()['name'],
          // eslint-disable-next-line @typescript-eslint/dot-notation
          message:e.payload.doc.data()['message']
        };
      });

    });

  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  CreateRecord() {
    this.messageData.date = new Date();
    this.messageData.message = this.messageData.message.toString();
    this.firestoremessagesservice.create(this.messageData)
      .then(() => {
        this.messageData.message = null;
      })
      .catch(error => {
        console.log(error);
      });
  }

  logout() {
    this.authService.logoutUser()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      });
  }
}
