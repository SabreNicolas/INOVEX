import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTonnageComponent } from './import-tonnage.component';

describe('ImportTonnageComponent', () => {
  let component: ImportTonnageComponent;
  let fixture: ComponentFixture<ImportTonnageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTonnageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTonnageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
