import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Location } from "@angular/common";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { ChatService } from "./chat.service";
import { CookieService } from 'ngx-cookie';
import { countries } from "../_json_files/countries";
declare var require: any
const querystring = require("querystring");

@Injectable({
  providedIn: "root",
})
export class CommonService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    public router: Router,
    private http: HttpClient,
    private _location: Location,
    private messageService: MessageService,
    private _chatService: ChatService,
    private _cookieservice: CookieService
  ) {}
  /** Get Method */
  get(path, loader = true) {
    //this.loading(loader);
    return this.http.get<any>(`${environment.apiEndPoint}${path}`).pipe(
      map((res) => {
        //this.loading(false);
        return res;
      })
    );
  }

  /** Get Method */
  getImage(path): Observable<Blob> {
    return this.http.get(path, { responseType: "blob" }).pipe((res) => {
      return res;
    });
  }

  /** Put Method */
  put(path, body, loader = true) {
    this.loading(loader);
    return this.http.put<any>(`${environment.apiEndPoint}${path}`, body).pipe(
      map((res) => {
        this.loading(false);
        return res;
      })
    );
  }
  /** POST Method */
  post(path, body, loader = true) {
    this.loading(loader);
    return this.http.post<any>(`${environment.apiEndPoint}${path}`, body).pipe(
      map((res) => {
        this.loading(false);
        return res;
      })
    );
  }
  /** DELETE Method */
  delete(path, body, loader = true) {
    this.loading(loader);
    return this.http.delete<any>(`${environment.apiEndPoint}${path}`).pipe(
      map((res) => {
        this.loading(false);
        return res;
      })
    );
  }

  /** Query Params Method */
  queryParams(path, options, loader = true) {
    this.loading(loader);
    const params = new URLSearchParams();
    for (const key in options) {
      params.set(key, options[key]);
    }
    return this.http.get<any>(`${environment.apiEndPoint}${path}?${params}`).pipe(
      map((res) => {
        this.loading(false);
        return res;
      })
    );
  }
  /** GET METHOD by ID*/
  getById(path, body, loader = true) {
    this.loading(loader);
    return this.http.get<any>(`${environment.apiEndPoint}${path}/${body}`).pipe(
      map((res) => {
        this.loading(false);
        return res;
      })
    );
  }
  /** Show Message  */
  showAlert(type, message) {
    this.messageService.add({ severity: type, detail: message });
    if (message == "Session Expired.") {
      this.logout();
    }
  }

  showCustom(summary, detail) {
    this.messageService.add({
      key: "custom",
      severity: "info",
      summary: summary,
      detail: detail,
    });
  }

  /** Login Storage GEt  */
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user-starsin"));
    return user ? true : false;
  }
  /** Loding Method Set and Get */
  loading(value = false) {
    this.isLoading.next(value);
  }

  /** Location back to previous URl */
  back() {
    this._location.back();
  }
  /** Clear local Storage */
  logout() {
    // this._chatService.logoutSocket();
    localStorage.clear();
    this._cookieservice.removeAll();
    this.router.navigate(["/"]);
  }

  /** Get Location by Lat and Long*/
  getLocation(latLong) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLong}&key=${environment.GOOGLE_API_KEY}`
      )
      .pipe(
        map((res) => {
          this.loading(false);
          return res;
        })
      );
  }

  getIpAddress() {
    //https://jsonip.com
    return this.http.get<any>(`https://api.ipify.org/?format=json`).pipe(
      map((res) => {
        this.loading(false);
        return res;
      })
    );
  }

  // getGEOLocation(ip) {
  //   // https://api.ipgeolocation.io/ipgeo?apiKey=YourAPIKEY&ip="+ip;
  //   return this.http.get<any>(`https://api.ipgeolocation.io/ipgeo?apiKey=${
  //     environment.IP_GEOLOCATION_KEY}&ip=${ip}`)
  //     .pipe(map(res => {
  //       this.loading(false);
  //       return res;
  //     }));
  // }

  getGEOLocation() {
    return this.http.get<any>(`http://ip-api.com/json`).pipe(
      map((res) => {
        this.loading(false);
        return res;
      })
    );
  }

  /** Get Cart details based on package Ids*/
  getCartDetails(packageIds) {
    let res = [];
    res = packageIds.map((row) => row.packageId);
    let params = { packageIds: res };
    let query = querystring.stringify(params);
    return new Promise((resolve, reject) => {
      this.get(`service/cart-items/?${query}`).subscribe(
        (res) => {
          resolve(res.data);
        },
        (err) => {
          reject("Something went Wrong!");
        }
      );
    });
  }
  /** Create Query Params*/
  returnQueryParams(options) {
    let query = querystring.stringify(options);
    return query;
  }
  /** Convert str to date In timeStamp*/
  convertDate(str) {
    return new Date(str).getTime();

    // '',
    //   mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    //   day = ("0" + date.getDate()).slice(-2);
    // return [date.getFullYear(), mnth, day].join("-");
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf(".") + 1);
    if (
      ext.toLowerCase() == "png" ||
      ext.toLowerCase() == "PNG" ||
      ext.toLowerCase() == "jpg" ||
      ext.toLowerCase() == "JPG" ||
      ext.toLowerCase() == "jpeg"
    ) {
      return true;
    } else {
      return false;
    }
  }
}
