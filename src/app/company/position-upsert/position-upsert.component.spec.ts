import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionUpsertComponent } from './position-upsert.component';

describe('PositionUpsertComponent', () => {
  let component: PositionUpsertComponent;
  let fixture: ComponentFixture<PositionUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
