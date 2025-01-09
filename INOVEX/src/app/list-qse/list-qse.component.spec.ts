import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListQseComponent } from "./list-qse.component";

describe("ListQseComponent", () => {
  let component: ListQseComponent;
  let fixture: ComponentFixture<ListQseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListQseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListQseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
