import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToCheckYourSizeComponent } from './how-to-check-your-size.component';

describe('HowToCheckYourSizeComponent', () => {
  let component: HowToCheckYourSizeComponent;
  let fixture: ComponentFixture<HowToCheckYourSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToCheckYourSizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowToCheckYourSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
