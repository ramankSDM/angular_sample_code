import { Component, OnInit, Input, Output, EventEmitter,AfterViewInit } from "@angular/core";
import { environment } from 'src/environments/environment';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import {
  HttpClient,
  HttpResponse,
  HttpRequest,
  HttpEventType,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, last, map, tap } from "rxjs/operators";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: "app-material-file-upload",
  templateUrl: "./material-file-upload.component.html",
  styleUrls: ["./material-file-upload.component.scss"],
  animations: [
    trigger("fadeInOut", [
      state("in", style({ opacity: 100 })),
      transition("* => void", [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MaterialFileUploadComponent implements OnInit {

  baseURL = environment.apiEndPoint;
  /** Link text */
  @Input() text = "Upload";
  //@Input() filetype:any; 
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = "files";
  /** Target URL for file uploading. */
  @Input() target = this.baseURL + "file-upload";
  //@Input() target = "https://file.io";
  /** File extension that accepted, same as 'accept' of <input type="file" />. 
          By the default, it's set to 'image/*'. */
  @Input() accept = "video/*";
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() complete = new EventEmitter<string>();
  @Input() filetype:any;
  //private files: any = [];
  public files: any = [];

  constructor(private _http: HttpClient, private commonServ: CommonService,) { }
  ngOnInit() {
    if (this.filetype) {
      this.accept = this.filetype + "/*";
    }
    console.log(this.filetype);
  }
  
  onClick() {
    const fileUpload = document.getElementById(
      "fileUpload"
    ) as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({
          data: file,
          state: "in",
          inProgress: false,
          progress: 0,
          canRetry: false,
          canCancel: true,
        });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel) {
    const fd = new FormData();
    fd.append(this.param, file.data);

    const req = new HttpRequest("POST", this.target, fd, {
      reportProgress: true,
    });


    file.inProgress = true;
    file.sub = this._http
      .request(req)
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round((event.loaded * 100) / event.total);
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        tap((message) => { }),
        last(),
        catchError((error: HttpErrorResponse): any => {
          file.inProgress = false;
          file.canRetry = true;
          console.log(`${file.data.name} upload failed.`);
          return;
        })
      )
      .subscribe((event: any) => {
        if (typeof event === "object") {
          this.removeFileFromArray(file);
          this.complete.emit(event.body);
        }
      });
  }

  private uploadFiles() {
    const fileUpload = document.getElementById(
      "fileUpload"
    ) as HTMLInputElement;
    fileUpload.value = "";

    this.files.forEach((file) => {
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub: any;
}
