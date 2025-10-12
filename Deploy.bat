@echo off
REM Aller dans le dossier frontend
cd /d C:\Users\alana\OneDrive\NexusRE\frontend

REM Lancer la compilation (build)
echo === Démarrage du build frontend ===
npm run build
IF ERRORLEVEL 1 (
    echo Le build a échoué. Arrêt du script.
    pause
    exit /b 1
)

REM Retour à la racine du projet
cd /d C:\Users\alana\OneDrive\NexusRE\

REM Ajout des fichiers au commit
echo === Ajout des fichiers au commit Git ===
git add .

REM Commit avec message
git commit -m "Build complet et mise à jour"

REM Push forcé
echo === Envoi sur le dépôt distant ===
git push --force

echo === Déploiement terminé ===
pause