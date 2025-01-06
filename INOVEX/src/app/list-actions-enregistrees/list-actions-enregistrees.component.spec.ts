import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListActionsEnregistreesComponent } from "./list-actions-enregistrees.component";

describe("ListActionsEnregistreesComponent", () => {
  let component: ListActionsEnregistreesComponent;
  let fixture: ComponentFixture<ListActionsEnregistreesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListActionsEnregistreesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListActionsEnregistreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
