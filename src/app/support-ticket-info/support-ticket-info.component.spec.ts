import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketInfoComponent } from './support-ticket-info.component';

describe('SupportTicketInfoComponent', () => {
  let component: SupportTicketInfoComponent;
  let fixture: ComponentFixture<SupportTicketInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportTicketInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportTicketInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
