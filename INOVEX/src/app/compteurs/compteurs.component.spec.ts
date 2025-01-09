import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CompteursComponent } from "./compteurs.component";

describe("CompteursComponent", () => {
  let component: CompteursComponent;
  let fixture: ComponentFixture<CompteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompteursComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
