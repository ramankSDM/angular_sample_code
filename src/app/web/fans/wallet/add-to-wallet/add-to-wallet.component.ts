import { Component, OnInit,   Input,
  ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  CommonService
} from 'src/app/services/common.service';
import {
  StripeService,
  StripeCardComponent
} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js'
import {
  NgxSpinnerService
} from 'ngx-spinner';
import {
  ToastrService
} from 'ngx-toastr';
import {
  NgbActiveModal,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap'
import {
  CookieService
} from 'ngx-cookie';
@Component({
  selector: 'app-add-to-wallet',
  templateUrl: './add-to-wallet.component.html',
  styleUrls: ['./add-to-wallet.component.scss']
})
export class AddToWalletComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Input() public dataList;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
 
  loginUser: any
  cardDetail: any
  newCard
  frm: FormGroup;
  cardCharges = 0
  fanDetail

  constructor(private _cookieservice: CookieService, private spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private stripeService: StripeService, private toastr: ToastrService, private commonService: CommonService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginUser = this._cookieservice.get("user-starsin");
    if (this.loginUser) {
      this.loginUser = JSON.parse(this.loginUser);
    }
    let apiPath = `user/get-profile`;
    this.commonService.get(apiPath).subscribe(result => {
      this.fanDetail = result.data;
    })
    this.spinner.show();
      this.frm = this.fb.group({ // Signup form
        amount: ['',[Validators.required]],
        card: [''],
        newCard: ['']
      })
    this.getUserCardInfo()
  }

  getUserCardInfo() {
    this.loginUser
    let path = 'user/getStripeCards'
    this.commonService.get(path).subscribe(res => {
      if (res.status == 200) {
        this.cardDetail = res.data
        if (!(this.cardDetail instanceof Array)) {
          this.cardDetail = []
          // this.newCard = true
         // this.frm.controls["newCard"].setValue('checked')
        }
        this.spinner.hide();
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  newCardClick() {
    this.newCard = true
    this.frm.controls['card'].reset();
  }

  existingCardClick() {
    this.newCard = false
    this.frm.controls['newCard'].reset();
  }

  makePayment() : void{
    this.cardCharges = this.frm.value.amount;
    let cardId = this.frm.controls['card'].value
    let path = 'user/createPayment'
    let body = {
      totalAmount: this.cardCharges,
      cardId: cardId,
      type: "Wallet"
    }
    this.commonService.post(path, body).subscribe(res => {
      if (res.status == 200) {
        this.toastr.success(res.message);
        this.spinner.hide();
        this.activeModal.close()
        return res.data
      } else {
        this.toastr.error(res.message);
        this.spinner.hide();
        this.activeModal.close()
        return res.data
      }
    })
  }

  makeNewCardPayment(): void {
    this.cardCharges = this.frm.value.amount;
    let name = ""
    if (this.fanDetail.fname_en) {
      name = this.fanDetail.fname_en
    } 

    this.stripeService.createToken(this.card.element, {
      name
    }).subscribe(async (result) => {
      if (result.token) {
        let path = 'user/createPayment'
        let body = {
          totalAmount: this.cardCharges,
          source: result.token.id,
          type: "Wallet"
        }
        await this.commonService.post(path, body).subscribe(res => {
          if (res.status == 200) {
            this.toastr.success(res.message);
            this.spinner.hide();
            this.activeModal.close()
            return res.data
          } else {
            this.toastr.error(res.message);
            this.spinner.hide();
            this.activeModal.close()
            return res.data
          }
        })
      } else if (result.error) {
        // Error creating the token
        console.log(result.error.message);
        return true
      }
    });
  }

  save(){
    this.spinner.show();
    if (this.newCard) {
      let payment = this.makeNewCardPayment()
    } else {
      let payment = this.makePayment()
    }
  }
}


