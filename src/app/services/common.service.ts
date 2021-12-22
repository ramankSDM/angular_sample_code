import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { Subject, } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/Rx';
import { map } from "rxjs/operators";


@Injectable({
  providedIn: "root",
})
export class CommonService {
  private notify = new Subject<any>();
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  /**
   * Observable string streams
   */
  notifyObservable$ = this.notify.asObservable();

  constructor(private http: HttpClient, private router: Router,
    private _cookieservice: CookieService,
    private toastr: ToastrService) {
  }

  public notifyOther(data: any) {
    this.notify.next(data);
  }
  /** Get Method */
  get(path) {
    return this.http.get<any>(`${environment.apiEndPoint}${path}`).pipe(map(res => res as any));
  }

  /** Get Method */
  getMultiple(path, first, second, options) {
    const params = new URLSearchParams();
    for (const key in options) {
      params.set(key, options[key]);
    }
    return this.http.get<any>(`${environment.apiEndPoint}${path}/${first}/${second}?${params}`).pipe(map(res => res as any));
  }

  /** Get Method */
  getImage(path): Observable<Blob> {
    return this.http.get(path, { responseType: "blob" }).pipe(map(res => res as any));
  }

  /** Put Method */
  put(path, body) {
    return this.http.put<any>(`${environment.apiEndPoint}${path}`, body).pipe(map(res => res as any));
  }

  /** POST Method */
  post(path, body) {
    return this.http.post<any>(`${environment.apiEndPoint}${path}`, body).pipe(map(res => res as any));
  }


  /** DELETE Method */
  delete(path) {
    return this.http.delete<any>(`${environment.apiEndPoint}${path}`).pipe(map(res => res as any));
  }

  /** Query Params Method */
  queryParams(path, options) {
    const params = new URLSearchParams();
    for (const key in options) {
      params.set(key, options[key]);
    }
    return this.http.get<any>(`${environment.apiEndPoint}${path}?${params}`).pipe(map(res => res as any));
  }

  /** GET METHOD by ID*/
  getById(path, param) {
    return this.http.get<any>(`${environment.apiEndPoint}${path}/${param}`).pipe(map(res => res as any));
  }

   /** Loding Method Set and Get */
   loading(value = false) {
    this.isLoading.next(value);
  }

  verifyUser(path) {
    return new Promise((resolve) => {
      this.http.get<any>(`${environment.apiEndPoint}${path}`).pipe(map(res => res as any)).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err.error);
      });
    });
  }

   /** Common Function for handling api errors */
   handleError(err) {
    console.log('---------------errrrrorororor------------', err);
    // tslint:disable-next-line:max-line-length
    if (err && err.status && (err.status === 403 || err.status === 401) && err.error && (err.error === 'Forbidden' || err.error === 'Unauthorized')) {
      this._cookieservice.removeAll();
      this.router.navigate(['/admin/login']);
      this.toastr.error(err.message);
    } else if (err && err.error && err.error.message) {
      this.toastr.error(err.error.message);
    } else if (err && err.error && err.error.errors && err.error.errors.message) {
      this.toastr.error(err.error.errors.message);
    } else if (err && err.error && err.error.error && err.error.error.message) {
      this.toastr.error(err.error.error.message);
    } else if (err && err.error &&  err.error.status==400 && err.error.message) {
      this.toastr.error(err.error.message);
    } else {
      this.toastr.error('Something Went wrong. Please try again');
    }
  }

  createSlug(req) {
    req = req.replace(/\s+/g, "-");
    req = req
      .replace(/[`~!@#$%^&*()_\+=\[\]{};:"\\|\/,'.<>?\s]/g, "")
      .toLowerCase();
    return req;
  }

}
