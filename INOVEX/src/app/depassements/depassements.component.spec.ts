import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DepassementsComponent } from "./depassements.component";

describe("DepassementsComponent", () => {
  let component: DepassementsComponent;
  let fixture: ComponentFixture<DepassementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepassementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepassementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
