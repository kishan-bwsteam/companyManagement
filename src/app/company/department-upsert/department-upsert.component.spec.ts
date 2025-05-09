import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentUpsertComponent } from './department-upsert.component';

describe('DepartmentUpsertComponent', () => {
  let component: DepartmentUpsertComponent;
  let fixture: ComponentFixture<DepartmentUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
