import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListActusComponent } from "./list-actus.component";

describe("ListActusComponent", () => {
  let component: ListActusComponent;
  let fixture: ComponentFixture<ListActusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListActusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListActusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
