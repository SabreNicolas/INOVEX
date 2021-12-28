import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PciComponent } from './pci.component';

describe('PciComponent', () => {
  let component: PciComponent;
  let fixture: ComponentFixture<PciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
