import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortantsComponent } from './sortants.component';

describe('SortantsComponent', () => {
  let component: SortantsComponent;
  let fixture: ComponentFixture<SortantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
