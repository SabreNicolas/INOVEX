import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListReactifsComponent } from "./list-reactifs.component";

describe("ListReactifsComponent", () => {
  let component: ListReactifsComponent;
  let fixture: ComponentFixture<ListReactifsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListReactifsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReactifsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
