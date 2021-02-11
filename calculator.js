let rezultatTotal = 0;
let memorie = "0";
let operatiaAnterioara = null;
const ecran = document.querySelector (".ecran");

function clickButon (value) {
    if (isNaN (parseInt (value))) {  // in cazul in care 'value' nu este un numar, se fol. "isNaN", iar "parseInt" transforma stringul de tip numar in numar!
        handleSymbol (value);  //  din moment ce valule nu va fi un numar, va fi un simbol deci se aplica "handleSymbol"
    } else {
        handleNumber (value); //in caz contrar, va fi un numar, deci se aplica "handleNumber"
    }
    randarePeEcran ();
}

function handleNumber (value) {
    if (memorie === "0") {  // cand pe ecran e zero, orice buton apasat va inlocui zero cu valoarea butonului respectiv.
        memorie = value;
    } else {
        memorie += value;  // in caz contrar, la valorea de pe ecran se adauga la capat val. butonului apasat cu "+=" 
    }
}

function handleSymbol (value) {
    switch (value) {
        case "C":  //se aplica atunci cand se apasa butonul "C" (clear)
            memorie = "0";
            rezultatTotal = 0;
            operatiaAnterioara = null;
            break; //se aplica tot timpul la sfarsit atunci cand se doreste sa se intrerupa functia de mai sus.
        case "=":  // se aplica atunci cand se apasa butonul "="
            if (operatiaAnterioara === null)  {
                return; // "return" NU afiseaza nimic, ori de cate ori e apasat "=", acesta avand nevoie de 2 numere sa returneze rezultat.
            } 
            aplicaOperatiaAnterioara (parseInt(memorie)); // se aplica operatiile anterioare apasarii butonului "="
            operatiaAnterioara = null;
            memorie = "" + rezultatTotal;
            rezultatTotal = 0;
            break;
        case '&#8592': // se aplica atunci cand se apasa butonul "<-" (backspace)
             if (memorie.length === 1) { //cand se apasa butonul "<-", orice numar ar fi pe ecran, format dintr-o singura cifra, devine zero!
                 memorie = "0";
             } else {
                 memorie = memorie.substring (0, memorie.length - 1); // orice nr. ar fi pe ecran, format din =>2 cifre, se scade ultima cifra din numar!
             } 
             break;
             default: // se aplica atunci cand nici unul dintre "case" de mai sus nu se aplica, adica se vor aplica operatii (+,-,x,/)
                 handleMath(value);
                 break;
    }
}

function handleMath (value) {
    if (memorie === "0") {
        // nu face nimic
        return;
    }
    const intMemorie = parseInt (memorie); 
    if (rezultatTotal===0) {       // cand se executa orice operatie, numarul de pe ecran devine noul "rezultat total"
        rezultatTotal=intMemorie;
    } else {
        aplicaOperatiaAnterioara (intMemorie); // in caz contrar se aplica operatia anterioara pentru noua valoare, care va fi noul "rezultat total"
    }
    operatiaAnterioara = value;

    memorie = "0"; // dupa executarea operatiei se asteapta noul numar care se va apasa si aparea pe ecran
} 

function aplicaOperatiaAnterioara (intMemorie) {

    if (operatiaAnterioara === "+") {
        rezultatTotal += intMemorie;
    } else if (operatiaAnterioara === "-") {
        rezultatTotal -= intMemorie;
    } else if (operatiaAnterioara === "x") {
        rezultatTotal *= intMemorie;
    } else   {
        rezultatTotal /= intMemorie;
    }
}

function randarePeEcran () { // functie ce face ca valorile butoanelor apasate sa apara pe ecran
      ecran.innerText = memorie;
}  

document.querySelector (".butoane").addEventListener ("click", function (event) {
    clickButon (event.target.innerText);
});