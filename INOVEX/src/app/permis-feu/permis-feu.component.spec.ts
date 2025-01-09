import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PermisFeuComponent } from "./permis-feu.component";

describe("PermisFeuComponent", () => {
  let component: PermisFeuComponent;
  let fixture: ComponentFixture<PermisFeuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermisFeuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisFeuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
