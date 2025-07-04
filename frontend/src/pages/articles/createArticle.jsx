import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useEditor, EditorContent } from "@tiptap/react";
import Loader from '../../components/others/Loader';
import { useSessionUserContext } from '../../components/contexts/sessionUserContext';
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Code from "@tiptap/extension-code";
import styles from './createArticle.module.css';
import convertDateToDateLong from '../../functions/getDateLong';

const CreateArticle = () => {
  const [loadingFinish, setLoadingFinish] = useState(false);
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [tags, setTags] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const {sessionUser, setSessionUser} = useSessionUserContext();
  const [inputForm, setInputForm] = useState({
    codearticle: "",
    titre: "",
    resume: "",
    slug:"",
    contenu:"",
    lienImg: ""
  });

  const handleChangeTagChecker = (ref, value) => {
    setTags(currentTags =>
      currentTags.map(tag =>
        tag.CodeTagArticle === ref
          ? { ...tag, checked: value } // ou `true` si tu veux forcer
          : tag
      )
    );
  };

  useEffect(() => {
    if (sessionUser) {
    const splitTags = (tagsString) => {
      if (tagsString) {
        return tagsString.split(",");
      }
    };

    setLoadingFinish(false);
    fetch(`/api/articles/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const dataModify = data;
          if (dataModify[0]) {
          dataModify[0].Tags = splitTags(data[0].Tags);
          setArticle(dataModify);
          handleSetterInputFormFromDB(dataModify);
        }
      }
    )
      .catch((err) => console.error('Erreur:', err));
    }
    setLoadingFinish(true);
  }, [slug, sessionUser]);

useEffect(() => {
  setLoadingFinish(false);

  fetch(`/api/tagsArticles`)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        const dataModifyWithChecked = data.map(current => {
          let isChecked = false;
            isChecked = Array.isArray(article?.[0]?.Tags) && article[0].Tags.includes(current.Libelle);
          return {
            ...current,
            checked: isChecked
          };
        });
        setTags(dataModifyWithChecked);
      }
    })
    .catch((err) => console.error('Erreur:', err))
    .finally(() => {
      setLoadingFinish(true);
    });
}, [slug, sessionUser, article]);

  const handleSetterInputFormFromDB = (objectData) => {
    setInputForm(prevInputValueFromDB => ({
      ...prevInputValueFromDB,
      codearticle: objectData[0].CodeArticle,
      titre: objectData[0].Titre,
      resume: objectData[0].Resume,
      slug: objectData[0].Slug,
      contenu:objectData[0].Contenu,
      lienImg: objectData[0].LienImg
    }));
  };

  const handleEditCurrentArticle = async () => {
    const dateNow = new Date();
    const dateFormated = convertDateToDateLong(dateNow);
  try {
    const response = await fetch("/api/articles/validationMaJ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ parCodeArticle: article?.[0]?.CodeArticle, parTitre: inputForm.titre, parResume: inputForm.resume, parSlug: inputForm.slug, parContenu: htmlContent, parDateMaj: dateNow, parLienImg: inputForm.lienImg})
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
    }

    const result = await response.json();
    console.log("Mise à jour réussie :", result);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'article :", err);
  }
};

  const handleSetterInputForm = (id, value) => {
    setInputForm(prevInputForm => ({
      ...prevInputForm,
      [id]: value
    }));
  };

const handleCreateNewArticle = async () => {
    const dateNow = new Date();
    const dateFormated = convertDateToDateLong(dateNow);
  try {
    const response = await fetch("/api/articles/validationCreation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ parCodeArticle: (sessionUser.id.toString() + "-" + dateFormated), parTitre: inputForm.titre, parResume: inputForm.resume, parSlug: inputForm.slug, parContenu: htmlContent, parDateCreation: dateNow, parDateMaj: dateNow, parCreePar: sessionUser.id, parLienImg: inputForm.lienImg})
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
    }

    const result = await response.json();
    console.log("Création réussie :", result);
  } catch (err) {
    console.error("Erreur lors de la création de l'article :", err);
  }
};

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Code,
    ],
    content: "<p>Commence à écrire ici...</p>",
    onUpdate({ editor }) {
      setHtmlContent(editor.getHTML());
    },
  });


  useEffect(() => {
    if (editor && article?.[0]?.Contenu) {
      editor.commands.setContent(article[0].Contenu);
    }
  }, [editor, article]);

  // Fonction pour insérer une image via URL prompt
  const addImage = () => {
    const url = window.prompt("URL de l'image ?");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Fonction pour ajouter un lien hypertexte
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL du lien ?", previousUrl);
    if (url === null) {
      return;
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  console.log("user", sessionUser);
  console.log("article", article);
  console.log("Input", inputForm);
  console.log("tags", tags);
  return (
    <div className="container-xl mt-4">
      {!loadingFinish ?
      <Loader/> :
        (sessionUser?.grade == "Administrateur" ?
        <div className="row">
            <div className="col-12 col-lg-12">
            <h2 className="mt-4 text-center txtColorWhite">{article ? "Éditer un " : "Créer un nouvel "}article</h2>
            <input className={`mt-4 ${styles.input}`}
            type="text"
            maxLength={45}
            placeholder="Titre"
            value={article ? article[0].Titre : ""}
            id="createtitre"
            onBlur={(e) => handleSetterInputForm(e.target.id.replace("create", ""), e.target.value)}
            />
            <input className={`mt-2 ${styles.input}`}
            type="text"
            maxLength={30}
            placeholder="Slug"
            id="createslug"
            value={article ? article[0].Slug : ""}
            onBlur={(e) => handleSetterInputForm(e.target.id.replace("create", ""), e.target.value)}
            />
            <input className={`mt-2 ${styles.input}`}
            type="text"
            maxLength={80}
            placeholder="Lien image de l'article"
            id="createlienImg"
            value={article ? article[0].LienImg : ""}
            onBlur={(e) => handleSetterInputForm(e.target.id.replace("create", ""), e.target.value)}
            />
            <textarea className={`mt-2 mb-2 ${styles.input}`}
              maxLength={300}
              placeholder="Résumé de l'article"
              id="createresume"
              value={article ? article[0].Resume : ""}
              onBlur={(e) => handleSetterInputForm(e.target.id.replace("create", ""), e.target.value)}
              rows={5}
            />
              <div className="col-12 mb-2 d-flex align-items-left justify-content-left txtColorWhite">
                <span className="ps-1"><b>Tags : </b></span>
                {tags && tags.map((currentTag, index) => (
                  <div className="ps-2" key={currentTag.CodeTagArticle} onClick={()=>handleChangeTagChecker(currentTag.CodeTagArticle, !currentTag.checked)}><span className={`badge ${currentTag.checked ? "badge-customOn" : "badge-customOff"} cPointer`}>{currentTag.Libelle}</span></div>
                ))}
              </div>
              <div className={`${styles.breakerTitre} mt-4 mb-4`}></div>
              <div style={{ marginBottom: "1em", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <button className={styles.button}
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  style={{ fontWeight: editor.isActive("bold") ? "bold" : "normal" }}
                >
                  Gras
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  style={{ fontStyle: editor.isActive("italic") ? "italic" : "normal" }}
                >
                  Italique
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  disabled={!editor.can().chain().focus().toggleUnderline().run()}
                  style={{ textDecoration: editor.isActive("underline") ? "underline" : "none" }}
                >
                  Souligné
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
                  style={{ textDecoration: editor.isActive("strike") ? "line-through" : "none" }}
                >
                  Barré
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  disabled={!editor.can().chain().focus().toggleCode().run()}
                  style={{ fontFamily: editor.isActive("code") ? "monospace" : "inherit" }}
                >
                  Code inline
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
                  style={{ fontFamily: editor.isActive("codeBlock") ? "monospace" : "inherit" }}
                >
                  Bloc de code
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  disabled={!editor.can().chain().focus().toggleBlockquote().run()}
                  style={{ fontStyle: editor.isActive("blockquote") ? "italic" : "normal" }}
                >
                  Citation
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  disabled={!editor.can().chain().focus().toggleBulletList().run()}
                  style={{ fontWeight: editor.isActive("bulletList") ? "bold" : "normal" }}
                >
                  Liste à puces
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                  style={{ fontWeight: editor.isActive("orderedList") ? "bold" : "normal" }}
                >
                  Liste numérotée
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().setParagraph().run()}
                  style={{ fontWeight: editor.isActive("paragraph") ? "bold" : "normal" }}
                >
                  Paragraphe
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  style={{ fontWeight: editor.isActive("heading", { level: 1 }) ? "bold" : "normal" }}
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  style={{ fontWeight: editor.isActive("heading", { level: 2 }) ? "bold" : "normal" }}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  style={{ fontWeight: editor.isActive("heading", { level: 3 }) ? "bold" : "normal" }}
                >
                  H3
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign("left").run()}
                  style={{ fontWeight: editor.isActive({ textAlign: "left" }) ? "bold" : "normal" }}
                >
                  Gauche
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign("center").run()}
                  style={{ fontWeight: editor.isActive({ textAlign: "center" }) ? "bold" : "normal" }}
                >
                  Centre
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign("right").run()}
                  style={{ fontWeight: editor.isActive({ textAlign: "right" }) ? "bold" : "normal" }}
                >
                  Droite
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                  style={{ fontWeight: editor.isActive({ textAlign: "justify" }) ? "bold" : "normal" }}
                >
                  Justifié
                </button>

                <button type="button" onClick={addImage}>
                  Ajouter une image
                </button>
                <button type="button" onClick={setLink}>
                  Ajouter / Modifier lien
                </button>

              <button
                type="button"
                onClick={() => {
                  const tag = prompt("Nom de l'ancre :");
                  if (tag) {
                    editor.chain().focus().insertContent(` #$${tag}$# `).run();
                  }
                }}
                style={{ fontWeight: "normal" }}
              >
                Insérer ancre
              </button>
              </div>

          <EditorContent editor={editor} style={{ border: "1px solid #ccc", padding: "1em", minHeight: "300px" }} />

          {!article ? 
          <button
            type="button"
            onClick={() => {
              console.log("Contenu HTML sauvegardé:", htmlContent);
              alert("Article sauvegardé (voir console)");
              handleCreateNewArticle();
            }}
            style={{ marginTop: "1em" }}
          >
            Sauvegarder l’article
          </button>
          :
          <button
            type="button"
            onClick={() => {
              console.log("Contenu HTML modifié et sauvegardé:", htmlContent);
              alert("Article mise à jour (voir console)");
              handleEditCurrentArticle();
            }}
            style={{ marginTop: "1em" }}
          >
            Mettre à jour l'article
          </button>
          }
          </div>
        </div> : 
          <div className="row">
            <div className="col-12 col-lg-12 mt-5">
            <h2 className="mt-5 text-center txtColorWhite">La création/édition d'article est réservée aux administrateurs</h2> 
            </div>
          </div>
      )
    }
    </div>
  );
}

export default CreateArticle;
