import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListFormulairesComponent } from "./list-formulaires.component";

describe("ListFormulairesComponent", () => {
  let component: ListFormulairesComponent;
  let fixture: ComponentFixture<ListFormulairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListFormulairesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFormulairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
