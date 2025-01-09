import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ElementControleComponent } from "./element-controle.component";

describe("ElementControleComponent", () => {
  let component: ElementControleComponent;
  let fixture: ComponentFixture<ElementControleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElementControleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
