import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCelebritiesComponent } from './list-celebrities.component';

describe('ListCelebritiesComponent', () => {
  let component: ListCelebritiesComponent;
  let fixture: ComponentFixture<ListCelebritiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCelebritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCelebritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
