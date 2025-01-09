import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListAnomaliesComponent } from "./list-anomalies.component";

describe("ListAnomaliesComponent", () => {
  let component: ListAnomaliesComponent;
  let fixture: ComponentFixture<ListAnomaliesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListAnomaliesComponent],
    });
    fixture = TestBed.createComponent(ListAnomaliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
