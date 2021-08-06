import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntreeComponent } from './list-entree.component';

describe('ListEntreeComponent', () => {
  let component: ListEntreeComponent;
  let fixture: ComponentFixture<ListEntreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEntreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEntreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
