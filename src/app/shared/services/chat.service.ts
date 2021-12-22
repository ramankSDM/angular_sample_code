import { Injectable, OnDestroy } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import io from "socket.io-client";
import { CookieService } from 'ngx-cookie';

@Injectable()
export class ChatService {
  public socket = null;
  public loginUser: any;
  public adminUser: any;
  private dataSource = new BehaviorSubject<any>(null);
  getObserver = this.dataSource.asObservable();

  constructor(private _cookieservice: CookieService) {
    this.loginUser = this._cookieservice.get("user-starsin");
    if (this.loginUser) {
      this.loginUser = JSON.parse(this._cookieservice.get("user-starsin"));
      this.initSocket();
      this.authenticate(this.loginUser.loginToken);
    }

    this.adminUser = this._cookieservice.get("starin-admin");
    if (this.adminUser) {
      this.adminUser = JSON.parse(this._cookieservice.get("starin-admin"));
      this.initSocket();
      this.authenticate(this.adminUser.loginToken);
    }
  }

  public ngOnDestroy() {
    this.logoutSocket();
  }

  initMethod() {
    //this.addRoom();
  }

  setObserver(data: any) {
    this.dataSource.next(data);
  }

  /** User Leave Chat room*/
  initSocket() {
    this.socket = io.connect(environment.socketUrl);
    this.initMethod();
  }

  /** User Leave Chat room*/
  authenticate(token) {
    this.socket.emit("authenticate", { token }, (error, res) => { });
  }

  deactiveUser() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("deactiveUser", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  activeUser() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("activeUser", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  followUser() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("followUser", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  unfollowUser() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("unfollowUser", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  assignPromo() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("assignPromo", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  createBooking() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("createBooking", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  acceptBooking() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("acceptBooking", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  rejectBooking() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("rejectBooking", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  cancelBooking() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("cancelBooking", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  postponeBooking() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("postponeBooking", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  completeBooking() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("completeBooking", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  bookingReminder() {
    let observable = new Observable<any>((observer) => {
      this.socket.on("bookingReminder", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }


  /** User Leave Chat room*/
  logoutSocket() {
    this.socket.disconnect();
  }
}
