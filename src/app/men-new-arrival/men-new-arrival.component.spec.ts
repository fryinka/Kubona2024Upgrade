import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenNewArrivalComponent } from './men-new-arrival.component';

describe('MenNewArrivalComponent', () => {
  let component: MenNewArrivalComponent;
  let fixture: ComponentFixture<MenNewArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenNewArrivalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenNewArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
