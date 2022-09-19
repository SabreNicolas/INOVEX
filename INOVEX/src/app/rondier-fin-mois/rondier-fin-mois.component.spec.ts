import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RondierFinMoisComponent } from './rondier-fin-mois.component';

describe('RondierFinMoisComponent', () => {
  let component: RondierFinMoisComponent;
  let fixture: ComponentFixture<RondierFinMoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RondierFinMoisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RondierFinMoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
