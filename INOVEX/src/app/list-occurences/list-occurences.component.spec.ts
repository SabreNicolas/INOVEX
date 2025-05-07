import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOccurencesComponent } from './list-occurences.component';

describe('ListOccurencesComponent', () => {
  let component: ListOccurencesComponent;
  let fixture: ComponentFixture<ListOccurencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOccurencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOccurencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
