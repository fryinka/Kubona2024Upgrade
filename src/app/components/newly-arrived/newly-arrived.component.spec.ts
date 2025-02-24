import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlyArrivedComponent } from './newly-arrived.component';

describe('NewlyArrivedComponent', () => {
  let component: NewlyArrivedComponent;
  let fixture: ComponentFixture<NewlyArrivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewlyArrivedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewlyArrivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
