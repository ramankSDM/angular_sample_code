import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})

export class TagComponent implements OnInit {
  dataList: any;
  selectedTagList: any;
  extraTagList: any;
  refinedTagList: any;
  tagSlug: any;
  tagList: any;
  totalRecords: any;
  finalList:any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  values1: string[];
  selectedTags: any = [];
  selectedLang: any = 'en';
  langs: any = [];

  selectedDefault = ['Featured'];

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  separatorKeysCodes = [ENTER]; //[ENTER, COMMA]
  tagCtrl = new FormControl();
  filteredTags: Observable<any[]>;
  customTags = [];
  allTags = [];  
 
  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(private spinner: NgxSpinnerService, private _cookieservice: CookieService, private toastr: ToastrService, private commonService: CommonService,private translate: TranslateService, public ds: DataService) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.selectedTagList = [];
    this.refinedTagList = [];
    this.extraTagList = [];
    this.tagList = [];
    this.finalList = [];
    this.tagSlug = '';
   
    let path = `tags/suggest-tags`;
    let options = {
      keyword: ''
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dataList = response.data.data;      
      this.dataList.forEach( (element) => {
        this.allTags.push(element.title_en);        
      });    
    }, err => {
      this.commonService.handleError(err);
    });

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this.filter(fruit) : this.allTags.slice()));    
  }

  ngOnInit(): void {
    this.getTags();
    this.getCelebrityTags();
    

    this.langs = [{ name: 'English', code: 'en' }, { name: 'Arabic', code: 'ar' }];
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en'
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
  Name: add
  Description: Get list of all selected tags
  */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.customTags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.tagCtrl.setValue(null);
  }

  /*
  Name: remove
  Description: Remove tags from chosen tags
  */
  remove(fruit: any): void {
    const index = this.customTags.indexOf(fruit);
    if (index >= 0) {
      this.customTags.splice(index, 1);
    }
  }

  /*
  Name: filter
  Description: Search the tags from list
  */
  filter(name: string) {
    return this.allTags.filter(fruit =>
        fruit.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  /*
  Name: selected
  Description: On select tag from list
  */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.customTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  /*
  Name: getTags
  Description: Get list of all admin tags to show in dropdown
  */
  getTags() {
    this.spinner.show();
    let path = `tags/get-all-admin-tags`;
    let options = {
      page: this.activePage,
      count: this.rowsOnPage
    };
    let finalList = [];
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dataList = response.data.data;                
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
    
  }
  

  /*
  Name: getCelebrityTags
  Description: Get list of already saved tags
  */
  getCelebrityTags() {
    this.spinner.show();
    let path = `usertags/get-all-tags-by-celebrityId`;
    let CFUser = this._cookieservice.get('user-starsin');
    let NewCFUser = JSON.parse(CFUser);
    let userId = NewCFUser._id;

    let options = {
      id: userId,
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      sortBy: this.sortKey,
      sort: this.sortKeyValue,
      status: this.filterParams
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.tagList = response.data.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: filterRecords
  Description: Filter the records based on status and fetch updated records
  */
  filterRecords() {
    if (this.filterStatus == 'activated') {
      this.filterParams = true;
    } else if (this.filterStatus == 'deactivated') {
      this.filterParams = false;
    } else {
      this.filterParams = '';
    }
    this.getCelebrityTags();
  }

  /*
  Name: sortBy
  Description: Sort the results based on key
  */
  sortBy(key) {
    this.sortKey = key;
    if (this.sortKeyValue === 'DESC') {
      this.sortKeyValue = 'ASC';
    } else {
      this.sortKeyValue = 'DESC';
    }
    this.getCelebrityTags();
  }

  /*
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    this.page = event.page;
    this.getCelebrityTags();
  }

  /*
  Name: changeStatus
  Description: Change status to activate or de-activate
  */
  changeStatus(item, event) {
    this.spinner.show();
    let path = `usertags/updateStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Tag ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
      this.getCelebrityTags();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  } 

  /*
  Name: saveTag
  Description: Save chosen tags
  */
  saveTag() {   
    if (this.selectedTags && this.selectedTags.length >= 0) {
      this.selectedTags.forEach((element) => {
        this.selectedTags.push({ name: element.title_en, slug: element.slug });
      });
    }
    if (this.customTags && this.customTags.length >= 0) {
      this.customTags.forEach((element) => {
        this.tagSlug= this.commonService.createSlug(element)
        this.selectedTags.push({ name: element, slug: this.tagSlug });
      })
    }
    
    let CFUser = this._cookieservice.get('user-starsin');
    let NewCFUser = JSON.parse(CFUser);    
    let userId = NewCFUser._id;    
    this.spinner.show();
    let path = `tags/addCelebrityTags`;
    let json = {
      id: userId,
      data: this.selectedTags,
      role:NewCFUser.role
    };
    this.commonService.post(path, json).subscribe(response => {
      this.toastr.success('Tags added successfully');
      this.selectedTags=[];
       this.customTags=[];   
      this.spinner.hide();  
      this.getCelebrityTags();    
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });

  }

  /*
  Name: deleteTag
  Description: Delete tags from listing
  */
  deleteTag(id) {
    this.spinner.show();
    let path = `usertags/delete/` + id;
    this.commonService.delete(path).subscribe(response => {
      this.toastr.success('Tag deleted successfully');
      this.getCelebrityTags();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

}
