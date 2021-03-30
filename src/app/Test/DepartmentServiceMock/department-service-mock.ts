import { of } from 'rxjs';

export class DepartamentoServiceMock {
  departmentUrl = '/get/department/getDepartments';

  constructor() {}

  getDepartamentos(): any {
    return of([
      {
        id: '1',
        nombre: 'Xela',
      },
      { id: '2', nombre: 'Guate' },
    ]);
  }
}
