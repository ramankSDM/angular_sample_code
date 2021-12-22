import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoutoutComponent } from './shoutout.component';

describe('ShoutoutComponent', () => {
  let component: ShoutoutComponent;
  let fixture: ComponentFixture<ShoutoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoutoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoutoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
