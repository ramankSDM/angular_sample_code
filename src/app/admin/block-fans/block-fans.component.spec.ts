import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockFansComponent } from './block-fans.component';

describe('BlockFansComponent', () => {
  let component: BlockFansComponent;
  let fixture: ComponentFixture<BlockFansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockFansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockFansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
