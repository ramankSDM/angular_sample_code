import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestVideosComponent } from './latest-videos.component';

describe('LatestVideosComponent', () => {
  let component: LatestVideosComponent;
  let fixture: ComponentFixture<LatestVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
