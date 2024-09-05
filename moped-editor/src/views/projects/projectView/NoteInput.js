import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ProjectSaveButton from "../newProjectView/ProjectSaveButton";
import ToolbarPlugin from "./ToolbarPlugin";

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot } from 'lexical';
import { $isRootTextContentEmpty } from '@lexical/text';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LinkNode } from '@lexical/link';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import PlaygroundEditorTheme from "./PlaygroundEditorTheme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  cancelButton: {
    margin: theme.spacing(1),
    position: "relative",
    color: theme.palette.secondary.dark,
  },
  contentEditable: {
    width: "100%",
    padding: "16px 16px",
    border: "4px solid",
    borderRadius: "8px",
    fontSize: "1rem",
    borderColor: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
  },
  placeholder: {
    position: "absolute",
    top: "36px",
    paddingLeft: "20px"
  },
  editorWrapper: {
    position: "relative"
  },
  showButtonItem: {
    margin: theme.spacing(2),
  },
  toolbarButtons: {
    backgroundColor: theme.palette.primary.main,
  },
  startIcon: {
    margin: 0,
    color: theme.palette.text.primary,
  }
}));

/**
 * Defines the NoteTypeRadioButtons that allow a user to select the note type of a
 * note they are creating or editing.
 * @param {integer} defaultValue - The note type id that determines which button option
 * should be selected/highlighted by default
 * @param {function} onChange - Callback function that runs when the note type is changed via button click
 * @return {JSX.Element}
 * @constructor
 */
const NoteTypeRadioButtons = ({ defaultValue, onChange }) => (
  <RadioGroup
    row
    value={defaultValue}
    onChange={onChange}
    sx={{ color: "black" }}
  >
    <FormControlLabel value={1} control={<Radio />} label="Internal note" />
    <FormControlLabel value={2} control={<Radio />} label="Status update" />
  </RadioGroup>
);

// const theme = {};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed.
const onError = (error) => {
  console.error(error);
}

// On change, return editor content as HTML
const OnChangePlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const isEditorEmpty = $isRootTextContentEmpty();
        const htmlContent = isEditorEmpty ? null : $generateHtmlFromNodes(editor, null);
        onChange(htmlContent);
      });
    });
  });
  return null;
}

// On successful save, clear and refocus the editor
const OnSavePlugin = ({ noteAddSuccess }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    noteAddSuccess && editor.update(() => {
      const root = $getRoot();
      root.clear();
    });
    editor.focus();
  }, [noteAddSuccess, editor]);
  return null;
}

// On edit, load the selected comment and refocus the editor
const OnEditPlugin = ({ htmlContent, editingNote }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const editorState = editor.getEditorState()
    const nodeMap = editorState._nodeMap;
    const textArray = [...nodeMap.entries()][2];
    const isTextInEditor = !!textArray;
    const isTextinDatabase = !!htmlContent;
    // If user clicks edit and there is a stored note and a clear editor,
    // populate editor with stored note
    editingNote && !isTextInEditor && isTextinDatabase &&
      editor.update(() => {
        $getRoot()
          .getChildren()
          .forEach((n) => n.remove());
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlContent, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        nodes.forEach((node) => {
          $getRoot().append(node);
        });
      });
    editor.focus();
  }, [editingNote, htmlContent, editor]);
  return null;
}

const NoteInput = ({
  noteText,
  setNoteText,
  newNoteType,
  setNewNoteType,
  editingNoteType,
  setEditingNoteType,
  editingNote,
  noteAddLoading,
  noteAddSuccess,
  submitNewNote,
  submitEditNote,
  cancelNoteEdit,
  isStatusEditModal,
}) => {
  const classes = useStyles();

  const initialConfig = {
    namespace: 'MyEditor',
    theme: PlaygroundEditorTheme,
    nodes: [
      LinkNode,
      ListNode,
      ListItemNode
    ],
    onError,
  };

  const onChange = (htmlContent) => {
    setNoteText(htmlContent);
  };

  return (
    <Container>
      <Grid container direction="column" spacing={1}>
        <Grid item xs={12} sm={12}>
          <LexicalComposer initialConfig={initialConfig} >
            <ToolbarPlugin noteAddSuccess={noteAddSuccess} classes={classes} />
            <Box className={classes.editorWrapper} pt={2}>
              <RichTextPlugin
                contentEditable={<ContentEditable className={classes.contentEditable} />}
                placeholder={<div className={classes.placeholder}>Enter some text...</div>}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <OnChangePlugin onChange={onChange} />
              <OnSavePlugin noteAddSuccess={noteAddSuccess} />
              <OnEditPlugin htmlContent={noteText} editingNote={editingNote} />
              <LinkPlugin />
              <ListPlugin />
            </Box>
          </LexicalComposer>
        </Grid>
        <Grid
          item
          xs={12}
          display="flex"
          style={{ justifyContent: "flex-end" }}
        >
          {!isStatusEditModal && (
            <FormControl>
              {!editingNote ? (
                <NoteTypeRadioButtons
                  defaultValue={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value)}
                ></NoteTypeRadioButtons>
              ) : (
                <NoteTypeRadioButtons
                  defaultValue={editingNoteType}
                  onChange={(e) => setEditingNoteType(e.target.value)}
                ></NoteTypeRadioButtons>
              )}
            </FormControl>
          )}
        </Grid>
        <Grid item>
          <Box pb={2} display="flex" style={{ justifyContent: "flex-end" }}>
            {editingNote && (
              <div className={classes.cancelButton}>
                <Button variant="text" onClick={cancelNoteEdit}>
                  Cancel
                </Button>
              </div>
            )}
            <ProjectSaveButton
              // disable save button if no text after removing html tags
              disabled={!noteText}
              label={<>Save</>}
              loading={noteAddLoading}
              success={noteAddSuccess}
              handleButtonClick={editingNote ? submitEditNote : submitNewNote}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NoteInput;
