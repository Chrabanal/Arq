// src/app/services/date.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  getCurrentDayAndMonth() {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('es-ES', { weekday: 'long' }); // Día de la semana en español
    const month = today.toLocaleDateString('es-ES', { month: 'long' }); // Mes en español
    const dayNumber = today.getDate(); // Número del día

    return { dayOfWeek, month, dayNumber };
  }
}
