import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieGlobalComponent } from './saisie-global.component';

describe('SaisieGlobalComponent', () => {
  let component: SaisieGlobalComponent;
  let fixture: ComponentFixture<SaisieGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisieGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
