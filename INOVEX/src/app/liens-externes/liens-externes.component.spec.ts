import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LiensExternesComponent } from "./liens-externes.component";

describe("LiensExternesComponent", () => {
  let component: LiensExternesComponent;
  let fixture: ComponentFixture<LiensExternesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiensExternesComponent],
    });
    fixture = TestBed.createComponent(LiensExternesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
