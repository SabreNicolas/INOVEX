import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SaisieFormulaireComponent } from "./saisie-formulaire.component";

describe("SaisieFormulaireComponent", () => {
  let component: SaisieFormulaireComponent;
  let fixture: ComponentFixture<SaisieFormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaisieFormulaireComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
