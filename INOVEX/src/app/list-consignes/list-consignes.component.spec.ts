import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConsignesComponent } from './list-consignes.component';

describe('ListConsignesComponent', () => {
  let component: ListConsignesComponent;
  let fixture: ComponentFixture<ListConsignesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConsignesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConsignesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
