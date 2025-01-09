import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListConsoComponent } from "./list-conso.component";

describe("ListConsoComponent", () => {
  let component: ListConsoComponent;
  let fixture: ComponentFixture<ListConsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListConsoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
