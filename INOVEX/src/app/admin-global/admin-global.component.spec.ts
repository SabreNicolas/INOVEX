import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGlobalComponent } from './admin-global.component';

describe('AdminGlobalComponent', () => {
  let component: AdminGlobalComponent;
  let fixture: ComponentFixture<AdminGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
