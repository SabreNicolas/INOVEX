import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReportingRondeComponent } from "./reporting-ronde.component";

describe("ReportingRondeComponent", () => {
  let component: ReportingRondeComponent;
  let fixture: ComponentFixture<ReportingRondeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportingRondeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingRondeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
