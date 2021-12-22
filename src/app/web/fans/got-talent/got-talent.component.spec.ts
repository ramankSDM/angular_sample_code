import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GotTalentComponent } from './got-talent.component';

describe('GotTalentComponent', () => {
  let component: GotTalentComponent;
  let fixture: ComponentFixture<GotTalentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GotTalentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GotTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
