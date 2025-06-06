import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  FormControl,
  Paper,
  FormHelperText,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ProjectSaveButton from "src/views/projects/newProjectView/ProjectSaveButton";
import ToolbarPlugin from "src/views/projects/projectView/ToolbarPlugin";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $createParagraphNode, $getRoot, $isTextNode } from "lexical";
import { $isRootTextContentEmpty } from "@lexical/text";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListNode, ListItemNode } from "@lexical/list";
import EditorTheme from "src/views/projects/projectView/EditorTheme";
import NoteTypeRadioButtons from "src/views/projects/projectView/ProjectNotes/NoteTypeRadioButtons";

const useStyles = makeStyles((theme) => ({
  cancelButton: {
    margin: theme.spacing(1),
    position: "relative",
    color: theme.palette.secondary.dark,
  },
  contentEditable: {
    minHeight: "150px",
    width: "100%",
    padding: theme.spacing(2),
    fontSize: "1rem",
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
  },
  editorWrapper: {
    position: "relative",
  },
  showButtonItem: {
    margin: theme.spacing(2),
  },
  toolbarButtons: {
    backgroundColor: theme.palette.primary.main,
    "&:hover, &.Mui-focusVisible": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  startIcon: {
    margin: 0,
  },
}));

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed.
const onError = (error) => {
  console.error(error);
};

// On change, return editor content as HTML
const OnChangePlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const isEditorEmpty = $isRootTextContentEmpty();
        const htmlContent = isEditorEmpty
          ? null
          : $generateHtmlFromNodes(editor, null);

        onChange(htmlContent);
      });
    });
  }, [editor, onChange]);
  return null;
};

// On successful save, clear and refocus the editor
const OnSavePlugin = ({ noteAddSuccess }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    noteAddSuccess &&
      editor.update(() => {
        const root = $getRoot();
        root.clear();
      });
    editor.focus();
  }, [noteAddSuccess, editor]);
  return null;
};

// On edit, load the selected comment and refocus the editor
const OnEditPlugin = ({ htmlContent, editingNote }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const editorState = editor.getEditorState();
    const nodeMap = editorState._nodeMap;
    const textArray = [...nodeMap.entries()][2];
    const isTextInEditor = !!textArray;
    const isTextinDatabase = !!htmlContent;
    // If user clicks edit and there is a stored note and a clear editor,
    // populate editor with stored note
    editingNote &&
      !isTextInEditor &&
      isTextinDatabase &&
      editor.update(() => {
        // Remove any existing nodes from the EditorState to ensure there are no conflicts
        $getRoot()
          .getChildren()
          .forEach((node) => node.remove());
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlContent, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        // Append nodes serialized from html to EditorState
        nodes.forEach((node) => {
          // If this is a TextNode, this note was created as non-rich text. We need to wrap with a paragraph node.
          const isTextNode = $isTextNode(node);

          if (isTextNode) {
            // Create empty ParagraphNode, append TextNode, and then append ParagraphNode to root.
            const p = $createParagraphNode();
            p.append(node);

            $getRoot().append(p);
          } else {
            $getRoot().append(node);
          }
        });
      });
    editor.focus();
  }, [editingNote, htmlContent, editor]);
  return null;
};

const initialConfig = {
  namespace: "MyEditor",
  theme: EditorTheme,
  nodes: [LinkNode, ListNode, ListItemNode],
  onError,
};

/**
 * NoteInput component that allows users to add and edit notes.
 * @param {string} noteText - The text of the note
 * @param {function} setNoteText - Function to set the note text
 * @param {number} newNoteType - The type of the new note
 * @param {function} setNewNoteType - Function to set the new note type
 * @param {number} editingNoteType - The type of the note being edited
 * @param {function} setEditingNoteType - Function to set the editing note type
 * @param {boolean} isEditingNote - Flag indicating if the note is being edited
 * @param {boolean} noteAddLoading - Flag indicating if the note addition is loading
 * @param {boolean} noteAddSuccess - Flag indicating if the note was added successfully
 * @param {function} submitNewNote - Function to submit a new note
 * @param {function} submitEditNote - Function to submit an edited note
 * @param {function} cancelNoteEdit - Function to cancel note editing
 * @param {boolean} isStatusEditModal - Flag indicating if the note component is in a status edit modal
 * @param {Array|objects} noteTypes - Array of moped_note_type objects containing id, name and slug
 * @param {function} validator - Function to validate the note using Yup schema and validate()-generated errors
 * @returns JSX.Element
 */
const NoteInput = ({
  noteText,
  setNoteText,
  newNoteType,
  setNewNoteType,
  editingNoteType,
  setEditingNoteType,
  isEditingNote,
  noteAddLoading,
  noteAddSuccess,
  submitNewNote,
  submitEditNote,
  cancelNoteEdit,
  isStatusEditModal,
  noteTypes,
  validator = null,
}) => {
  const classes = useStyles();

  const [validationErrors, setValidationErrors] = useState(null);

  // Validate content when the note text or note type changes
  useEffect(() => {
    const errors = validator
      ? validator({ projectStatusUpdate: noteText })
      : null;

    if (errors) {
      setValidationErrors(errors);
    } else {
      setValidationErrors(null);
    }
  }, [noteText, newNoteType, editingNoteType, validator]);

  const onChange = (htmlContent) => {
    setNoteText(htmlContent);
  };

  return (
    <Container>
      <Grid container direction="column" spacing={1}>
        <Grid item xs={12} sm={12}>
          <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin noteAddSuccess={noteAddSuccess} classes={classes} />
            <Box className={classes.editorWrapper} pt={2}>
              <RichTextPlugin
                contentEditable={
                  <Paper elevation={2}>
                    <ContentEditable className={classes.contentEditable} />
                  </Paper>
                }
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <OnChangePlugin onChange={onChange} />
              <OnSavePlugin noteAddSuccess={noteAddSuccess} />
              <OnEditPlugin
                htmlContent={noteText}
                editingNote={isEditingNote}
              />
              <LinkPlugin />
              <ListPlugin />
            </Box>
          </LexicalComposer>
        </Grid>
        {validationErrors && (
          <Grid item xs={12}>
            {Object.values(validationErrors).map((error, index) => (
              <FormHelperText key={index} error>
                {error}
              </FormHelperText>
            ))}
          </Grid>
        )}
        {
          // only show Note Type Radio Buttons on Notes tab interface
          !isStatusEditModal && (
            <Grid
              item
              xs={12}
              display="flex"
              style={{ justifyContent: "flex-end" }}
            >
              <FormControl>
                {!isEditingNote ? (
                  <NoteTypeRadioButtons
                    defaultValue={newNoteType}
                    onChange={(e) => setNewNoteType(Number(e.target.value))}
                    noteTypes={noteTypes}
                  />
                ) : (
                  <NoteTypeRadioButtons
                    defaultValue={editingNoteType}
                    onChange={(e) => setEditingNoteType(Number(e.target.value))}
                    noteTypes={noteTypes}
                  />
                )}
              </FormControl>
            </Grid>
          )
        }
        <Grid item>
          <Box pb={2} display="flex" style={{ justifyContent: "flex-end" }}>
            {isEditingNote && (
              <div className={classes.cancelButton}>
                <Button variant="text" onClick={cancelNoteEdit}>
                  Cancel
                </Button>
              </div>
            )}
            <ProjectSaveButton
              // disable save button if no text
              disabled={!noteText || Boolean(validationErrors)}
              label={<>Save</>}
              loading={noteAddLoading}
              success={noteAddSuccess}
              handleButtonClick={isEditingNote ? submitEditNote : submitNewNote}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NoteInput;
