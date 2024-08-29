import { useEffect, useState } from "react";

import {
  Box,
  ButtonGroup,
  Button,
  Divider
} from "@mui/material";
import {
  Redo,
  Undo,
  Highlight,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatAlignCenter,
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  FormatClear
} from "@mui/icons-material";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  COMMAND_PRIORITY_LOW
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

const RichTextAction = {
  Bold: "bold",
  Italics: "italics",
  Underline: "underline",
  Strikethrough: "strikethrough",
  Highlight: "highlight",
  Number: "number",
  Bullet: "bullet",
  Link: "link",
  Left: "left",
  Center: "center",
  Right: "right",
  Justify: "justify",
  Divider: "divider",
  Undo: "undo",
  Redo: "redo",
  Clear: "clear"
}

const RICH_TEXT_OPTIONS = [
  { id: RichTextAction.Bold, icon: <FormatBold />, label: "Bold" },
  { id: RichTextAction.Italics, icon: <FormatItalic />, label: "Italics" },
  { id: RichTextAction.Underline, icon: <FormatUnderlined />, label: "Underline" },
  {
    id: RichTextAction.Strikethrough,
    icon: <FormatStrikethrough />,
    label: "Strikethrough",
  },
  {
    id: RichTextAction.Highlight,
    icon: <Highlight />,
    label: "Highlight",
  },
  { id: RichTextAction.Divider },

  {
    id: RichTextAction.Number,
    icon: <FormatListNumbered />,
    label: "Numbered list",
  },
  {
    id: RichTextAction.Bullet,
    icon: <FormatListBulleted />,
    label: "Bulleted list",
  },
  {
    id: RichTextAction.Link,
    icon: <Link />,
    label: "Link",
  },
  { id: RichTextAction.Divider },
  {
    id: RichTextAction.Left,
    icon: <FormatAlignLeft />,
    label: "Align Left",
  },
  {
    id: RichTextAction.Center,
    icon: <FormatAlignCenter />,
    label: "Align Center",
  },
  {
    id: RichTextAction.Right,
    icon: <FormatAlignRight />,
    label: "Align Right",
  },
  {
    id: RichTextAction.Justify,
    icon: <FormatAlignJustify />,
    label: "Align Justify",
  },

  { id: RichTextAction.Divider },
  {
    id: RichTextAction.Undo,
    icon: <Undo />,
    label: "Undo",
  },
  {
    id: RichTextAction.Redo,
    icon: <Redo />,
    label: "Redo",
  },
  {
    id: RichTextAction.Clear,
    icon: <FormatClear />,
    label: "Clear formatting",
  },
];

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [disableMap, setDisableMap] = useState({
    [RichTextAction.Undo]: true,
    [RichTextAction.Redo]: true
  });
  const [selectionMap, setSelectionMap] = useState({});

  const checkListType = (selection, listType) => {
    let hasListType = false;
    const selectionNodes = selection.getNodes();
    selectionNodes.forEach((selectedNode) => {
      const selectedNodeParent = selectedNode.getParent()
      if (selectedNodeParent?.__type === "listitem") {
        const selectedNodeGrandparent = selectedNodeParent.getParent();
        hasListType = selectedNodeGrandparent.__listType === listType;
      }
    })
    return hasListType
  }

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [RichTextAction.Bold]: selection.hasFormat("bold"),
        [RichTextAction.Italics]: selection.hasFormat("italic"),
        [RichTextAction.Underline]: selection.hasFormat("underline"),
        [RichTextAction.Strikethrough]: selection.hasFormat("strikethrough"),
        [RichTextAction.Highlight]: selection.hasFormat("highlight"),
        [RichTextAction.Number]: checkListType(selection, "number"),
        [RichTextAction.Bullet]: checkListType(selection, "bullet"),
        // [RichTextAction.Link]: selection.hasFormat("link"),
      }
      setSelectionMap(newSelectionMap)
    }
  }

  // Checks for selected list formatting, removes if already applied or adds if not applied
  const handleListUpdate = (command, listType) => {
    const isListApplied = selectionMap[listType];
    isListApplied ?
      editor.dispatchCommand(REMOVE_LIST_COMMAND) :
      editor.dispatchCommand(command);
  };

  // const getLink = () => {
  //   navigator.clipboard.readText()
  //     .then(text => {
  //       console.log(text);
  //       return text;
  //     })
  //     .catch(err => {
  //       console.error('Failed to read clipboard contents: ', err);
  //     });
  // };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payLoad) => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payLoad) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            undo: !payLoad
          }))
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payLoad => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            redo: !payLoad
          }))
          return false;
        }),
        COMMAND_PRIORITY_LOW
      ))
  }, [editor]);

  const getSelectedButtonProps = (isSelected) =>
    isSelected
      ? {
        color: "success",
        variant: "contained"
      }
      : {};

  const onAction = (id) => {
    switch (id) {
      case "bold":
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      case "italics":
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      case "underline":
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      case "strikethrough":
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      case "highlight":
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        break;
      case "number":
        handleListUpdate(INSERT_ORDERED_LIST_COMMAND, "number");
        break;
      case "bullet":
        handleListUpdate(INSERT_UNORDERED_LIST_COMMAND, "bullet");
        break;
      case "link":
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
          url: navigator.clipboard.readText().then(val => {
            console.log(val);
            return val
          }), target: "_blank"
        })
        break;
      case "left":
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        break;
      case "center":
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        break;
      case "right":
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        break;
      case "justify":
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        break;
      case "undo":
        editor.dispatchCommand(UNDO_COMMAND, undefined);
        break;
      case "redo":
        editor.dispatchCommand(REDO_COMMAND, undefined);
        break;
      // case "clear":
      //   break;
    }
  }

  return (
    <Box
      paddingTop="16px"
    >
      <ButtonGroup
        size="xs"
        variant="ghost"
        color="#444"
      >
        {RICH_TEXT_OPTIONS.map(({ id, label, icon }) =>
          id === RichTextAction.Divider ? (
            <Divider orientation="vertical" flexItem />
          ) : (
            <Button
              aria-label={label}
              startIcon={icon}
              onClick={() => onAction(id)}
              disabled={disableMap[id]}
              {...getSelectedButtonProps(selectionMap[id])}
            />
          )
        )}
      </ButtonGroup>
    </Box>
  );
}

export default ToolbarPlugin;
