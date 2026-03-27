import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.scss',
})
export class Questionnaire {
  moodForm: FormGroup;

  // Opciones para iterar en el HTML
  moodOptions = ['Feliz', 'Triste', 'Estresado', 'Relajado', 'Aventurero'];
  energyOptions = ['Baja', 'Media', 'Alta'];
  timeOptions = [
    { label: 'Menos de 1.5 horas', value: 90 },
    { label: 'Alrededor de 2 horas', value: 120 },
    { label: 'Más de 2.5 horas', value: 150 }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.moodForm = this.fb.group({
      mood: ['', Validators.required],
      energyLevel: ['', Validators.required],
      timeAvailable: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.moodForm.valid) {
      const answers = this.moodForm.value;
      console.log('Respuestas del cuestionario:', answers);
      
      // Simulamos la redirección a la vista de recomendaciones
      this.router.navigate(['/recommendations']);
    } else {
      console.log('El formulario está incompleto');
    }
  }
}