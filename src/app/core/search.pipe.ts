import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchTerm: string, properties: string[]): any[] {

    //console.log('Items:', items); // Debugging
    //console.log('Search Term:', searchTerm); // Debugging

    if (!items) return [];
    if (!searchTerm) return items;

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      return properties.some(prop =>
        item[prop] && String(item[prop]).toLowerCase().includes(searchTerm)
      );
    });
  }
}
