import { Pipe, PipeTransform } from '@angular/core';
import { JSONTreeTemplate } from '../model/common/json-tree-template';

@Pipe({
  name: 'apiFilter',
  standalone: false,
})
export class ApiFilterPipe implements PipeTransform {
  transform(list: JSONTreeTemplate[], value: string): JSONTreeTemplate[] | null {
    if (!list) return null;
    if (!value) return list;
    return list.filter(function (item) {
      return JSON.stringify(item.key).toLowerCase().includes(value.toLowerCase(), 0) ? true : false;
    });
  }
}
