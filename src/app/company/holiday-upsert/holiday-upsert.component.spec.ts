import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayUpsertComponent } from './holiday-upsert.component';

describe('HolidayUpsertComponent', () => {
  let component: HolidayUpsertComponent;
  let fixture: ComponentFixture<HolidayUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidayUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
