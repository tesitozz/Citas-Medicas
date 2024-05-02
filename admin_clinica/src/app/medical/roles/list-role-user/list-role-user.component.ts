import { Component, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/shared/data/data.service';
import { apiResultFormat, doctorlist, pageSelection } from 'src/app/shared/models/models';
import { RolesService } from '../service/roles.service';
// import { routes } from 'src/app/shared/routes/routes';


declare var $: any;

@Component({
  selector: 'app-list-role-user',
  templateUrl: './list-role-user.component.html',
  styleUrls: ['./list-role-user.component.scss']
})
export class ListRoleUserComponent {
  public rolesList: any = [];
  dataSource!: MatTableDataSource<any>;


  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;
  public role_generals: any = [];
  public role_selected: any;

  constructor(
    public RoleService: RolesService,
  ) {

  }
  ngOnInit() {
    this.getTableData();
  }
  private getTableData(): void {
    this.rolesList = [];
    this.serialNumberArray = [];

    this.RoleService.listRoles().subscribe((resp: any) => {

      console.log(resp);


      this.totalData = resp.roles.length;
      this.role_generals = resp.roles;
      this.getTableDataGeneral();


    })


  }

  getTableDataGeneral() {
    this.rolesList = [];
    this.serialNumberArray = [];
    this.role_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {

        this.rolesList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.rolesList);
    this.calculateTotalPages(this.totalData, this.pageSize);

  }

  deleteRol() {
    this.RoleService.deleteRoles(this.role_selected.id).subscribe((resp: any) => {
      console.log(resp);
      let INDEX = this.rolesList.findIndex((item: any) => item.id == this.role_selected.id);
      if (INDEX != -1) {
        this.rolesList.splice(INDEX, 1);

        $('#delete_patient').hide();
        $("#delete_patient").removeClass("show");
        $(".modal-backdrop").remove();
        $("body").removeClass();
        $("body").removeAttr("style");

        this.role_selected = null;


      }
    })
  }


  selectRole(rol: any) {
    this.role_selected = rol;

  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.rolesList = this.dataSource.filteredData;
  }

  public sortData(sort: any) {
    const data = this.rolesList.slice();

    if (!sort.active || sort.direction === '') {
      this.rolesList = data;
    } else {
      this.rolesList = data.sort((a: any, b: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableDataGeneral();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.searchDataValue = '';
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    // Inicializa un arreglo vacío para almacenar los números de página
    this.pageNumberArray = [];
    // Calcula el número total de páginas dividiendo la cantidad total de datos entre el tamaño de la página
    this.totalPages = totalData / pageSize;
    // Verifica si el número total de páginas no es un número entero
    if (this.totalPages % 1 != 0) {
      // Si no es un número entero, redondea hacia arriba utilizando Math.trunc y agrega una página adicional
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    // Recorre un bucle para generar las páginas y sus límites
    for (var i = 1; i <= this.totalPages; i++) {
      // Calcula el límite y el salto (skip) para la página actual
      const limit = pageSize * i;
      const skip = limit - pageSize;
      // Agrega el número de página al arreglo pageNumberArray
      this.pageNumberArray.push(i);
      // Agrega un objeto al arreglo pageSelection con el salto (skip) y el límite para la página actual
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }


}
