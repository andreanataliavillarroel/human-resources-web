import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { createChildDto } from 'src/app/dto/child.dto';
import { Sex } from 'src/app/enum/gender.enum';

export class ItemNode {
  children!: ItemNode[];
  data!: createChildDto;
  name!: string;
}

export class ItemFlatNode {
  data!: createChildDto;
  level!: number;
  expandable!: boolean;

  constructor(level: number = 0) {
    this.level = level;
  }
}

let child = new createChildDto();
child.name = 'Andrea';
child.birthdate = new Date().toString();
child.sex = Sex.FEMALE;

const Children_Data = { Hijos: [] };

@Injectable()
export class TreeList {
  dataChange = new BehaviorSubject<ItemNode[]>([]);

  get data(): ItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    const data = this.buildFileTree(Children_Data, 0);
    this.dataChange.next(data);
  }

  buildFileTree(obj: any, level: number): ItemNode[] {
    return Object.keys(obj).reduce<ItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new ItemNode();
      node.name = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.data = value;
          node.children = [];
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  public insertItem(parent: ItemNode, item: any) {
    parent.children.push({
      data: item,
      name: parent.children.length.toString(),
      children: [],
    } as ItemNode);
    this.dataChange.next(this.data);
  }

  public updateItem(node: ItemNode, item: any) {
    node.data = item;
    this.dataChange.next(this.data);
  }

  public updateItemData(node: ItemNode, item: any) {
    let childData = node.data;
    let list = this.dataChange.getValue();

    list.forEach(itemData => {
      itemData.children.forEach(child => {
        if (
          child.data.name === childData.name &&
          child.data.sex === childData.sex &&
          child.data.birthdate === childData.birthdate &&
          child.data.employee_id === childData.employee_id
        ) {
          console.log(child);
        }
      });
      // this.insertItem(itemData, item);
    });
    this.dataChange.next(list);
  }

  public removeItem(item: any) {
    let list = this.dataChange.getValue();

    list.forEach(itemData => {
      itemData.children.forEach((child, index) => {
        if (child.data === item) {
          itemData.children.splice(index, 1);
        }
      });
    });
    this.dataChange.next(list);
  }
}
