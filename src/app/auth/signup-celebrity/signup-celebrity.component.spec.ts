import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupCelebrityComponent } from './signup-celebrity.component';

describe('SignupCelebrityComponent', () => {
  let component: SignupCelebrityComponent;
  let fixture: ComponentFixture<SignupCelebrityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupCelebrityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupCelebrityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
