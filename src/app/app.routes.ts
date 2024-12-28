import { Routes } from '@angular/router';
import { TestComponent } from './components/test-component/test-component.component'
import { HomeComponent } from './components/home-component/home-component.component'
import {SelectGameTypeComponent} from './components/select-game-type/select-game-type.component'
import { PublicRoomComponent } from './components/public-room/public-room.component';
import { PrivateRoomComponent } from './components/private-room/private-room.component';


export const routes: Routes = [
    {path: 'test-component', component: TestComponent},
    {path: '', component: HomeComponent},
    {path: 'gametype', component: SelectGameTypeComponent},
    {path: 'public/:id', component: PublicRoomComponent},
    {path: 'private/:id', component: PrivateRoomComponent}
];



// Un exemplu de rutare pentru aplicatie  
// import { Routes } from '@angular/router';
// import { ScanQrComponent } from './components/scan-qr/scan-qr.component';
// import { QuizComponent } from './components/quiz/quiz.component';
// import { ResultComponent } from './components/result/result.component';

// export const routes: Routes = [
//   { path: '', component: ScanQrComponent },
//   { path: 'quiz', component: QuizComponent },
//   { path: 'result', component: ResultComponent },
// ];