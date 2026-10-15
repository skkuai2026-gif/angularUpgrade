import {
  Component,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { JSONTreeTemplate } from '../model/common/json-tree-template';
import { ResponseIO } from './../../models/responseIO';
import { BaseService } from 'src/app/system-common/services/base.service';

@Component({
  selector: 'sym-json-tree-editor-item',
  templateUrl: './json-tree-editor-item.component.html',
  styleUrls: ['./json-tree-editor-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class JSONTreeEditorItemComponent implements OnInit {
  @Input() jsonObject: any;
  @Input() key: string;
  @Input() isInitialLoop: boolean;
  @Input() disableInput: boolean;
  @Input() collapseAll: boolean;
  @Input() responseIO: ResponseIO;
  @Input() service: BaseService;

  @Output() updatedJson = new EventEmitter<any>();
  jsonObjectList: JSONTreeTemplate[];
  guid: string;
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['jsonObject'] && changes['jsonObject']) {
      if (this.jsonObject != null && this.jsonObject != undefined) {
        this.jsonObjectList = [];
        // this.jsonObject = JSON.parse(this.jsonObject);
        Object.keys(this.jsonObject).forEach((key) => {
          let json = new JSONTreeTemplate();
          json.key = key;
          json.value = this.jsonObject[key];
          json.isBlockCollapsed = this.isInitialLoop && !this.collapseAll ? false : true;
          json.isChildAvailable =
            typeof this.jsonObject[key] === 'object' && this.jsonObject[key] !== null ? true : false;

          if (
            isNaN(json.key) &&
            json.isChildAvailable &&
            this.jsonObject[key] != undefined &&
            this.jsonObject[key] != null &&
            this.jsonObject[key].length != undefined
          ) {
            json.addBracket = true;
          } else {
            json.addBracket = false;
          }

          if (key === 'guid') {
            this.guid = json.value;
          }
          if (
            this.guid != undefined &&
            this.responseIO.metadata != undefined &&
            this.responseIO.metadata[this.guid] != undefined
          ) {
            json.metadata = this.responseIO.metadata[this.guid][key];
            if (json.metadata != undefined) {
              json.metadataKeyList = [];
              Object.keys(json.metadata).forEach((key) => {
                json.metadataKeyList.push(key);
              });
            }
          }
          this.jsonObjectList.push(json);
        });
      }
      // console.log(this.jsonObjectList);
    }

    if (
      (changes['isInitialLoop'] && changes['isInitialLoopitem']) ||
      (changes['collapseAll'] && changes['collapseAll'].currentValue)
    ) {
      this.jsonObjectList.filter((obj) => {
        obj.isBlockCollapsed = true;
      });
    }
    if (changes['collapseAll'] && changes['collapseAll'].currentValue) {
    }
    if (changes['key'] && changes['key'].currentValue) {
    }
  }
  onInputChange(json) {
    json.value = json.value == '' ? null : json.value.trim();
    if (this.isInitialLoop) {
      this.afterInputChange(json);
    } else {
      this.updatedJson.emit(json);
    }
  }

  afterInputChange(json: JSONTreeTemplate) {
    this.jsonObjectList.filter((item) => {
      if (item.isChildAvailable) {
        Object.keys(item.value).forEach((key) => {
          if (key == json.key) {
            item.value[key] = json.value;
          }
        });
      }
    });

    this.updatedJson.emit(this.jsonObjectList);
  }
}
