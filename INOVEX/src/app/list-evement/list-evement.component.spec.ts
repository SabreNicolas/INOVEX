import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEvementComponent } from './list-evement.component';

describe('ListEvementComponent', () => {
  let component: ListEvementComponent;
  let fixture: ComponentFixture<ListEvementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEvementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
