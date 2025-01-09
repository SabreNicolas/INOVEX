import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TokenApiComponent } from "./token-api.component";

describe("TokenApiComponent", () => {
  let component: TokenApiComponent;
  let fixture: ComponentFixture<TokenApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TokenApiComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
