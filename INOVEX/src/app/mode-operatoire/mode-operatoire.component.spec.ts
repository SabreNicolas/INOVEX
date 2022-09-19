import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOperatoireComponent } from './mode-operatoire.component';

describe('ModeOperatoireComponent', () => {
  let component: ModeOperatoireComponent;
  let fixture: ComponentFixture<ModeOperatoireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeOperatoireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeOperatoireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
