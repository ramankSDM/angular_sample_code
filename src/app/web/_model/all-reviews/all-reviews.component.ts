import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie';
import { DataService } from "../../../services/data.service";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-reviews',
  templateUrl: './all-reviews.component.html',
  styleUrls: ['./all-reviews.component.scss']
})
export class AllReviewsComponent implements OnInit {
  @Input() public celData;
  reviewList:[];
  total:number;
  count:number = 10;
  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal, private commonService: CommonService) { }

  ngOnInit(): void {
    this.getReview();
  }

  getReview() {
    this.spinner.show();
    let obj = {
      page:1,
      count:this.count,
      id:this.celData.id
    }
    let path = `booking/getReview`;
    this.commonService.queryParams(path,obj).subscribe(response => {
      this.reviewList = response.data.data;
      this.total = response.data.total;
      this.spinner.hide();
    }, err => {
      this.commonService.handleError(err);
    });
  }

  loadMore() {
    this.count = this.count + 10;
    this.reviewList = [];
    this.getReview()
  }

  closeModal() {
    this.count = 10;
    this.getReview();
    this.activeModal.dismiss('Cross click');
    this.spinner.hide();
  }

}
