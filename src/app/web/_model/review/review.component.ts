import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Input() public reviewData;
  completeRequest: any;
  selectedLang: any = 'en';

  langs: any = [];
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
     private commonService: CommonService,
     public activeModal: NgbActiveModal,
    public ds: DataService,private translate: TranslateService

  ){
    this.completeRequest = {
      comment: '',
      rating: 1
    };
    
   }

  ngOnInit(): void {
    this.completeRequest = {
      comment: '',
      rating: 1,
      celebrityId:this.reviewData.celebrityId,
      bookingId: this.reviewData._id,
      fanId: this.reviewData.userId,
      requestType: this.reviewData.requestType
    };

    this.langs = [{ name: 'English', code: 'en' }, { name: 'Arabic', code: 'ar' }];
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en' // here getting the selected language
    this.ds.get().subscribe(async (data) => {
      if (data.key == "currentLang") {
        this.selectedLang = data.set;
        this.translate.use(this.selectedLang)
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = this.translate.currentLang ? this.translate.currentLang : 'en';
    });
  }

  /*
  Name: onRate
  Description: Rate to the booking
  */
  onRate(event) {
    this.completeRequest.rating = event.newValue;
  }

  fanRating() {
    this.spinner.show();
    let path = `platform-rating/add`;
    this.commonService.post(path, this.completeRequest).subscribe(response => {
      this.toastr.success('Rating done successfully');     
      this.spinner.hide(); 
      this.activeModal.close();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
}
closeModal(){
  this.activeModal.close();
}

}
