import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToPlaceAnOrderComponent } from './how-to-place-an-order.component';

describe('HowToPlaceAnOrderComponent', () => {
  let component: HowToPlaceAnOrderComponent;
  let fixture: ComponentFixture<HowToPlaceAnOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToPlaceAnOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowToPlaceAnOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
