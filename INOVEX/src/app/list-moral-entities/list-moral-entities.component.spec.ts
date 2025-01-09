import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListMoralEntitiesComponent } from "./list-moral-entities.component";

describe("ListMoralEntitiesComponent", () => {
  let component: ListMoralEntitiesComponent;
  let fixture: ComponentFixture<ListMoralEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMoralEntitiesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMoralEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
