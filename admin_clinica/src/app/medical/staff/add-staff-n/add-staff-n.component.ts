import { Component } from '@angular/core';
import { StaffService } from '../service/staff.service';

@Component({
  selector: 'app-add-staff-n',
  templateUrl: './add-staff-n.component.html',
  styleUrls: ['./add-staff-n.component.scss']
})
export class AddStaffNComponent {

  public selectedValue !: string;
  public name: string = '';
  public surname: string = '';
  public mobile: string = '';
  public email: string = '';
  public password: string = '';
  public password_confirmation: string = '';
  public birth_date: string = '';
  public gender: string = '';
  public education: string = '';
  public designation: string = '';
  public address: string = '';

  public roles: any = [];

  public FILE_AVATAR: any;
  public IMAGEN_PREVISUALIZA: any = 'assets/img/user-06.jpg';
  constructor(public staffService: StaffService,) {

  }
  ngOnInit(): void {
    this.staffService.listConfig().subscribe((resp: any) => {
      console.log(resp);
      this.roles = resp.roles;
    })
  }

  save(){
    console.log(this.selectedValue);
    
  }


  loadFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      alert("SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO IMAGEN");
      return;
    }
    this.FILE_AVATAR = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_AVATAR);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
  }


}
