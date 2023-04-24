import { FlatTreeControl } from '@angular/cdk/tree';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from '@angular/material/tree';
import { createChildDto } from 'src/app/dto/child.dto';
import { Sex } from 'src/app/enum/gender.enum';
import { TreeList, ItemFlatNode, ItemNode } from '../tree-list.component';
import { NAME_REGULAR_EXPRESSION } from 'src/regex';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['../personal-information-form.component.scss'],
  providers: [TreeList],
})
export class ChildFormComponent implements OnInit {
  public form!: FormGroup;
  public genderOptions = Object.values(Sex);

  public pipe = new DatePipe('en-US');
  public currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
  public maxDate = new Date();

  public isAddItem: boolean = false;
  public hasChild: boolean = false;
  public buttonSaveWasClicked: boolean = false;

  flatNodeMap = new Map<ItemFlatNode, ItemNode>(); //help to find the nested node to be modified
  nestedNodeMap = new Map<ItemNode, ItemFlatNode>(); // keep the same object for selection

  treeControl: FlatTreeControl<ItemFlatNode>;
  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;

  getLevel = (node: ItemFlatNode) => node.level;

  isExpandable = (node: ItemFlatNode) => node.expandable;

  getChildren = (node: ItemNode): ItemNode[] => node.children;

  hasNodeChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.level === 0;

  hasEditChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.level === 1;

  hasNoContent = (_: number, _nodeData: ItemFlatNode) =>
    _nodeData.data.name === '';

  public transformer = (node: ItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.data === node.data
        ? existingNode
        : new ItemFlatNode();
    flatNode.data = node.data;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  constructor(private formBuilder: FormBuilder, private _database: TreeList) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<ItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }
  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGULAR_EXPRESSION),
      ]),
      gender: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]),
    });
  }

  public buildChildrenPayload(): createChildDto {
    let newChild = new createChildDto();

    if (this.hasChild) {
      newChild.name = this.form.get('name')?.value;
      newChild.sex = this.form.get('gender')?.value.toString();
      let birthdate = this.form.get('birthdate')?.value
        ? this.pipe.transform(
            new Date(this.form.get('birthdate')?.value),
            'yyyy-MM-dd'
          )
        : '';

      newChild.birthdate = birthdate ? birthdate : '';
    } else {
      this.form.controls['name'].clearValidators();
      this.form.controls['gender'].clearValidators();
      this.form.controls['birthdate'].clearValidators();
      this.form.controls['name'].updateValueAndValidity();
      this.form.controls['gender'].updateValueAndValidity();
      this.form.controls['birthdate'].updateValueAndValidity();
    }
    return newChild;
  }

  public getChildrenDatabase() {
    return this._database.dataChange.getValue();
  }

  public getIfHasChild() {
    return this.hasChild;
  }

  public checkIfButonSaveData() {
    return this.isAddItem;
  }

  public addNewItem(node: ItemFlatNode) {
    this.buildForm();
    this.isAddItem = true;
    this.buttonSaveWasClicked = false;

    this.treeControl.expand(node);

    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, this.buildChildrenPayload());
  }

  public saveNode(node: ItemFlatNode) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, this.buildChildrenPayload());
    this.isAddItem = false;
  }

  public updateNode(node: ItemFlatNode) {
    this.isAddItem = true;
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItemData(nestedNode!, this.buildChildrenPayload());
  }

  public deleteNode(node: ItemFlatNode) {
    this._database.removeItem(node.data);
  }
  public radioChange(event: MatRadioChange) {
    this.hasChild = event.value;
    if (!this.hasChild) {
      this.form.reset();
    }
  }
}
