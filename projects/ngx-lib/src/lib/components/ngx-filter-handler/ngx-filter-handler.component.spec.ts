import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFilterHandlerComponent } from './ngx-filter-handler.component';

describe('NgxFilterHandlerComponent', () => {
  let component: NgxFilterHandlerComponent;
  let fixture: ComponentFixture<NgxFilterHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxFilterHandlerComponent]
    });
    fixture = TestBed.createComponent(NgxFilterHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
