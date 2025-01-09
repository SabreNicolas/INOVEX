import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecapRondePrecedenteComponent } from "./recap-ronde-precedente.component";

describe("RecapRondePrecedenteComponent", () => {
  let component: RecapRondePrecedenteComponent;
  let fixture: ComponentFixture<RecapRondePrecedenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecapRondePrecedenteComponent],
    });
    fixture = TestBed.createComponent(RecapRondePrecedenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
