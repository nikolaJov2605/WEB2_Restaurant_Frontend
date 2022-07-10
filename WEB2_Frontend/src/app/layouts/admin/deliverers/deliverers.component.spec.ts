import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverersComponent } from './deliverers.component';

describe('DeliverersComponent', () => {
  let component: DeliverersComponent;
  let fixture: ComponentFixture<DeliverersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
