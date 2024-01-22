import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../services/http.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
import { SafeArea } from '@aashu-dubey/capacitor-statusbar-safe-area';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonModal) modal: IonModal;

  animationsList: string[] = [];
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  ipAddress = '';
  canAnimateIndicator = false;

  constructor(private httpService: HttpService, private toastController: ToastController) {}

  ngOnInit() {
    this.getSettings();
  }

  async getSettings() {
    const value = await Preferences.get({ key: 'IP' });
    this.ipAddress = `${value.value}`;
    if (this.ipAddress == 'null' || '') {
      this.ipAddress = '127.0.0.1'
    }
    this.httpService.setURLAddress(this.ipAddress);
    this.testConnection();
  }

  getAnimations() {
    this.animationsList= [];
    this.httpService.getAnimations()
      .subscribe(
        (res: any) => {
          let json = JSON.parse(res.data);
          console.log(json.animations);
          this.animationsList = json.animations;
        }
      );
  }

  playAnimation(animation: string) {
    this.httpService.playAnimation(animation)
      .subscribe(
        (res: any) => {
          console.log(res);
        }
      );
  }

  testConnection() {
      this.httpService.testConnection(this.ipAddress)
        .subscribe(
          (res: any) => {
            if(res.status == 200) {
              let json = JSON.parse(res.data);
              if (json.canAnimate == true) {
                this.presentToast("Connection Successful")
                this.canAnimateIndicator = true;
              } else {
                this.presentToast("Connection Failed!")
                this.canAnimateIndicator = false;
              }
            } else {
              this.presentToast("Check IP Address")
              this.ipAddress = ''
              this.canAnimateIndicator = false;
            }
          }
        );
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.ipAddress, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      Preferences.set({
        key: 'IP',
        value: `${ev.detail.data}`,
      });
      this.message = `Hello, ${ev.detail.data}!`;
      console.log(this.message)
      this.getSettings();
    } else {
      //Preferences.remove({ key: 'IP' });
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
    });

    await toast.present();
  }

  async getStatusBarHeight() {
    const { height } = await SafeArea.getStatusBarHeight();
    console.log(height); // Ex. 29.090909957885742
  };

  async getSafeAreaInsets() {
    const insets = await SafeArea.getSafeAreaInsets();
    console.log(insets);
  };
}
