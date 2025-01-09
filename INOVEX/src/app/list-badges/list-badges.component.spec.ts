import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListBadgesComponent } from "./list-badges.component";

describe("ListBadgesComponent", () => {
  let component: ListBadgesComponent;
  let fixture: ComponentFixture<ListBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListBadgesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
