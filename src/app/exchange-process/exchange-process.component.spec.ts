import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnExchangeProcessComponent } from './exchange-process.component';

describe('ReturnExchangeProcessComponent', () => {
  let component: ReturnExchangeProcessComponent;
  let fixture: ComponentFixture<ReturnExchangeProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnExchangeProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnExchangeProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
