import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, ValidatorFn, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  name: string;
  submission: string;
  servicesData: any;
  selectedOrderIds:any;
  questionForm: FormGroup;
  formLoad: boolean = false
  questions = []
  constructor(private commonService: CommonService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.getServices();
  }

  /*
  Name: getServices
  Description: Get list of all services
  */
  getServices() {
    let apiPath = `service/get-all-service`;
    return new Promise((resolve, reject) => {
      this.commonService.get(apiPath).subscribe(async res => {
        this.questions = res.data;
        this.selectedOrderIds = await this.getUserServices()
        this.questions.forEach((data,i) => {
          data['selected'] = false;
          data['answer'] = 0.00;
          if (this.selectedOrderIds.filter(e => e.service_id === data._id).length > 0) {
            data['selected'] = true;
            data['answer'] = this.selectedOrderIds[i].price?this.selectedOrderIds[i].price:0.00;
          }
         
        });
        this.formCreated()

      },
        (err) => {
          this.commonService.loading(false)
          this.commonService.handleError(err);
        }
      );
    });
  }

  /*
  Name: formCreated
  Description: Service form
  */
  async formCreated() {
    this.questionForm = this.fb.group({
      questions: await this.fb.array(this.questions.map(this.createQuestionControl(this.fb)))
    });
    this.formLoad = true;
  }

  /*
  Name: createQuestionControl
  Description: Create question control
  */
  createQuestionControl(fb: FormBuilder) {
    return (question, index) => {
      const checkbox = question.selected
      const answerbox = question.selected ? [question.answer, [Validators.required]] : ''
      const _id = [question._id, [Validators.required]]
      return fb.group({ _id: _id, question: checkbox, answer: answerbox, questionNumber: index + 1 });
    }
  }

  /*
  Name: changeValidator
  Description: Change the validators
  */
  changeValidator(selected, index) {
    const answerbox = this.questionForm.get('questions.' + index).get('answer')
    const validators = selected ? [Validators.required, Validators.minLength(1)] : null
    answerbox.setValidators(validators);
    answerbox.updateValueAndValidity();
  }

  /*
  Name: selectItemType
  Description: Choose any item
  */
  selectItemType(id, status) {
    const index = this.selectedOrderIds.indexOf(id);
    if (!status && index > -1) {
      this.selectedOrderIds.splice(index, 1);
    } else if (status && index == -1) {
      this.selectedOrderIds.push(id);
    }
  }

  /*
  Name: submit
  Description: Submit to add the service form
  */
  submit(questionForm) {
    let path = 'userService/add';
    this.commonService.post(path, questionForm.value).subscribe(res => {
      if (res.status == 200) {
        this.getServices();        
      } else {
        
      }
    },
      (err) => {
        this.commonService.loading(false)
        this.commonService.handleError(err);
      }
    );
  }

  /*
  Name: getUserServices
  Description: Get list of all user services
  */
  getUserServices() {
    let apiPath = `userService/get-all`;
    return new Promise((resolve, reject) => {
      this.commonService.get(apiPath).subscribe(async res => {
        resolve(res.data)
      },
        (err) => {
          this.commonService.loading(false)
          this.commonService.handleError(err);
        }
      );
    });
  }

}
