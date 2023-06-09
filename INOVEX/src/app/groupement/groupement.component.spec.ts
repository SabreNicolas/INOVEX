import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupementComponent } from './groupement.component';

describe('GroupementComponent', () => {
  let component: GroupementComponent;
  let fixture: ComponentFixture<GroupementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
