import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ZoneControleComponent } from "./zone-controle.component";

describe("ZoneControleComponent", () => {
  let component: ZoneControleComponent;
  let fixture: ComponentFixture<ZoneControleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZoneControleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
