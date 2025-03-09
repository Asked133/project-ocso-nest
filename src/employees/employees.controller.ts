import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe,UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROLES } from 'src/auth/constants/roles.constants';
import { ApiResponse } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';
import { ApiAuth } from 'src/auth/decorators/api.decorator';

@ApiAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Auth(ROLES.MANAGER)
  @ApiResponse({
    example: {
      employeeId: "UUID",
      employeeName: "Diego",
      employeeEmail: "dcgome@gmail.com",
      employeeLastName: "Perez",
      employeePhoneNumber: "2148934209",
      employeePhoto: "URL"
    }as Employee
  })
  @ApiResponse({
    status: 401,
    description: 'Missing valid token',
  })
  @ApiResponse({
    status: 403,
    description: 'Missing role',
  })
  @ApiResponse({
    status: 401,
    description: 'Server error',
  })
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Auth(ROLES.EMPLOYEE, ROLES.MANAGER)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { 
    dest: './src/employees/employees-photos'
  }))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    return "ok"
  }


  @Auth(ROLES.MANAGER)
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Auth(ROLES.MANAGER)
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({version: '4'})) 
    id: string
  ) {
    return this.employeesService.findOne(id);
  }

  @Auth(ROLES.MANAGER)  
  @Get('location/:id')
  findAllLocations(@Param('id')id: string){
    return this.employeesService.findByLocation(+id);
  }

  @Auth(ROLES.EMPLOYEE)
  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Auth(ROLES.MANAGER)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.employeesService.remove(id);
  }
}