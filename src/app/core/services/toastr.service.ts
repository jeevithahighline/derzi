import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastrService) { }
  

  showSuccess(message:any) {
    //alert(message);
    this.toast.success(message)
  }
  showError(message:any) {
    this.toast.error(message)
  }
  showWarning(message:any) {
    //alert(message);
    this.toast.warning(message)
  }
  showInfo(message:any) {
    this.toast.info(message)
  }

}


