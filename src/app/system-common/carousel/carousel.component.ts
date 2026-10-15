import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
declare const sectionContents: any;
declare const initSlickSlider: any;
@Component({
  selector: 'sym-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CarouselComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // setTimeout(() => {
    //   var sliderElement = $('.productCategorySlider');
    //   initSlickSlider(sliderElement);
    // }, 10);
    setTimeout(() => {
      var sliderElement = $('.sliderContainer');
      initSlickSlider(sliderElement);
    }, 15);
  }
}
