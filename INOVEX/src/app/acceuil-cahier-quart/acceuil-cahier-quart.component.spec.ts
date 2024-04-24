import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilCahierQuartComponent } from './acceuil-cahier-quart.component';

describe('AcceuilCahierQuartComponent', () => {
  let component: AcceuilCahierQuartComponent;
  let fixture: ComponentFixture<AcceuilCahierQuartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceuilCahierQuartComponent]
    });
    fixture = TestBed.createComponent(AcceuilCahierQuartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
