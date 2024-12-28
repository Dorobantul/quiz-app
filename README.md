Utilizatorul scaneaza codul QR de pe masa si il duce in pagina principala a aplicatiei.
	1. POST Setam id-ul, numele si masa la care a scanat utilizatorul in baza de date

Utilizatorul poate sa creeze un joc nou sau sa se conecteze la un joc activ care inca nu a inceput

Utiliztorul poate sa selecteze tip de joc private sau publi.
	Daca alege private sesiunea lui de joc va avea o parola generata de 5 cife pe care o vom stoca in baza -> POST de sesiune + parola de conectare



Click pe butonul Creaza un joc pubilc: 
 	1. Stergem toate sesiunile ale utilizatorului cu acel ID din acel restaurant (Daca exista). Vom stoca si startul unei sesiuni in firestorage. Sesiunile pentru care au trecut mai mult de X ore se vor sterge automat din firestorage
	2.Creaza sesiune de joc public pentru utilizatorul conectat din restaurantul curent
	3. Redirect catre componenta game-session/sessionId


Cand intra pe componenta game-session
	1. Ecran cu toti jucatorii conectati la sesiunea user-ului (Initial nu o sa fie niciun jucator, doar cel care a creat camera)
	2. Buton de incepe Joc pentru sesiune (Vizibil doar pentru userul care a creat camera)

Cand apesi pe butonul de private:
	1. Sa apara un Popup in care sa selectezi parola pentru sesiunea de joc
	2. In popup sa avem un buton de "Salveaza parola"
		2.1 La apasarea butonului Salveaza parola sa se stearga toate sesiunile userului respectiv si sa se creeze o noua sesiune parolata
Click pe butonul care creaza un joc nou -> Utilizatorul creaza un joc nou:
	1. Creaza o camera noua de joc -> POST Creare sesiune de joc.
	2. Isi selecteaza numele cu care vrea sa participe la sesiunea de joc. -> POST nume in baza de date + masa din care face parte
	3. Poate decide cand sa dea start joc. Va avea un buton de start joc

Click pe butonul de conectare la joc activ:
	1. Load la toate sesiunile de jocuri active (care nu au inceput inca) din restaurantul respectiv -> GET toate sesiunile de joc din restaurantul respectiv care inca nu au inceput
	2. Selecteaza sesiunea de joc din care vrea sa faca parte
	3. Isi selecteaza numele cu care participa si asteapta ca admin-ul jocului sa dea start la joc

Click pe butonul start joc:
	1. Stocheaza numele participantilor in baza de date -> POST Lista de jucatori
	2. Seteaza flag de isStarted pentru sesiune de joc 
	3. Afisare interfata de selectare a categoriei pentru seiunea de jocu respectiva

Afisare interfata de selectare a categoriei pentru jocul respectiv
	1. Creare timer de 25 de secunde pentru participanti
	2. La finalul timer-ului se introduc in baza toate categoriile pentru fiecare jucator 
		2.1 -> GET toti jucatiorii din sesiune
		2.2 -> INSERT in baza categoriile alese pentru sesiune
		2.3 -> GET RANDOM o categorie in functie de numarul de categorii selectate

Generarea quiz-ului -> HttpRequest Chat Gpt care intoarce un raspuns de tip JSON unde stocam:
	[
		"intrebare":"Model de intrebare",
		"punctaj": 100,
		"timpRaspunsInSecunde" (Maxim 30):
		"varianteDeRaspuns": [
					 {
					    "raspuns":"Raspunsul intrebarii",
					    "esteCorect":Da/Nu	
					 } x 4
				     ]
	]

Variante: 
	1. Generam multe intrebari cu chat gpt si facem un script sa le inseram in baza. Fiecare intrebare va avea un raspuns corect si 3 incorecte, un Id al intrebarii, un Id al categoriei si un punctaj
Stocam quiz-ul pentru sesiunea de joc: POST quiz in baza de date unde stocam doar raspunsul corect -> Ramane


Utilizatorul alege o varianta:
	1.Verificam daca varianta aleasa de utilizator este match cu varianta stocata in baza de date pentru intrebarea respectiva din sesiunea curenta a restaurantului
	Daca varianta este corecta atunci POST in tabela de scor a sesiunii curente
	

Inceperea jocului

	Fiecare jucator va avea pe ecran timpul de raspuns plus 4 variante de raspuns
	La fiecare raspuns corect -> POST inseram in tabela care contorizeaza parcursul sesiunii din restaurant punctajul fiecarui jucator

Finalul jocului
	La finalul jocului vom afisa clasamentul in functie de masa respectiva.
	1. GET -> Rezultatuele jucatorilor
	2. Gruparea jucatorilor pe mese
	3. Calcularea punctajului mesei respective	
	4. Afisarea scorului in functie de punctajul pe masa


Urmatorii pasi:

	Cand se da join pe o camera parolata, trebuie sa cerem parola. Camerele parolate trebuie sa aibe o iconita cu o cheie
	Cand se da join pe o cammera publica, utilizatorul intra in camera. Trebuie sa ii apara fara refresh ca a intrat un utilizator nou pe camera
	
