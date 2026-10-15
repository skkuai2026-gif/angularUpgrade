import { Component, OnInit, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sym-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TooltipComponent implements OnInit {
  @Input() placement: string;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['placement'] && changes['placement'].currentValue) {
    }
  }
}
