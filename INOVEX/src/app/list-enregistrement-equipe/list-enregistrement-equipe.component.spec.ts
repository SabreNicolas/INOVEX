import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEnregistrementEquipeComponent } from './list-enregistrement-equipe.component';

describe('ListEnregistrementEquipeComponent', () => {
  let component: ListEnregistrementEquipeComponent;
  let fixture: ComponentFixture<ListEnregistrementEquipeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListEnregistrementEquipeComponent]
    });
    fixture = TestBed.createComponent(ListEnregistrementEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
