import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapRondeListeComponent } from './recap-ronde-liste.component';

describe('RecapRondeListeComponent', () => {
  let component: RecapRondeListeComponent;
  let fixture: ComponentFixture<RecapRondeListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecapRondeListeComponent]
    });
    fixture = TestBed.createComponent(RecapRondeListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
