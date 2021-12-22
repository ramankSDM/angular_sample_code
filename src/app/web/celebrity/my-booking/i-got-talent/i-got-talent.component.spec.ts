import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IGotTalentComponent } from './i-got-talent.component';

describe('IGotTalentComponent', () => {
  let component: IGotTalentComponent;
  let fixture: ComponentFixture<IGotTalentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IGotTalentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IGotTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
