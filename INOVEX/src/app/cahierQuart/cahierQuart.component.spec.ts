import { ComponentFixture, TestBed } from "@angular/core/testing";

import { cahierQuart } from "./cahierQuart.component";

describe("EquipeGlobalComponent", () => {
  let component: cahierQuart;
  let fixture: ComponentFixture<cahierQuart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [cahierQuart],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(cahierQuart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
