import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepriseRondeComponent } from './reprise-ronde.component';

describe('RepriseRondeComponent', () => {
  let component: RepriseRondeComponent;
  let fixture: ComponentFixture<RepriseRondeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepriseRondeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepriseRondeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
