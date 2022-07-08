import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDelivererComponent } from './home-deliverer.component';

describe('HomeDelivererComponent', () => {
  let component: HomeDelivererComponent;
  let fixture: ComponentFixture<HomeDelivererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDelivererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDelivererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
