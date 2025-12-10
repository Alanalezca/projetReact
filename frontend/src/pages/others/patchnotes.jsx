import {useState, useEffect} from 'react';
import Accordeon from '../../components/others/Accordeon';
const Patchnotes = () => { 


  return (
        <div className="container-xl mt-3">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mt-4 text-center txtColorWhite">Version actuelle : 1.00.02</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mt-4">   
                        <Accordeon blocSoloOrTopOrMidOrBot="Solo" textTitre="Version 1.00.02" textMain={`
                            - [Module de draft Smash Up] + Ajout de la fonctionnalité "random".<br/>
                            - [Module de draft Smash Up] ¤ Correction d'un soucis d'affichage des instructions de draft en mode mobile<br/>
                            - [Module de draft Dice Throne] + Ajout de la fonctionnalité "random" sur le module de draft.<br/>
                            - [Module de draft Dice Throne] ¤Correction d'un soucis d'affichage des instructions de draft en mode mobile<br/>
                            - [Patchnote] + Ajout de la page "patchnotes".<br/>
                            - [Footer] + Ajout du lien vers email.<br/>
                            - [Footer] + Ajout du lien discord (en cours)<br/>
                            - [Liste d'articles] ¤ Correction des liens menant aux articles affichés en mode "large".<br/>
                            - [Création/Edition d'articles] + Mise en bandeau des boutons de l'éditeur.<br/>
                            - [Liste d'articles] ¤ Correction d'un problème de taille de l'image de la "card large".
                            `
                            }/>
                    </div>
                </div>
        </div>
  )
};

export default Patchnotes;