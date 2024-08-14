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
import { HeadingTagType, $createHeadingNode } from "@lexical/rich-text";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, insertList, removeList } from "@lexical/list";
import { $wrapNodes } from "@lexical/selection";

const RichTextAction = {
  Bold: "bold",
  Italics: "italics",
  Underline: "underline",
  Strikethrough: "strikethrough",
  Highlight: "highlight",
  ListOrdered: "formatListNumbered",
  ListUnordered: "formatListBulleted",
  Link: "link",
  LeftAlign: "leftAlign",
  CenterAlign: "centerAlign",
  RightAlign: "rightAlign",
  JustifyAlign: "justifyAlign",
  Divider: "divider",
  Undo: "undo",
  Redo: "redo",
  Clear: "formatClear"
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
    id: RichTextAction.ListOrdered,
    icon: <FormatListNumbered />,
    label: "Ordered list",
  },
  {
    id: RichTextAction.ListUnordered,
    icon: <FormatListBulleted />,
    label: "Unordered list",
  },
  {
    id: RichTextAction.Link,
    icon: <Link />,
    label: "Link",
  },
  { id: RichTextAction.Divider },
  {
    id: RichTextAction.LeftAlign,
    icon: <FormatAlignLeft />,
    label: "Align Left",
  },
  {
    id: RichTextAction.CenterAlign,
    icon: <FormatAlignCenter />,
    label: "Align Center",
  },
  {
    id: RichTextAction.RightAlign,
    icon: <FormatAlignRight />,
    label: "Align Right",
  },
  {
    id: RichTextAction.JustifyAlign,
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

  editor.registerCommand(INSERT_UNORDERED_LIST_COMMAND, () => {
    insertList(editor, 'bullet');
    return true;
}, COMMAND_PRIORITY_LOW);

  const onAction = (id) => {
    console.log(id);
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
      case "formatListNumbered":
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        break;
      case "formatListBulleted":
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        break;
      case "link":
        break;
      case "leftAlign":
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        break;
      case "centerAlign":
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        break;
      case "rightAlign":
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        break;
      case "justifyAlign":
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        break;
      case "undo":
        editor.dispatchCommand(UNDO_COMMAND, undefined);
        break;
      case "redo":
        editor.dispatchCommand(REDO_COMMAND, undefined);
        break;
      case "formatClear":
        break;
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
            />
          )
        )}
      </ButtonGroup>
    </Box>
  );
}

export default ToolbarPlugin;
