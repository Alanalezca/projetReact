import { pool } from '../db.js';

export const getCurrentDraft = {
  findBySlug: async (slug, userId) => {
    const query = `
      SELECT d."ID", d."PseudoJ1", d."PseudoJ2",
             d."FactionBanJ1", d."FactionBanJ2",
             d."FactionPickAJ1", fa1."LienImg" AS "LienImgAJ1", fa1."Libelle" AS "LibelleFactionAJ1", fa1."CouleurRGB" AS "CouleurAJ1",
             d."FactionPickBJ1", fb1."LienImg" AS "LienImgBJ1", fb1."Libelle" AS "LibelleFactionBJ1", fb1."CouleurRGB" AS "CouleurBJ1",
             d."FactionPickCJ1", fc1."LienImg" AS "LienImgCJ1", fc1."Libelle" AS "LibelleFactionCJ1", fc1."CouleurRGB" AS "CouleurCJ1",
             d."FactionPickAJ2", fa2."LienImg" AS "LienImgAJ2", fa2."Libelle" AS "LibelleFactionAJ2", fa2."CouleurRGB" AS "CouleurAJ2",
             d."FactionPickBJ2", fb2."LienImg" AS "LienImgBJ2", fb2."Libelle" AS "LibelleFactionBJ2", fb2."CouleurRGB" AS "CouleurBJ2",
             d."FactionPickCJ2", fc2."LienImg" AS "LienImgCJ2", fc2."Libelle" AS "LibelleFactionCJ2", fc2."CouleurRGB" AS "CouleurCJ2",
             d."AvecAnomalies", d."Etat", d."Commentaire",
             d."DateCreation", d."DateDerModif", d."IDSet",
             s."ID" AS "SetID", d."Titre", s."Libelle", s."Numero",
             d."DraftEnCoursPourJoueurAouB", d."DraftEnCoursSurFactionAouBouC", d."DraftJ1Finished", d."DraftJ2Finished"
      FROM tab_keyforge_draftsessions d
      LEFT JOIN l_keyforge_sets s ON d."IDSet" = s."ID"
      LEFT JOIN l_keyforge_factions fa1 ON d."FactionPickAJ1" = fa1."ID"
      LEFT JOIN l_keyforge_factions fb1 ON d."FactionPickBJ1" = fb1."ID"
      LEFT JOIN l_keyforge_factions fc1 ON d."FactionPickCJ1" = fc1."ID"
      LEFT JOIN l_keyforge_factions fa2 ON d."FactionPickAJ2" = fa2."ID"
      LEFT JOIN l_keyforge_factions fb2 ON d."FactionPickBJ2" = fb2."ID"
      LEFT JOIN l_keyforge_factions fc2 ON d."FactionPickCJ2" = fc2."ID"
      WHERE d."ID" = $1 AND d."CreePar" = $2;
    `;
    const { rows } = await pool.query(query, [slug, userId]);
    return rows.length ? rows : null;
  }
};

export const getMyDrafts = {
  findByUserId: async (userId) => {
    const query = `
    SELECT d."ID", d."PseudoJ1", d."PseudoJ2",
                d."FactionBanJ1", d."FactionBanJ2",
                d."FactionPickAJ1", d."FactionPickBJ1", d."FactionPickCJ1",
                d."FactionPickAJ2", d."FactionPickBJ2", d."FactionPickCJ2",
                d."AvecAnomalies", d."Etat", d."Commentaire",
                d."DateCreation", d."DateDerModif", d."IDSet",
                s."ID" AS "SetID", d."Titre", f."LienImg" AS "LienImgFactionPickAJ1", f2."LienImg" AS "LienImgFactionPickBJ1", f3."LienImg" AS "LienImgFactionPickCJ1"
          , f4."LienImg" AS "LienImgFactionPickAJ2", f5."LienImg" AS "LienImgFactionPickBJ2", f6."LienImg" AS "LienImgFactionPickCJ2"
          FROM tab_keyforge_draftsessions d
          LEFT JOIN l_keyforge_sets s ON d."IDSet" = s."ID" LEFT JOIN l_keyforge_factions f ON f."ID" = d."FactionPickAJ1"
        LEFT JOIN l_keyforge_factions f2 ON f2."ID" = d."FactionPickBJ1"
        LEFT JOIN l_keyforge_factions f3 ON f3."ID" = d."FactionPickCJ1"
        LEFT JOIN l_keyforge_factions f4 ON f4."ID" = d."FactionPickAJ2"
        LEFT JOIN l_keyforge_factions f5 ON f5."ID" = d."FactionPickBJ2"
        LEFT JOIN l_keyforge_factions f6 ON f6."ID" = d."FactionPickCJ2"
      WHERE d."CreePar" = $1
      ORDER BY d."DateCreation";
    `;

    const { rows } = await pool.query(query, [userId]);
    return rows;
  }
};

export const getSets = {
  findSets: async () => {
    const query = `
      SELECT "ID", "Annee", "Numero", "Libelle"
      FROM l_keyforge_sets
      ORDER BY "Numero";
    `;
    const { rows } = await pool.query(query);
    return rows;
  }
};

export const getFactionsFromSet = {
  findFactions: async (IDSet) => {
    const query = `
      SELECT DISTINCT f."ID", f."Libelle", f."LienImg", f."CouleurRGB"
      FROM tab_affectations_keyforge_sets_factions a 
      JOIN l_keyforge_factions f 
      ON f."ID" = a."IDFaction" 
      WHERE a."IDSet" = $1`;
    const { rows } = await pool.query(query, [IDSet]);
    return rows;
  }
};

export const getBasePoolCartes = {
  findCartes: async (factionsArray) => {
    const query = `
      SELECT d."ID", d."QteDispo", d."Faction", d."Ensemble", d."NbCartesDansEnsemble"
      FROM l_keyforge_cartes d
      WHERE d."Faction" = ANY($1)`;
    const { rows } = await pool.query(query, [factionsArray]);
    return rows;
  }
};

export const doCreationNewDraft = {
  createNewDraft: async (parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, parUserID, parTitreDraft, parEtat) => {
    const query = `
      INSERT INTO tab_keyforge_draftsessions ("ID", "PseudoJ1", "PseudoJ2", "AvecAnomalies", "IDSet", "DateCreation", "DateDerModif", "CreePar", "Titre", "Etat")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`;
    const { rows } = await pool.query(query, [parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, parUserID, parTitreDraft, parEtat]);
    return rows;
  }
};

export const doUpdateFactionsSpecificDraft = {
  updateFactionsSpecificDraft: async (parID, parFactionBanJ1, parFactionBanJ2, parFactionPickAJ1, parFactionPickBJ1, parFactionPickCJ1, parFactionPickAJ2, parFactionPickBJ2, parFactionPickCJ2, currentUserId) => {
    const query = `
      UPDATE tab_keyforge_draftsessions SET "Etat" = 10, "FactionBanJ1" = $2, "FactionBanJ2" = $3, "FactionPickAJ1" = $4, "FactionPickBJ1" = $5, "FactionPickCJ1" = $6, "FactionPickAJ2" = $7, "FactionPickBJ2" = $8, "FactionPickCJ2" = $9
      WHERE "ID" = $1 AND "CreePar" = $10
      RETURNING *`;
    const { rows } = await pool.query(query, [parID, parFactionBanJ1, parFactionBanJ2, parFactionPickAJ1, parFactionPickBJ1, parFactionPickCJ1, parFactionPickAJ2, parFactionPickBJ2, parFactionPickCJ2, currentUserId]);
    return rows;
  }
};

export const doUpdateFocusSurJoueurAouB = {
  updateFocusSurJoueurAouB: async (parID, parJoueurAorB, currentUserId) => {
    const query = `
      UPDATE tab_keyforge_draftsessions SET "DraftEnCoursPourJoueurAouB" = $2
      WHERE "ID" = $1 AND "CreePar" = $3
      RETURNING *`;
    const { rows } = await pool.query(query, [parID, parJoueurAorB, currentUserId]);
    return rows;
  }
};

export const doUpdateFocusSurFactionAouBouC = {
  updateFocusSurFactionAouBouC: async (parID, parFactionAorBorC, currentUserId) => {
    const query = `
      UPDATE tab_keyforge_draftsessions SET "DraftEnCoursSurFactionAouBouC" = $2
      WHERE "ID" = $1 AND "CreePar" = $3
      RETURNING *`;
    const { rows } = await pool.query(query, [parID, parFactionAorBorC, currentUserId]);
    return rows;
  }
};

export const doUpdateEtapeDraft = {
  updateEtapeDraft: async (parID, parEtape, currentUserId) => {
    const query = `
      UPDATE tab_keyforge_draftsessions SET "Etat" = $2
      WHERE "ID" = $1 AND "CreePar" = $3
      RETURNING *`;
    const { rows } = await pool.query(query, [parID, parEtape, currentUserId]);
    return rows;
  }
};

export const doDeleteDraft = {
  deleteDraft: async (parCodeDraft, userId) => {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Vérifie que le draft appartient bien à l'utilisateur
      const { rows } = await client.query(
        `SELECT 1 FROM tab_keyforge_draftsessions 
         WHERE "ID" = $1 AND "CreePar" = $2`,
        [parCodeDraft, userId]
      );

      if (rows.length === 0) {
        throw new Error("Draft introuvable ou non autorisé");
      }

      // DELETE enfants
      await client.query(
        `DELETE FROM tab_affectations_keyforge_draftpool_cartes 
         WHERE "IDDraftSession" = $1`,
        [parCodeDraft]
      );

      await client.query(
        `DELETE FROM tab_affectations_keyforge_draftpool_cartes_validees 
         WHERE "IDDraftSession" = $1`,
        [parCodeDraft]
      );

      // DELETE parent
      await client.query(
        `DELETE FROM tab_keyforge_draftsessions 
         WHERE "ID" = $1`,
        [parCodeDraft]
      );

      await client.query('COMMIT');

      return [{ success: true }];

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Erreur transaction:', err);
      throw err;

    } finally {
      client.release();
    }
  }
};

export const doEnregistrementPoolsCartes = {
  savePool: async (requeteSQL, values) => {
    const { rows } = await pool.query(requeteSQL, values);
    return rows;
  }
};

export const getPoolCartesPourDraft = {
  findPool: async (idDraft) => {
    const query = `
      SELECT
        a."IDDraftSession", a."IDCarte", a."JoueurAouB", a."Classement",
        c."Libelle" as "LibelleCarte", c."CheminImg" as "CheminImgCarte", c."Numero", c."Rarete", c."Aombre", c."Puissance", c."Armure",
        t."Libelle" as "LibelleType",
        f."Libelle" as "LibelleFaction", f."LienImg" as "LienImgFaction", f."ID" as "IDFaction"
      FROM tab_affectations_keyforge_draftpool_cartes a
      JOIN l_keyforge_cartes c ON a."IDCarte" = c."ID"
      JOIN l_keyforge_types t ON c."Type" = t."ID"
      JOIN l_keyforge_factions f ON c."Faction" = f."ID"
      WHERE a."IDDraftSession" = $1
      ORDER BY a."Classement"`;
    const { rows } = await pool.query(query, [idDraft]);
    return rows;
  }
};


export const doEnregistrementCarteValideeEtReinitFactionCurrentDraft = {
  saveCardValidee: async (
    parIDDraft,
    parIDCard,
    parJAorB,
    Classement,
    ClassementCardToDeleteA,
    ClassementCardToDeleteB,
    reinitFocusFactionDuDraft, 
    reinitFocusJoueurDuDraft,
    draftJ1Finished,
    draftJ2Finished,
    etape
  ) => {

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Vérif draft
      const { rows: draft } = await client.query(
        `SELECT 1 FROM tab_keyforge_draftsessions WHERE "ID" = $1`,
        [parIDDraft]
      );

      if (draft.length === 0) {
        throw new Error("Draft introuvable");
      }

      // INSERT
      const { rows } = await client.query(
        `INSERT INTO tab_affectations_keyforge_draftpool_cartes_validees
         ("IDDraftSession", "IDCarte", "JoueurAouB", "Classement")
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [parIDDraft, parIDCard, parJAorB, Classement]
      );

      // DELETE pool
      await client.query(
        `DELETE FROM tab_affectations_keyforge_draftpool_cartes
         WHERE "IDDraftSession" = $1
         AND "Classement" = ANY($2)`,
        [
          parIDDraft,
          [ClassementCardToDeleteA, ClassementCardToDeleteB, Classement]
        ]
      );

      // UPDATE
      if (reinitFocusFactionDuDraft) {
        await client.query(
            `UPDATE tab_keyforge_draftsessions
            SET "DraftEnCoursSurFactionAouBouC" = NULL, "DraftJ1Finished" = $2, "DraftJ2Finished" = $3
            WHERE "ID" = $1
          `,
          [
            parIDDraft,
            draftJ1Finished,
            draftJ2Finished
          ]
        );
      }

      if (etape) {
        await client.query(
            `
            UPDATE tab_keyforge_draftsessions
            SET "Etat" = $2
            WHERE "ID" = $1
          `,
          [
            parIDDraft,
            etape
          ]
        );
      }

      if (reinitFocusJoueurDuDraft) {
        await client.query(
          `
          UPDATE tab_keyforge_draftsessions
          SET "DraftEnCoursPourJoueurAouB" = NULL
          WHERE "ID" = $1
        `,
        [
          parIDDraft
        ]);
      }

      await client.query('COMMIT');

      return { success: true };

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Erreur transaction:', err);
      throw err;

    } finally {
      client.release();
    }
  }
};

export const getPoolCartesValideesDuDraftEnCours = {
  findPool: async (idDraft) => {
    const query = `
      SELECT
        a."IDDraftSession", a."IDCarte", a."JoueurAouB", a."Classement",
        c."Libelle" as "LibelleCarte", c."CheminImg" as "CheminImgCarte", c."Numero", c."Rarete", c."Aombre", c."Puissance", c."Armure",
        t."Libelle" as "LibelleType",
        f."Libelle" as "LibelleFaction", f."LienImg" as "LienImgFaction", f."ID" as "IDFaction"
      FROM tab_affectations_keyforge_draftpool_cartes_validees a
      JOIN l_keyforge_cartes c ON a."IDCarte" = c."ID"
      JOIN l_keyforge_types t ON c."Type" = t."ID"
      JOIN l_keyforge_factions f ON c."Faction" = f."ID"
      WHERE a."IDDraftSession" = $1
      ORDER BY a."Classement"`;
    const { rows } = await pool.query(query, [idDraft]);
    return rows;
  }
};