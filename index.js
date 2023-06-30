const bodyparser = require("body-parser");
const express = require("express");
const server = express();

server.listen(8000, "localhost", () => {
  console.log("server en avant");
});

server.set("view engine", "ejs");

server.use(bodyparser.urlencoded({ extended: true }));
server.use(bodyparser.json());

server.use((req, res, next) => {
  console.log(req.path);
  next();
});

server.use((req, res, next) => {
  console.log(new Date().toUTCString());
  next();
});

server.use(express.static("public"));

// Route pour la page "/couleur"
server.get("/couleur", macouleur);

// Route pour la page "/tarif"
server.get("/tarif", montarif);

// Route pour le formulaire de calcul du tarif (méthode POST)
server.post("/tarif", calcultarif);
server.post("/couleur", calculcouleur);
/**
 * Fonction de rendu pour la page "/tarif"
 * Cette fonction renvoie la vue "tarif_vue.ejs" avec les données fournies
 */
function montarif(req, res) {
  let age = "";
  let duree = "";
  let nbAccident = "";
  let anciennete = "";

  let data = {
    tarif: -1,
    age: age,
    duree: duree,
    nbAccident: nbAccident,
    anciennete: anciennete,
  };
  console.log(data)

  res.render("tarif_vue.ejs", data);
}
function macouleur(req, res) {
  let lt = "";
  let couleur = "";
  let data = {
    couleur: -1,
    lt: lt
  };
  console.log(data)
  res.render("couleur_vue.ejs", data);
}
/**
 * Fonction de rendu pour la page "/couleur"
 * Cette fonction renvoie la vue "tarif_vue.ejs" avec les données fournies,
 * notamment la couleur correspondante à la valeur "t" reçue dans la requête.
 */
function calculcouleur(req, res) {
  let lt = req.body.lt;
  let couleur = "";

  if (lt == 4) couleur = "bleu";
  else if (lt == 3) couleur = "vert";
  else if (lt == 2) couleur = "orange";
  else if (lt == 1) couleur = "rouge";
  else couleur = "refusé";

  let data = {
    lt: lt,
    couleur: couleur
  };

  res.render("couleur_vue.ejs", data);
}

/**
 * Fonction de calcul du tarif en fonction des données reçues du formulaire
 * Cette fonction calcule le tarif en fonction de l"âge, de la durée, du nombre d"accidents et de l"ancienneté.
 * Elle renvoie la vue "tarif_vue.ejs" avec les données fournies, y compris le tarif calculé.
 */
function calcultarif(req, res) {
  let age = req.body.age;
  let duree = req.body.duree;
  let nbAccident = req.body.nbAccident;
  let tarif = 4;
  let anciennete = req.body.anciennete;
  let data;

  if (age <= 25 && duree <= 2) tarif = tarif - 3;
  else if (age <= 25 && duree > 2) tarif = tarif - 2;
  else if (age > 25 && duree <= 2) tarif = tarif - 1;
  tarif = tarif - nbAccident;
  if (tarif <= 0) {
    res.send("Vous êtes refusé");
  } else if (anciennete >= 2) {
    tarif = tarif + 1;
    if (tarif > 4) tarif = 4;
    data = {
      age: age,
      duree: duree,
      nbAccident: nbAccident,
      tarif: tarif
    };
    res.render("tarif_vue.ejs", data);
  } else {
    data = {
      "tarif": tarif,
      age: age,
      duree: duree,
      nbAccident: nbAccident
    };
    res.render("tarif_vue.ejs", data);
  }
}
