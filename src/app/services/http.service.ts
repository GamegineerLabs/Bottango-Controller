import { Injectable } from '@angular/core';
import {CapacitorHttp, HttpOptions, HttpResponse} from '@capacitor/core';
import {from, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  //url = "https://2f42-68-99-246-114.ngrok-free.app/Animations/"
  url = ""
  animationsString = '/Animations/';
  playbackString = '/PlaybackState/';
  testConnectionString = '/CanAnimate/';

  constructor() { }

  setURLAddress(address: string) {
    if (address.includes('localhost') || address.includes('127.0.0.1')) {
      this.url = `http://${address}`
    } else {
      this.url = `https://${address}`;
    }

  }

  getAnimations() {
    const options: HttpOptions = {
        url: `${this.url}${this.animationsString}`,
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      }

    ;
    return from(CapacitorHttp.get(options));
  }

  playAnimation(animation: string) {
    console.log('animation: ' + animation);
    const options: HttpOptions = {
        url: `${this.url}${this.playbackString}`,
        headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "selectedAnimationName": animation,
          "isPlaying": true,
          "playbackTimeInMS": 1
        })
      };
    console.log(options);
    return from(CapacitorHttp.put(options));
  }

  testConnection(ipAddress: string) {
    const options: HttpOptions = {
        url: `https://${ipAddress}${this.testConnectionString}`,
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      }

    ;
    return from(CapacitorHttp.get(options).catch((error) => {
      console.log(error.message)
      return error.message as any
    }));
  }
}
