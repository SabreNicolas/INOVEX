import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroupementsComponent } from './list-groupements.component';

describe('ListGroupementsComponent', () => {
  let component: ListGroupementsComponent;
  let fixture: ComponentFixture<ListGroupementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGroupementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGroupementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
