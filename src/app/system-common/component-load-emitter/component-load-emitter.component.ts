import { AfterViewInit, Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sym-component-load-emitter',
  templateUrl: './component-load-emitter.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ComponentLoadEmitterComponent implements OnInit, AfterViewInit {
  constructor() {}

  @Output() componentLoaded = new EventEmitter<boolean>();

  ngOnInit() {}

  ngAfterViewInit() {
    this.componentLoaded.emit(true);
  }
}
