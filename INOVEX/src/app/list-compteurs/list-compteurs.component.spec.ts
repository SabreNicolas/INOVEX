import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListCompteursComponent } from "./list-compteurs.component";

describe("ListCompteursComponent", () => {
  let component: ListCompteursComponent;
  let fixture: ComponentFixture<ListCompteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCompteursComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
