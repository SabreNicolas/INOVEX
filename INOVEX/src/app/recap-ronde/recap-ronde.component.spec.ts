import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecapRondeComponent } from "./recap-ronde.component";

describe("RecapRondeComponent", () => {
  let component: RecapRondeComponent;
  let fixture: ComponentFixture<RecapRondeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecapRondeComponent],
    });
    fixture = TestBed.createComponent(RecapRondeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
