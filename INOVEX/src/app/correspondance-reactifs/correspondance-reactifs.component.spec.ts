import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondanceReactifsComponent } from './correspondance-reactifs.component';

describe('CorrespondanceReactifsComponent', () => {
  let component: CorrespondanceReactifsComponent;
  let fixture: ComponentFixture<CorrespondanceReactifsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrespondanceReactifsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondanceReactifsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
