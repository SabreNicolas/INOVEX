import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagAffectationComponent } from './tag-affectation.component';

describe('TagAffectationComponent', () => {
  let component: TagAffectationComponent;
  let fixture: ComponentFixture<TagAffectationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagAffectationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagAffectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
