import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createEmployeeDto } from 'src/app/dto/employee.dto';
import { AccountType } from 'src/app/enum/account-type.enum';
import { AfpType } from 'src/app/enum/afp-type.enum';
import { Classification } from 'src/app/enum/classification.enum';
import { Sex } from 'src/app/enum/gender.enum';
import { MaritalStatus } from 'src/app/enum/marital-status.enum';
import { CategoryService } from 'src/app/services/category/category.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { EMAIL_REGULAR_EXPRESSION, NAME_REGULAR_EXPRESSION } from 'src/regex';
import { DatePipe } from '@angular/common';
import { GoogleMap } from '@angular/google-maps';
import { createFinantialInformationDto } from 'src/app/dto/finantial-information.dto';
import * as uuid from 'uuid';
import { createAddressDto } from 'src/app/dto/address.dto';
import { createChildDto } from 'src/app/dto/child.dto';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ItemFlatNode, ItemNode, TreeList } from './tree-list.component';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  providers: [TreeList],
})
export class FormsComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  public form!: FormGroup;
  public contactForm!: FormGroup;
  public finaltialInformationForm!: FormGroup;
  public addressForm!: FormGroup;
  public childForm!: FormGroup;

  public genderOptions = Object.values(Sex);
  public classificationOptions = Object.values(Classification);
  public accountOptions = Object.values(AccountType);
  public maritalStatusOptions = Object.values(MaritalStatus);
  public afpOptions = Object.values(AfpType);
  public categories: any;
  public pipe = new DatePipe('en-US');
  public currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
  private employeeId: string = '';
  public center!: google.maps.LatLngLiteral;
  public zoom = 15;

  public markerOptions!: google.maps.MarkerOptions;
  public markerPosition!: google.maps.LatLngLiteral;
  public linkGoogleMaps!: string;
  // @ViewChild(MapInfoWindow) info!: MapInfoWindow;
  public childNumber: Number = 0;
  /////////////////////////////////
  public isAddItem: boolean = false;
  public hasChild!: boolean;

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
  /////////////////////////////////

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private categoryService: CategoryService,
    private _database: TreeList
  ) {
    this.loadCategories();
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

  ngOnInit(): void {
    this.buildForm();
    this.initMap();
  }

  public initMap() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.markerPosition = this.center;
      this.linkGoogleMaps = this.getGoogleMapsLink();
    });

    this.markerOptions = {
      draggable: true,
    };
  }

  public onSubmit() {
    this.employeeService.createEmployee(this.buildEmployeePayload()).subscribe({
      next: (data: any) => {
        this.employeeId = data.id;
        console.log(data);
        this.snackBar.open('Success', 'OK', { duration: 5000 });
        this.onSubmitFinantialInformation();
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  public onSubmitFinantialInformation() {
    console.log(this.buildFinantialInformationPayload());
    this.employeeService
      .createFinantialInformationForEmployee(
        this.buildFinantialInformationPayload()
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Success', 'OK', { duration: 5000 });
          this.onSubmitAddress();
        },
        error: (data: any) => {
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
  }

  public onSubmitAddress() {
    console.log(this.builAddressPayload());
    this.employeeService
      .createAddressForEmployee(this.builAddressPayload())
      .subscribe({
        next: () => {
          this.snackBar.open('Success', 'OK', { duration: 5000 });
          this.onSubmitChildren();
        },
        error: (data: any) => {
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
  }

  public onSubmitChildren() {
    console.log(this.buildChildrenPayload());
    // if (this.hasChild) {
    this.employeeService
      .createChildrenForEmployee(this.buildChildrenPayload())
      .subscribe({
        next: () => {
          this.snackBar.open('Success', 'OK', { duration: 5000 });
          this.form.reset();
          this.finaltialInformationForm.reset();
          this.contactForm.reset();
          this.addressForm.reset();
          this.childForm.reset();
        },
        error: (data: any) => {
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
    // } else {
    //   this.childForm.controls['name'].clearValidators();
    //   this.childForm.controls['gender'].clearValidators();
    //   this.childForm.controls['birthdate'].clearValidators();

    //   this.childForm.updateValueAndValidity();
    // }
  }

  public async loadCategories() {
    await this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGULAR_EXPRESSION),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGULAR_EXPRESSION),
      ]),
      nickname: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]), // TODO: comment // backend
      gender: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]), // TODO: comment // backend
      dni: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      classification: new FormControl('', [Validators.required]),
    });

    this.contactForm = this.formBuilder.group({
      mail: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGULAR_EXPRESSION),
      ]),
      phone: new FormControl('', [Validators.required]), // TODO: suggestion other db --- Table Contact
      emergencyPhone: new FormControl('', [Validators.required]), //TODO:  suggestion other db --- Table Contact
    });

    this.finaltialInformationForm = this.formBuilder.group({
      accountNumber: new FormControl('', [Validators.required]), // TODO: comment --- Table: FinantialInformation
      accountType: new FormControl('', [Validators.required]), // TODO:  comment  --- Table: FinantialInformation
      afpType: new FormControl('', [Validators.required]), // TODO: comment --- Table: FinantialInformation
      afpNumber: new FormControl('', [Validators.required]), // TODO: comment --- Table: FinantialInformation --- NUA/CUA
    });

    this.addressForm = this.formBuilder.group({
      country: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      department: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      city: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      district: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address --- Distrito de lugar de trabajo
      address: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      zone: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      linkGoogleMaps: new FormControl('', []), // TODO: comment  --- Table: Address
    });

    this.childForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]),
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
    newChild.employee_id = this.employeeId;

    return newChild;
  }

  private buildFinantialInformationPayload(): createFinantialInformationDto {
    let newFinantialInformation = new createFinantialInformationDto();
    newFinantialInformation.account_number = parseInt(
      this.finaltialInformationForm.get('accountNumber')?.value
    );
    newFinantialInformation.account_type =
      this.finaltialInformationForm.get('accountType')?.value;
    newFinantialInformation.afp_number = parseInt(
      this.finaltialInformationForm.get('afpNumber')?.value
    );
    newFinantialInformation.afp_type =
      this.finaltialInformationForm.get('afpType')?.value;

    newFinantialInformation.employee_id = this.employeeId;
    return newFinantialInformation;
  }

  private builAddressPayload(): createAddressDto {
    let newAddress = new createAddressDto();
    newAddress.country = this.addressForm.get('country')?.value;
    newAddress.department = this.addressForm.get('department')?.value;
    newAddress.city = this.addressForm.get('city')?.value;
    newAddress.workplace_district = this.addressForm.get('district')?.value;
    newAddress.address = this.addressForm.get('address')?.value;
    newAddress.zone = this.addressForm.get('zone')?.value;
    newAddress.link_google_maps = this.getGoogleMapsLink(); //cambiar [position]

    newAddress.employee_id = this.employeeId;

    return newAddress;
  }

  private buildEmployeePayload(): createEmployeeDto {
    let newEmployee = new createEmployeeDto();
    newEmployee.firstName = this.form.get('firstName')?.value;
    newEmployee.lastName = this.form.get('lastName')?.value;
    newEmployee.recruitmentDate = this.currentDate
      ? this.currentDate
      : '2023-01-08'; // TODO: suggestion --- in backend ...

    newEmployee.category_id = parseInt(this.form.get('category')?.value);
    newEmployee.classification = this.form.get('classification')?.value;

    newEmployee.dni = this.form.get('dni')?.value;
    newEmployee.nickname = this.form.get('nickname')?.value;
    newEmployee.sex = this.form.get('gender')?.value;
    newEmployee.account_id = uuid.v4(); //TODO: EndPoint ...
    newEmployee.marital_status = this.form.get('maritalStatus')?.value;

    //address table -- need refactor in backend employee table
    newEmployee.country_id = 1; // TODO: Volver a pedir country ms
    newEmployee.city = this.addressForm.get('city')?.value;
    newEmployee.workLocation = this.addressForm.get('district')?.value;
    newEmployee.address = this.addressForm.get('address')?.value;

    //contact Table
    newEmployee.email = this.contactForm.get('mail')?.value;
    newEmployee.phone = parseInt(this.contactForm.get('phone')?.value);
    newEmployee.emergencyPhone = parseInt(
      this.contactForm.get('emergencyPhone')?.value
    );

    ///OPCIONAL?
    let birthdate = this.pipe.transform(
      new Date(this.form.get('birthdate')?.value),
      'yyyy-MM-dd'
    );

    newEmployee.birthdate = birthdate ? birthdate : '';
    newEmployee.end_date = this.currentDate ? this.currentDate : '2023-01-08';
    return newEmployee;
  }

  public addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPosition = event.latLng.toJSON();
      this.linkGoogleMaps = this.getGoogleMapsLink();
    }
  }

  public getGoogleMapsLink() {
    return (
      'https://www.google.com/maps/search/?api=1&query=' +
      this.markerPosition.lat +
      ',' +
      this.markerPosition.lng
    );
  }

  // public openMarkerInfo(marker: MapMarker) {
  //   if (this.info) {
  //     this.info.open(marker);
  //   }
  // }

  ///////////////////////////////////
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
  public radioChange(event: MatRadioChange) {
    this.hasChild = event.value;
  }
  ///////////////////////////////////
}
