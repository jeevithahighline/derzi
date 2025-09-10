import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class FaqComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private _router: Router,private dialog: MatDialog) {}
  
  faqs = [
    {
      id: 1,
      question: 'How do I find my size in different size standards?',
      question_ar: 'كيف أجد مقاسي في معايير المقاسات المختلفة؟',
      answer: 'You can find the size details in the product description under the size chart.',
      answer_ar: 'يمكنك العثور على تفاصيل المقاس في وصف المنتج ضمن جدول المقاسات.',
      isSelected: false
    },
    {
      id: 2,
      question: 'How can I track my order?',
      question_ar: 'كيف يمكنني تتبع طلبي؟',
      answer: 'You can track your order from the "My Orders" section in your account.',
      answer_ar: 'يمكنك تتبع طلبك من قسم "طلباتي" في حسابك.',
      isSelected: false
    },
    {
      id: 3,
      question: 'What payment methods are accepted?',
      question_ar: 'ما هي طرق الدفع المقبولة؟',
      answer: 'We accept credit/debit cards, PayPal, and cash on delivery.',
      answer_ar: 'نقبل بطاقات الائتمان/الخصم، باي بال، والدفع عند الاستلام.',
      isSelected: false
    },
    {
      id: 4,
      question: 'Can I return or exchange a product?',
      question_ar: 'هل يمكنني إرجاع أو استبدال المنتج؟',
      answer: 'Yes, returns and exchanges are allowed within 14 days of delivery.',
      answer_ar: 'نعم، يُسمح بالإرجاع والاستبدال خلال 14 يومًا من التسليم.',
      isSelected: false
    },
    {
      id: 5,
      question: 'Do you offer international shipping?',
      question_ar: 'هل تقدمون الشحن الدولي؟',
      answer: 'Yes, we deliver to most countries worldwide. Shipping costs may vary.',
      answer_ar: 'نعم، نقوم بالتوصيل إلى معظم الدول حول العالم. قد تختلف تكاليف الشحن.',
      isSelected: false
    }
  ];
  

  filteredData() {
    return this.faqs.filter(c =>
      c.question.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editfaq(faq: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addfaq', faq.id]);   
  }



  public deletefaq(index: number): void {
    //console.log('deleteselectedData', this.selectedIds);
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.faqs[index] = result; // 👈 update instead of push
      }
    });
    
  }

  addfaq(){
    this._router.navigate(['/addfaq']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.faqs.forEach(faq => faq.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.faqs.every(faq => faq.isSelected);
  }

}


