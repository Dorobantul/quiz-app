import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserSession } from '../../models/global-user-model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { Session } from '../../models/session';
import { SessionPlayersService } from '../../services/session-players.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordDialogComponent } from '../password-popup-component/password-popup-component.component';


@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css'
})


export class HomeComponent implements OnInit {
  globalUserNickName: string = '';
  activeSessions: any[] = [];
  showActiveSessions: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private firestore: Firestore, private sessiosService: SessionService, private sessionPlayersService: SessionPlayersService, private dialog: MatDialog) { }
  async ngOnInit() {
    // Obține datele din URL (codul QR conține aceste informații ca query params)
    // this.route.queryParams.subscribe((params) => {
    //   const restaurantId = params['restaurantId'];
    //   const restaurantName = params['restaurantName'];
    //   const tableId = params['tableId'];

    //   UserSession.initialize(restaurantId, restaurantName, tableId);
    //   console.log('User Session:', UserSession); // Pentru debugging
    // });

    var tempRestaurant = {
      restaurantId: 'testRestaurantId',
      restaurantName: 'testRestaurantName',
      tableId: 1
    }

    var tempUserGuid = '545dd39a-4a56-48d1-bb83-ac8f02e8f256';

    UserSession.tempInitialize();

    console.log(UserSession);
  }

  async prroceedEnterToGameSession() {
    //1. Da load la toate sesiunile de joc care NU sunt ale userului si care sunt din restaurantul respectiv
    this.activeSessions = await this.sessiosService.getCurrentRestaurantSessions(UserSession.userId, UserSession.restaurantId);

    debugger;
    //2. Arata listele de sesiuni active
    this.showActiveSessions = true;
  }

  proceedGameCreation() {

    //Asta ar trebui inlocuita cu un togle sau cu un mesaj, NU o alerta
    if (!this.globalUserNickName.trim()) {
      alert('Te rog să introduci un nickname!');
      return;
    }


    UserSession.setNickName(this.globalUserNickName);
    console.log('Nickname set:', UserSession);
    this.router.navigate(['/gametype']);
  }


  // async joinSession(session: Session) {
  //   if(!session.isPublic){
  //     //1. Verifica parola. Fa un popup care sa apara pentru introducerea parolei

  //     //2. Adauga juctorul in sesiunea de joc

  //     //3. Navigheaza la sesiune
  //     this.router.navigate(['/private', session.sessionId]); // Redirecționează la pagina jocului
  //     return;
  //   }


  //   //1. Adauga juctorul in sesiunea de joc
  //   //UTILIZATORUL CURENT INTRA IN SESIUNEA PE CARE A DAT CLICK. UN JUCATOR POATE SA FACA PARTE DINTR-O SINGURA SESIUNE
  //   await this.sessionPlayersService.addPlayerToSession(session.sessionId,UserSession.userId, UserSession.nickName);


  //   this.router.navigate(['/public', session.sessionId]);
  // }


  async joinSession(session: Session): Promise<void> {
    try {
      if (session.isPublic) {
        await this.handlePublicSessionJoin(session);
      } else {
        await this.handlePrivateSessionJoin(session);
      }
    } catch (error) {
      console.error('Eroare la conectarea la sesiune:', error);
      // TODO: Poți adăuga un mesaj de eroare pentru utilizator
    }
  }


  private async handlePublicSessionJoin(session: Session): Promise<void> {
    //Stergem jucatorul care intra in sesiun din restul sesiunilor din care face parte
    await this.sessionPlayersService.removePlayerFromOtherSessions(UserSession.userId, session.sessionId);


    // Adaugă jucătorul în sesiunea publică
    await this.sessionPlayersService.addPlayerToSession(
      session.sessionId,
      UserSession.userId,
      UserSession.nickName
    );

    // Navighează către sesiunea publică
    this.router.navigate(['/public', session.sessionId]);
  }

  private async handlePrivateSessionJoin(session: Session): Promise<void> {
    // Deschide dialog-ul pentru parolă
    const password = await this.promptForPassword();

    if (!password) {
      console.log('Parola nu a fost introdusă.');
      return; // Utilizatorul a anulat
    }

    // Verifică parola
    if (password !== session.password) {
      alert('Parola introdusă este greșită!');
      return;
    }

    //Stergem jucatorul care intra in sesiun din restul sesiunilor din care face parte
    await this.sessionPlayersService.removePlayerFromOtherSessions(UserSession.userId, session.sessionId);

    // Adaugă jucătorul în sesiunea privată
    await this.sessionPlayersService.addPlayerToSession(
      session.sessionId,
      UserSession.userId,
      UserSession.nickName
    );

    // Navighează către sesiunea privată
    this.router.navigate(['/private', session.sessionId]);
  }


  private promptForPassword(): Promise<string | null> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(PasswordDialogComponent, {
        width: '300px',
        data: { sessionPassword: '' },
        disableClose: true,
        height: '400px'
      });

      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }



      dialogRef.afterOpened().subscribe(() => {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
          appRoot.removeAttribute('aria-hidden'); // Eliminăm atributul aria-hidden
        }
      })

      dialogRef.afterClosed().subscribe((password) => {
        resolve(password);
      });
    });
  }


  goBack() {
    // Revine la secțiunea principală
    this.showActiveSessions = false;
  }
}
