import {
  Component,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ResponseIO } from 'src/app/models/responseIO';
import { JSONTreeTemplate } from '../model/common/json-tree-template';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'sym-json-tree-editor',
  templateUrl: './json-tree-editor.component.html',
  styleUrls: ['./json-tree-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class JSONTreeEditorComponent implements OnInit {
  @Input() jsonString: string;
  @Input() disableInput: boolean;
  @Input() collapseAll: boolean;
  @Input() responseIO: ResponseIO;
  @Input() service: BaseService;

  @Output() inputChanged = new EventEmitter<string>();

  blockCollapse;

  jsonObject: any;
  constructor() {
    this.blockCollapse = false;
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['jsonString'] && changes['jsonString'].currentValue) {
      if (this.jsonString != null && this.jsonString != undefined) {
        this.jsonObject = JSON.parse(this.jsonString);
      }
    }
  }

  afterInputChange(json) {
    let jsonData = {};
    Object.keys(this.jsonObject).forEach((key, i) => {
      for (let i = 0; i < json.length; i++) {
        if (key == json[i].key) {
          jsonData[key] = json[i].value;
          break;
        }
      }
    });
    this.inputChanged.emit(JSON.stringify(jsonData));
  }
}
