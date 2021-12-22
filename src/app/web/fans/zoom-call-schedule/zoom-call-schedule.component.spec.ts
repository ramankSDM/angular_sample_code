import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomCallScheduleComponent } from './zoom-call-schedule.component';

describe('ZoomCallScheduleComponent', () => {
  let component: ZoomCallScheduleComponent;
  let fixture: ComponentFixture<ZoomCallScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomCallScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
