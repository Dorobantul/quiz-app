import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';


import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideAnimations(),
    provideRouter(routes), 
    provideClientHydration(), 
    provideFirebaseApp(() => 
      initializeApp({"projectId":"quiz-restaurant",
                     "appId":"1:253295559184:web:6fe8686a2f4bcc31b68095",
                     "storageBucket":"quiz-restaurant.firebasestorage.app",
                     "apiKey":"AIzaSyBZ4zpc3oKq_PtbAm1KUsCH_DLDlO4SUHc",
                     "authDomain":"quiz-restaurant.firebaseapp.com",
                     "messagingSenderId":"253295559184",
                     "measurementId":"G-94F6GMD63P"})), 
    provideFirestore(() => getFirestore())]
};
