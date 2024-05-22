import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLiensExternesComponent } from './list-liens-externes.component';

describe('ListLiensExternesComponent', () => {
  let component: ListLiensExternesComponent;
  let fixture: ComponentFixture<ListLiensExternesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListLiensExternesComponent]
    });
    fixture = TestBed.createComponent(ListLiensExternesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
