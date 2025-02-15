import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenNewArrivalsComponent } from './women-new-arrivals.component';

describe('WomenNewArrivalsComponent', () => {
  let component: WomenNewArrivalsComponent;
  let fixture: ComponentFixture<WomenNewArrivalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WomenNewArrivalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomenNewArrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
