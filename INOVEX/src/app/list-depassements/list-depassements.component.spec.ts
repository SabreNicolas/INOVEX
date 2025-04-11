import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListDepassementsComponent } from "./list-depassements.component";

describe("ListDepassementsComponent", () => {
  let component: ListDepassementsComponent;
  let fixture: ComponentFixture<ListDepassementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDepassementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListDepassementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
