import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GestionBadgeComponent } from "./gestion-badge.component";

describe("GestionBadgeComponent", () => {
  let component: GestionBadgeComponent;
  let fixture: ComponentFixture<GestionBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
