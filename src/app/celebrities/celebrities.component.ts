import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-celebrities',
  templateUrl: './celebrities.component.html',
  styleUrls: ['./celebrities.component.scss']
})
export class CelebritiesComponent implements OnInit {
  collapedSideBar: boolean;
  constructor() { }

  ngOnInit() {
  }
  receiveCollapsed($event) {
    this.collapedSideBar = $event;
}

}