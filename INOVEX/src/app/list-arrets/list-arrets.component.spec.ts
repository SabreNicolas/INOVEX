import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListArretsComponent } from './list-arrets.component';

describe('ListArretsComponent', () => {
  let component: ListArretsComponent;
  let fixture: ComponentFixture<ListArretsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListArretsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListArretsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
