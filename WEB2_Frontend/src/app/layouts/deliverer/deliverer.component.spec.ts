import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelivererComponent } from './deliverer.component';

describe('DelivererComponent', () => {
  let component: DelivererComponent;
  let fixture: ComponentFixture<DelivererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelivererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelivererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
