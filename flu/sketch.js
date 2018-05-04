// Luca Barbieri @lb © 2017-18 MIT License
// P5js retrieve data from Google Spreadsheets/JSON & make OOP | San Marino, RSM | 3.2018
// Educational purpose, made for DSII2018 lab @UniRSM

// P5js gdoc example inspired on Gist https://gist.github.com/claytical/6a929f14964c867e07d8 by @claytical

// link del doc google spreasheets, deve essere pubblico su web,
// va copiato la parte di indice nell'url nel formato sotto:
// https://spreadsheets.google.com/feeds/list/
// + KEY_URL + /od6/public/values?alt=json

// nella creazione dei dati in spreadsheets non utilizzare spazi o trattini perché durante la creazione del json verranno rimossi
// usare minuscole o maiuscole


// carica da online
var url = "https://spreadsheets.google.com/feeds/list/1KnslfmMhYANBw8QaN2O1omywy-FRJPgKCGxbcetK7t0/od6/public/values?alt=json";
// oppure carica da file locale File/Save As...
//var url = "data/values.json";

var ogg = []; // < array di oggetti/classi
var grid = 0;
var ruota = true;


function setup() {
  pixelDensity(displayDensity());
  createCanvas(windowWidth, windowHeight);

  loadJSON(url, gotSpreadsheet, 'jsonp');   // richiedi i dati formato JSON e poi chiama la funzione gotSpreadsheet

  colorMode(HSB);
  rectMode(CENTER);
} // setup()


function draw() {
  // piccolo loop per verificare di avere i dati, stampa su schermo cerchi con i colori presenti nel google doc
  grid = width/(ogg.length+1);

  background(255);
  // text("OBJECTS : " + ogg.length, 10,20); // < stampa il numero oggetti in alto a sx

  for (var i=0; i<ogg.length; i++) {   // mostra tutti gli oggetti
    ogg[i].mostra();
  }
} // draw()


function gotSpreadsheet(colori) {
  console.log(colori.feed.entry.length); // < debug, numero righe della tabella
  for (var i = 0; i < colori.feed.entry.length; i++) {
    // costruzione dell'oggetto singolo, la riga
    var c = {
                  // dati, nomi delle colonne, i parametri
                  "dimensione": colori.feed.entry[i].gsx$dimensione.$t,
                  "colore": colori.feed.entry[i].gsx$colore.$t,
                  "anno": colori.feed.entry[i].gsx$anno.$t,
                  "complicazione": colori.feed.entry[i].gsx$complicazione.$t
              }
    console.log(c); // < debug, verifica oggetto 1x1
    // e ora generiamo un nuovo oggetto classe "Oggetto"
    ogg.push(new Oggetto(i, c.dimensione, c.colore, c.anno, c.complicazione));
  }
} // gotSpreadsheet(colori)


// DEFINIZIONE DELLA CLASSE OGGETTI "Oggetto"
function Oggetto(_id, _dimensione, _colore, _anno, _complicazione) {

  // DATI E COSTRUTTORE
  this.id = Number(_id); // < Number() converte in numero intero la stringa
  this.dimensione = Number(_dimensione);
  this.colore = _colore;
  this.anno = _anno;
  this.complicazione = _complicazione;

  //this.speed = _dimensione/200; //random(-10,10); // < velocità di variazione su asse y
  this.dy = 0; // variazione delta Y relativa al presente, si parte da 0
  this.speedRot = _dimensione;

  // FUNZIONALITA

  this.mostra = function() {
    // disegna un quadrato con velocità differente e colore diverso
    fill(0);
    push();
    translate(grid + this.id * grid, height/2 + this.dy);
    if (ruota) {
      rotate((frameCount/200)* this.speedRot); // maggiore è il numero dei morti e maggiore sarà la velocità
    }
    if (this.colore == "rosso"){
    fill (0, 100, 60);}


    rect(0, 0, grid * 0.01, grid * 0.1);
    pop();
    noStroke();
    fill(0);
    textAlign(LEFT, CENTER);
    push();
    translate(grid + (this.id * grid),height/3);
    rotate(PI/2);
    text(this.complicazione,0,0);
    pop();

    //text(this.colore,grid + (this.id * grid),height/3);
  } // display()

} // Oggetto()


// se ridimensiona la finestra ricalcola width e height canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// implementazioni future
// rendere visibile l'anno di riferimento
// completare i dati relativi agli altri anni (fino al 2004-05)
// sceglire se mostrare dati differenti con diversi colori
// mettere un testo che spiega il numero totale di complicazioni rispetto quello generale di morti
