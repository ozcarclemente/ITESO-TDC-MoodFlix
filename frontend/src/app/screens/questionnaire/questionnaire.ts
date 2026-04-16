import { Component, inject, signal } from '@angular/core'; // <-- Agregamos signal
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Importamos el contrato de datos y el servicio de estado
import { QuestionnaireAnswers } from '../../core/models/questionnaire';
import { QuestionnaireStateService } from '../../core/services/questionnaire-state.service';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.scss',
})
export class Questionnaire {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private stateService = inject(QuestionnaireStateService);

  // Signal para proteger la UI (Evita clics dobles)
  isSubmitting = signal(false);

  moodForm: FormGroup = this.fb.group({
    mood: ['', Validators.required],
    energyLevel: ['', Validators.required],
    timeAvailable: ['', [Validators.required]]
  });

  moodOptions = [
    { label: 'Feliz', value: 'happy' },
    { label: 'Triste', value: 'sad' },
    { label: 'Estresado', value: 'tense' },
    { label: 'Curioso', value: 'curious' },
    { label: 'Aventurero', value: 'excited' }
  ];
  
  energyOptions = [
    { label: 'Baja', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' }
  ];

  timeOptions = [
    { label: 'Menos de 1.5 horas', value: 90 },
    { label: 'Alrededor de 2 horas', value: 120 },
    { label: 'Más de 2.5 horas', value: 150 }
  ];

  get moodControl() { return this.moodForm.get('mood'); }
  get energyControl() { return this.moodForm.get('energyLevel'); }
  get timeControl() { return this.moodForm.get('timeAvailable'); }

  onSubmit() {
    if (this.moodForm.valid) {
      // 1. Bloqueamos el botón inmediatamente
      this.isSubmitting.set(true);

      // 2. Extraemos los datos forzando el tipado estricto 
      const answers = this.moodForm.value as QuestionnaireAnswers;
      
      // 3. Guardamos en el estado global (y sessionStorage)
      this.stateService.saveAnswers(answers);
      console.log('Respuestas guardadas de forma segura:', this.stateService.answers());

      // 4. Simulamos una carga de red de 800ms para probar la UX, luego redirigimos
      setTimeout(() => {
        this.router.navigate(['/recommendations']);
      }, 1000);

    } else {
      this.moodForm.markAllAsTouched();
    }
  }
}