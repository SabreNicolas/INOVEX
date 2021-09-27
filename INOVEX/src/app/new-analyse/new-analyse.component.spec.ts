import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAnalyseComponent } from './new-analyse.component';

describe('NewAnalyseComponent', () => {
  let component: NewAnalyseComponent;
  let fixture: ComponentFixture<NewAnalyseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAnalyseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
