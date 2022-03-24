import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeModel } from './employee-dashboard.model';
import { ApiService } from '../shared/api.service';


@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue! : FormGroup;
  employeeModelObj : EmployeeModel = new EmployeeModel();

  employeeData : any;
  showAdd!: boolean;
  showUpdate! : boolean;
  constructor(private formbuilder: FormBuilder, private api : ApiService) { }

  ngOnInit(): void {

    this.formValue = this.formbuilder.group({
      firstName: ['', Validators.required, Validators.minLength(1),
      Validators.maxLength(250)], 
      lastName: ['', Validators.required, Validators.minLength(1),
      Validators.maxLength(250)],
      email : ['', Validators.required,
      Validators.minLength(1),
      Validators.maxLength(250),
],
      mobile: [''],
      salary: ['']
    });

    this.getAllEmployee()
  }

  clickAddEmployee(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
  postEmployeeDetails(){
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;


    this.api.postEmployee(this.employeeModelObj).subscribe(res => {

      alert("Employee added successfully")
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee()
    },
    err =>{
      alert("Something went wrong")
    });
  }

  getAllEmployee(){
    this.api.getEmployee().subscribe(res=>{
      this.employeeData = res;
    })
  }

  deleteEmployee(item:any){
    this.api.deleteEmployee(item.id).subscribe(res =>{
      alert("Employee Deleted")
      this.getAllEmployee()
    })
  }

  onEdit(item:any){
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeModelObj.id = item.id;
    this.formValue.controls['firstName'].setValue(item.firstName);
    this.formValue.controls['lastName'].setValue(item.lastName);
    this.formValue.controls['email'].setValue(item.email);
    this.formValue.controls['mobile'].setValue(item.mobile);
    this.formValue.controls['salary'].setValue(item.salary);
  }

  updateEmployeeDetails(){
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;

    this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id).subscribe(res =>{
      alert("Employee details updated successfully");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee()
    })
  }
}
