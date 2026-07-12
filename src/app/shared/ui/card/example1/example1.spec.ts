import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Example1 } from './example1';

describe('Example1', () => {
  let component: Example1;
  let fixture: ComponentFixture<Example1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Example1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Example1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
