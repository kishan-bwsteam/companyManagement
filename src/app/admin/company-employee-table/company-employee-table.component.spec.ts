import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEmployeeTableComponent } from './company-employee-table.component';

describe('CompanyEmployeeTableComponent', () => {
  let component: CompanyEmployeeTableComponent;
  let fixture: ComponentFixture<CompanyEmployeeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyEmployeeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyEmployeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
