import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ContentCreation } from '../../shared/services/content-creation';

@Component({
  selector: 'app-url-input',
  imports: [ReactiveFormsModule],
  templateUrl: './url-input.html',
  styleUrl: './url-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UrlInput {
  private readonly contentCreationService = inject(ContentCreation);
  
  protected readonly urlControl = new FormControl('', [
    Validators.required,
    this.youtubeUrlValidator.bind(this)
  ]);
  
  protected readonly isLoading = signal(false);
  protected readonly result = signal<string>('');
  protected readonly hasError = signal(false);
  
  protected readonly isSubmitDisabled = computed(() => 
    this.urlControl.invalid || this.isLoading()
  );

  private youtubeUrlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = this.contentCreationService.validateYouTubeUrl(control.value);
    return isValid ? null : { invalidYouTubeUrl: true };
  }

  protected onSubmit(): void {
    if (this.urlControl.valid && this.urlControl.value) {
      this.isLoading.set(true);
      this.hasError.set(false);
      this.result.set('');

      this.contentCreationService.postYouTubeToInstagram(this.urlControl.value)
        .subscribe({
          next: (response) => {
            this.isLoading.set(false);
            if (response.success) {
              this.result.set(`Success! ${response.message}`);
              this.urlControl.reset();
            } else {
              this.hasError.set(true);
              this.result.set(`Error: ${response.message}`);
            }
          },
          error: (error) => {
            this.isLoading.set(false);
            this.hasError.set(true);
            this.result.set('Failed to process the request. Please try again.');
            console.error('Content creation error:', error);
          }
        });
    }
  }
}
