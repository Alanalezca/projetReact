import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useEditor, EditorContent } from "@tiptap/react";
import Loader from '../../components/others/Loader';
import { useSessionUserContext } from '../../components/contexts/sessionUserContext';
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Link as LinkToURL } from 'react-router-dom';
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Code from "@tiptap/extension-code";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Node } from '@tiptap/core';
import styles from './createArticle.module.css';
import convertDateToDateLong from '../../functions/getDateLong';
import { useOngletAlerteContext } from '../../components/contexts/ToastContext';
import { Heading } from '@tiptap/extension-heading';


const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          return attributes.id
            ? { id: attributes.id }
            : {};
        },
      },
    };
  },
});

const CreateArticle = () => {
  const [loadingArticleAEditer, setloadingArticleAEditer] = useState(true);
  const [loadingTags, setloadingTags] = useState(true);
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
  const { showOngletAlerte } = useOngletAlerteContext();

  const handleChangeTagChecker = (ref, value) => {
    setTags(currentTags =>
      currentTags.map(tag =>
        tag.CodeTagArticle === ref
          ? { ...tag, checked: value } // ou `true` si tu veux forcer
          : tag
      )
    );
  };

  const ArticleBox = Node.create({
    name: 'articleBox',
    group: 'block',
    content: 'paragraph+',
    parseHTML() {
      return [{ tag: 'div.article-box' }, { tag: 'p' }];
    },
    renderHTML({ HTMLAttributes }) {
      return ['div', { ...HTMLAttributes, class: 'article-box' }, 0];
    },
  });

  const SpacerBox = Node.create({
    name: 'spacerBox',
    group: 'block',
    parseHTML() { return [{ tag: 'div.spacer-box' }]; },
    renderHTML() { return ['div', { class: 'spacer-box', style: 'height:0.5em;' }, 0]; },
  });

  const CustomParagraph = Node.create({
    name: 'paragraph',
    group: 'block',
    content: 'inline*',
    parseHTML() {
      return [
        { tag: 'p' }, // pour les paragraphes
        { tag: 'span' }, // pour les spans inline
        { tag: 'strong' }, // gras
        { tag: 'em' }, // italique
        { tag: 'u' }, // souligné
        {
          tag: 'a[href]', // lien
          getAttrs: dom => ({
            href: dom.getAttribute('href'),
            target: dom.getAttribute('target'),
            rel: dom.getAttribute('rel'),
          }),
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ['p', HTMLAttributes, 0];
    },
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: el => el.getAttribute('id'),
          renderHTML: attrs => (attrs.id ? { id: attrs.id } : {}),
        },
      };
    },
  });

  // Extension pour gérer les liens/ancres
  const AnchorLink = Link.extend({
    name: 'anchorLink',

    addAttributes() {
      return {
        href: {
          default: null,
          parseHTML: element => element.getAttribute('href'),
          renderHTML: attributes => ({ href: attributes.href }),
        },
        target: {
          default: null,
          parseHTML: element => element.getAttribute('target'),
          renderHTML: attrs => ({ target: attrs.target }),
        },
        rel: {
          default: null,
          parseHTML: element => element.getAttribute('rel'),
          renderHTML: attrs => ({ rel: attrs.rel }),
        },
      };
    },

    validateLink: href => href.startsWith('#') || /^https?:\/\//.test(href)
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ paragraph: false }),
      CustomParagraph,
      CustomHeading,
      Underline,
      ArticleBox,
      AnchorLink.configure({ openOnClick: false }), // <-- utiliser AnchorLink ici
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Code,
      TextStyle,
      SpacerBox,
      Color.configure({ types: ['textStyle'] }),
    ],
    content: "<p>Commence à écrire ici...</p>",
    onUpdate({ editor }) {
      setHtmlContent(editor.getHTML());
    }
  });

  const insertAnchor = () => {
    if (!editor) return;
    const tag = prompt("Nom de l'ancre :");
    if (!tag) return;

    const { state, commands } = editor;
    const { selection } = state;
    const parentNode = selection.$from.parent;

    if (parentNode.type.spec.attrs && 'id' in parentNode.type.spec.attrs) {
      commands.updateAttributes(parentNode.type.name, { ...parentNode.attrs, id: tag });
    } else if (editor.can().setNode('paragraph')) {
      commands.setNode('paragraph', { id: tag });
    } else {
      alert("Impossible d'ajouter une ancre ici.");
    }
  };

  useEffect(() => {
    if (sessionUser) {
      const splitTags = (tagsString) => {
        if (tagsString) return tagsString.split(",");
      };

      setloadingArticleAEditer(true);
      fetch(`/api/articles/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          //console.log('article descandant', data);
          const dataModify = data;
            if (dataModify[0]) {
            dataModify[0].Tags = splitTags(data[0].Tags);
            setArticle(dataModify);
            handleSetterInputFormFromDB(dataModify);
          }
        }
      )
        .catch((err) => console.error('Erreur:', err));
      setloadingArticleAEditer(false);
    }
  }, [slug, sessionUser]);

useEffect(() => {
  setloadingTags(true);

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
      setloadingTags(false);
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

    setHtmlContent(objectData[0].Contenu);
  };

  const handleEditCurrentArticle = async () => {
    const dateNow = new Date();
    const tagsToInsert = tags.filter(currentArticle => 
      currentArticle.checked == true
    );
  try {
    const response = await fetch("/api/articles/validationMaJ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ parCodeArticle: article?.[0]?.CodeArticle, parTitre: inputForm.titre, parResume: inputForm.resume, parSlug: inputForm.slug, parContenu: htmlContent, parDateMaj: dateNow, parLienImg: inputForm.lienImg, parTags: tagsToInsert})
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
    }

    const result = await response.json();
    showOngletAlerte('success', '(Modification article)', '', `L'article "` + inputForm.titre + `" a bien été modifié !`);
    
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
      const tagsToInsert = tags.filter(currentArticle => 
        currentArticle.checked == true
      );
    try {
      const response = await fetch("/api/articles/validationCreation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ parCodeArticle: (sessionUser.id.toString() + "-" + dateFormated), parTitre: inputForm.titre, parResume: inputForm.resume, parSlug: inputForm.slug, parContenu: htmlContent, parDateCreation: dateNow, parDateMaj: dateNow, parCreePar: sessionUser.id, parLienImg: inputForm.lienImg, parTags: tagsToInsert})
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
      }

      const result = await response.json();
      showOngletAlerte('success', '(Création article)', '', `L'article "` + inputForm.titre + `" a bien été créé !`);
    } catch (err) {
      console.error("Erreur lors de la création de l'article :", err);
    }
  };

  const insertArticleBox = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, "\n");

    if (!selectedText) {
      editor.chain().focus().insertContent('<div class="article-box"><p>Ton texte ici</p></div>').run();
      return;
    }

    // Supprime la sélection et insère le custom node
    editor.chain().focus().deleteRange({ from, to }).wrapIn('articleBox').run();
  };


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
    if (!editor) return;

    // Récupère le href actuel du mark anchorLink (s'il y en a un)
    const previousUrl = editor.getAttributes('anchorLink')?.href || '';

    // Demande à l'utilisateur la nouvelle URL
    const url = prompt("URL du lien ?", previousUrl);

    if (url === null) return; // annulation
    if (url === "") {
      // supprime le lien si champ vide
      editor.chain().focus().extendMarkRange('anchorLink').unsetLink().run();
      return;
    }

    // applique le lien via ton extension AnchorLink
    editor.chain().focus().extendMarkRange('anchorLink').setLink({ href: url }).run();
  };

  //(tags);
  return (
    <div className="container-xl mt-4">
      {loadingArticleAEditer && loadingTags ?
      <Loader/> :
        (sessionUser?.grade == "Administrateur" ?
        <div className="row">
          <div className="col-12 col-lg-12">
            <h2 className="mt-4 text-center txtColorWhite">{article ? "Éditer un " : "Créer un nouvel "}article</h2>
            <input className={`mt-4 ${styles.input}`}
            type="text"
            maxLength={45}
            placeholder="Titre"
            value={inputForm ? inputForm.titre : ""}
            id="createtitre"
            onChange={(e) => setInputForm((prev) => ({...prev, titre: e.target.value}))}
            />
            <input className={`mt-2 ${styles.input}`}
            type="text"
            maxLength={30}
            placeholder="Slug"
            id="createslug"
            value={inputForm ? inputForm.slug : ""}
            onChange={(e) => setInputForm((prev) => ({...prev, slug: e.target.value}))}
            />
            <input className={`mt-2 ${styles.input}`}
            type="text"
            maxLength={80}
            placeholder="Lien image de l'article"
            id="createlienImg"
            value={inputForm ? inputForm.lienImg : ""}
            onChange={(e) => setInputForm((prev) => ({...prev, lienImg: e.target.value}))}
            />
            <textarea className={`mt-2 mb-2 ${styles.input}`}
              maxLength={300}
              placeholder="Résumé de l'article"
              id="createresume"
              value={inputForm ? inputForm.resume : ""}
              onChange={(e) => setInputForm((prev) => ({...prev, resume: e.target.value}))}
              rows={5}
            />
            <div className="col-12 mb-2 d-flex flex-wrap align-items-start justify-content-start txtColorWhite">
              <span className="ps-1"><b>Tags : </b></span>
              {tags && tags.map((currentTag, index) => (
                <div className="ps-2" key={currentTag.CodeTagArticle} onClick={()=>handleChangeTagChecker(currentTag.CodeTagArticle, !currentTag.checked)}><span className={`badge ${currentTag.checked ? "badge-customOn" : "badge-customOff"} cPointer`}>{currentTag.Libelle}</span></div>
              ))}
            </div>
            <div className={`${styles.breakerTitre} mt-4 mb-4`}></div>

          <EditorContent editor={editor} style={{ border: "1px solid #ccc", padding: "1em", minHeight: "300px" }} />

          {!article ? 
          <button className="mb-5"
            type="button"
            onClick={() => {
              handleCreateNewArticle();
            }}
            style={{ marginTop: "1em" }}
          >
            Sauvegarder l’article
          </button>
          :
          <>
            <button className="mb-5"
              type="button"
              onClick={() => {
                handleEditCurrentArticle();
              }}
              style={{ marginTop: "1em" }}
            >
              Mettre à jour l'article
            </button>
            <LinkToURL to={`/article/${slug}`}>
              <button className="mb-5 ms-3"
                type="button"
                style={{ marginTop: "1em" }}
              >
                Consulter l'article
              </button>
            </LinkToURL>
          </>
          }
            <div className={styles.bandeauBoutonsEditArticle}>
              <div className="container-xl mt-4">
                <div className="row">
                  <div className="col-12 col-lg-12">
                    <div style={{ marginBottom: "1em", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          const color = prompt("Choisis une couleur (ex: red, #ff0000, rgb(255,0,0)) :");
                          if (color) {
                            editor.chain().focus().setColor(color).run();
                          }
                        }}
                      >
                        Couleur texte
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().unsetColor().run()}
                      >
                        Supprimer couleur
                      </button>

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
                        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                        style={{ fontWeight: editor.isActive("heading", { level: 4 }) ? "bold" : "normal" }}
                      >
                        H4
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                        style={{ fontWeight: editor.isActive("heading", { level: 5 }) ? "bold" : "normal" }}
                      >
                        H5
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                        style={{ fontWeight: editor.isActive("heading", { level: 6 }) ? "bold" : "normal" }}
                      >
                        H6
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
                        onClick={insertAnchor}
                      >
                        Insérer ancre
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const { from, to } = editor.state.selection;
                          const selectedText = editor.state.doc.textBetween(from, to, "\n");

                          if (!selectedText) {
                            // rien de sélectionné → on insère un cadre vide
                            editor.chain().focus().insertContent('<div class="article-box"><p>Ton texte ici</p></div>').run();
                            return;
                          }

                          // on supprime la sélection
                          editor.chain().focus().deleteRange({ from, to }).run();

                          // on insère le texte sélectionné dans le cadre
                          editor.chain().focus().insertContent(`<div class="article-box"><p>${selectedText}</p></div>`).run();
                        }}
                      >
                        Cadre
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!editor) return;
                          // Insère un paragraphe vide pour créer un "espace"
                          editor.chain().focus().insertContent('<p><br></p>').run();
                        }}
                      >
                        Ajouter un saut
                      </button>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
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
