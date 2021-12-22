import { Injectable, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from "rxjs";

@Injectable()
export class DataService {
  @Output() public notifyBankStatus = new EventEmitter<boolean>();
  @Output() public openCartPopUp = new EventEmitter<boolean>();
  @Output() public showLocationMsg = new EventEmitter<boolean>();

  @Output() public hideFooter = new EventEmitter<boolean>();
  @Output() public reRenderVendorPic = new EventEmitter<boolean>();
  @Output() public getNotifications = new EventEmitter<boolean>();
  @Output() public filterData = new EventEmitter<any>();
  @Output() public setLocation = new EventEmitter<any>();
  @Output() public setProfile = new EventEmitter<any>();
  private dataSource = new BehaviorSubject("");
  currentMessage = this.dataSource.asObservable();
  private notify = new Subject<any>();
  /**
   * Observable string streams
   */
  notifyObservable$ = this.notify.asObservable();

  constructor() {}

  /** Message change Observable to show result on other component*/
  changeMessage(data: any) {
    this.dataSource.next(data);
  }
  /**Set Observable to show result on other component*/
  set(set: any, key: string) {
    this.notify.next({ set: set, key: key });
  }

  /**get Observable to show result on other component*/
  get(): Observable<any> {
    return this.notify.asObservable();
  }
}
