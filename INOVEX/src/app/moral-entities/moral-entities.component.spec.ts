import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoralEntitiesComponent } from './moral-entities.component';

describe('MoralEntitiesComponent', () => {
  let component: MoralEntitiesComponent;
  let fixture: ComponentFixture<MoralEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoralEntitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoralEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
