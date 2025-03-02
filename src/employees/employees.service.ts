import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {v4 as uuid} from "uuid";

@Injectable()
export class EmployeesService {
  private employees: CreateEmployeeDto[] = [
  {
    id: uuid(),
    name: 'Diego',
    lastname: 'Gomez',
    phoneNumber:'5540734206'
  },
  {
    id: uuid(),
    name: 'Andres',
    lastname: 'Barroso',
    phoneNumber:'5540223534'
  }
]
  create(createEmployeeDto: CreateEmployeeDto) {
    createEmployeeDto.id = uuid()
    this.employees.push(createEmployeeDto);
    return CreateEmployeeDto;
  }

  findAll() {
    return this.employees;
  }

  
  findOne(id: string) {
    const employee = this.employees.filter((employee) => employee.id === id) [0];
    if(!employee) throw new NotFoundException();
    return employee;
  }


  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    let employeeToUpdate = this.findOne(id)
    employeeToUpdate = {
      ...employeeToUpdate,
      ...updateEmployeeDto,
    }
    this.employees = this.employees.map((employee) => {
      if (employee.id === id) {
        employee = employeeToUpdate
      }
      return employee
    })
    return employeeToUpdate;
  }

  remove(id: string) {
    this.findOne(id)
    this.employees = this.employees.filter((employee) => employee.id !== id);
    return this.employees;
  }
}