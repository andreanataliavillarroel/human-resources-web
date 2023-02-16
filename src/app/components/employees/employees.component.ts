import { FlatTreeControl } from '@angular/cdk/tree';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { createChildDto } from 'src/app/dto/child.dto';
import { Sex } from 'src/app/enum/gender.enum';
import { ItemFlatNode, ItemNode, TreeList } from './tree-list.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [TreeList],
})
export class EmployeesComponent implements OnInit {
  public genderOptions = Object.values(Sex);
  public childForm!: FormGroup;

  public isAddItem: boolean = false;

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

  public pipe = new DatePipe('en-US');

  ngOnInit() {}

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

  constructor(private _database: TreeList, private formBuilder: FormBuilder) {
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

  public buildForm() {
    this.childForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]),

      // hasChild: new FormControl('', [Validators.required]), // boolean
    });
  }
  private buildChildrenPayload(): createChildDto {
    let newChild = new createChildDto();
    newChild.name = this.childForm.get('name')?.value;
    newChild.sex = this.childForm.get('gender')?.value.toString();
    let birthdate = this.childForm.get('birthdate')?.value
      ? this.pipe.transform(
          new Date(this.childForm.get('birthdate')?.value),
          'yyyy-MM-dd'
        )
      : '';

    newChild.birthdate = birthdate ? birthdate : '';
    newChild.employee_id = '';

    return newChild;
  }

  public addNewItem(node: ItemFlatNode) {
    this.buildForm();
    this.isAddItem = true;

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
}
