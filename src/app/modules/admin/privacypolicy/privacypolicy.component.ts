import { Component, OnInit } from '@angular/core';
import { PageService } from '../../../core/services/page.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MATERIAL_IMPORTS } from '../../material.import';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line

})
export class PrivacypolicyComponent implements OnInit {
  pageContent: SafeHtml = '';

  constructor(
    private pageService: PageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.pageService.getSpecificPageName('Privacy').subscribe({
      next: (responseData) => {
        console.log('Full responseData:', responseData); // should be { _id, page_name, content, ... }

        const fullHtml = responseData.data.content; // full HTML document
        // Extract only the <body> content
        const bodyContentMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyContent = bodyContentMatch ? bodyContentMatch[1] : fullHtml;

        // Render safely in Angular
        this.pageContent = this.sanitizer.bypassSecurityTrustHtml(bodyContent);
      },
      error: (err) => {
        console.error('Error fetching page:', err);
      }
    });
    
  }
}
