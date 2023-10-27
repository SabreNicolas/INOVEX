import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondanceSortantsComponent } from './correspondance-sortants.component';

describe('CorrespondanceSortantsComponent', () => {
  let component: CorrespondanceSortantsComponent;
  let fixture: ComponentFixture<CorrespondanceSortantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrespondanceSortantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondanceSortantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
