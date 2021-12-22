import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRecordsComponent } from './video-records.component';

describe('VideoRecordsComponent', () => {
  let component: VideoRecordsComponent;
  let fixture: ComponentFixture<VideoRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
