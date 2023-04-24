import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { createSkillDto } from 'src/app/dto/skill.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createEmployeeSkillDto } from 'src/app/dto/employee-skill.dto';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['../personal-academic-form.component.scss'],
})
export class SkillsFormComponent implements OnInit {
  public newSkill: any;
  public selectedOptions: any[] = [];
  public skills!: any[];
  public form!: FormGroup;

  @Input() employeeId!: string;

  constructor(
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private cdref: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      newSkill: ['', [Validators.required]],
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnInit() {
    this.getSkills();
  }

  public onSelectionChange(event: any) {
    this.selectedOptions = event.value;
  }

  public buildEmployeeSkillPayload(id: string) {
    let employeeSkill = new createEmployeeSkillDto();
    employeeSkill.employee_id = this.employeeId;
    employeeSkill.skill_id = id;
    return employeeSkill;
  }

  public async onSubmitEmployeeSkills() {
    for (const skill of this.selectedOptions) {
      await this.employeeService
        .createEmployeeSkill(this.buildEmployeeSkillPayload(skill.id))
        .subscribe({
          next: () => {
            this.snackBar.open('Success', 'OK', { duration: 5000 });
          },
          error: (data: any) => {
            this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
          },
        });
    }
  }

  public async addSkill() {
    if (this.form.valid) {
      const newSkill = this.form.get('newSkill')?.value.trim();
      const skillExists =
        this.skills.filter(skill => skill.type === newSkill).length > 0;

      if (!skillExists) {
        const skill = new createSkillDto();
        skill.type = newSkill;
        const response: any = await this.employeeService
          .createSkill(skill)
          .toPromise();

        this.skills.push(response);
        this.selectedOptions.push(response);
        this.form.reset();
      }
    }
  }

  public async getSkills() {
    try {
      const response: any = await this.employeeService.getSkills().toPromise();
      this.skills = response;
    } catch (error: any) {
      this.snackBar.open(error.error, 'OK', { duration: 5000 });
    }
  }
}
