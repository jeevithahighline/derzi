import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-faqform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './faqform.component.html',
  styleUrl: './faqform.component.scss'
})
export class FaqformComponent {
  faqform: FormGroup;
  editMode = false;   // ✅ track add/edit
  faqId: number | null = null;

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute) {}

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
  

  ngOnInit(): void {
    
    this.faqform = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]],
      question_ar: ['', [Validators.required, Validators.minLength(3)]],   
      answer: ['', [Validators.required, Validators.maxLength(250)]],
      answer_ar: ['', [Validators.required, Validators.maxLength(250)]]    
    });

    // ✅ get id from route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.faqId = +id;
        this.loadFaqData(this.faqId);
      }
    });
   
  }

  loadFaqData(id: number){
    const service = this.faqs.find(b => b.id === id);
    if (service) {
      this.faqform.patchValue(service);
    }
  }

 

  onSubmit() {
    if (this.faqform.valid) {
      console.log('✅ Form Data:', this.faqform.value);
    } else {
      this.faqform.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.faqform.controls;
  }

  saveFaq(){

    if (this.faqform.invalid) {
      this.faqform.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.faqform.value); // ✅ form values when valid
    this._router.navigate(['/faq']);
  }

  onCancel() {
    this.faqform.reset({ status: 'Active' });
    this._router.navigate(['/faq']);
  }  
}

