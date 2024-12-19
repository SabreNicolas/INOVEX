import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListModeOperatoireComponent } from "./list-mode-operatoire.component";

describe("ListModeOperatoireComponent", () => {
  let component: ListModeOperatoireComponent;
  let fixture: ComponentFixture<ListModeOperatoireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListModeOperatoireComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListModeOperatoireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
