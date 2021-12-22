import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarSchedulesComponent } from './webinar-schedules.component';

describe('WebinarSchedulesComponent', () => {
  let component: WebinarSchedulesComponent;
  let fixture: ComponentFixture<WebinarSchedulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarSchedulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
