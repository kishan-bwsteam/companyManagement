import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEmployeeUpsertComponent } from './company-employee-upsert.component';

describe('CompanyEmployeeUpsertComponent', () => {
  let component: CompanyEmployeeUpsertComponent;
  let fixture: ComponentFixture<CompanyEmployeeUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyEmployeeUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyEmployeeUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
