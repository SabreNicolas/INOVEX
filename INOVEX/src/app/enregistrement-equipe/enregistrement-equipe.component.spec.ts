import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistrementEquipeComponent } from './enregistrement-equipe.component';

describe('EnregistrementEquipeComponent', () => {
  let component: EnregistrementEquipeComponent;
  let fixture: ComponentFixture<EnregistrementEquipeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnregistrementEquipeComponent]
    });
    fixture = TestBed.createComponent(EnregistrementEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
