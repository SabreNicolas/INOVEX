import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChoixDepassementsComponent } from "./choix-depassements.component";

describe("ChoixDepassementsComponent", () => {
  let component: ChoixDepassementsComponent;
  let fixture: ComponentFixture<ChoixDepassementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixDepassementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChoixDepassementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
