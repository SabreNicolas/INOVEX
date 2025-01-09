import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListSortantsComponent } from "./list-sortants.component";

describe("ListSortantsComponent", () => {
  let component: ListSortantsComponent;
  let fixture: ComponentFixture<ListSortantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSortantsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSortantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
