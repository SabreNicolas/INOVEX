import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListZonesComponent } from "./list-zones.component";

describe("ListZonesComponent", () => {
  let component: ListZonesComponent;
  let fixture: ComponentFixture<ListZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListZonesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
