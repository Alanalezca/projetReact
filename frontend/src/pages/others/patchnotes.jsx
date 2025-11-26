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
                            - Ajout de la fonctionnalité "random" sur le module de draft Smash Up.<br/>
                            - Correction d'un soucis d'affichage des instructions de draft (module Smash Up) en mode mobile<br/>
                            - Ajout de la fonctionnalité "random" sur le module de draft Dice Throne.<br/>
                            - Correction d'un soucis d'affichage des instructions de draft (module Dice Throne) en mode mobile<br/>
                            - Ajout de la page "patchnotes".<br/>
                            - Ajout du lien vers email (footer)<br/>
                            - Ajout du lien discord (en cours)<br/>
                            `
                            }/>
                    </div>
                </div>
        </div>
  )
};

export default Patchnotes;