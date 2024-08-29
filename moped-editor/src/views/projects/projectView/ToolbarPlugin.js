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
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, $isListNode, $isListItemNode } from "@lexical/list";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";

const richTextAction = {
  bold: "bold",
  italics: "italics",
  underline: "underline",
  strikethrough: "strikethrough",
  highlight: "highlight",
  number: "number",
  bullet: "bullet",
  link: "link",
  left: "left",
  center: "center",
  right: "right",
  justify: "justify",
  divider: "divider",
  undo: "undo",
  redo: "redo",
  clear: "clear"
}

const RICH_TEXT_OPTIONS = [
  { id: richTextAction.bold, icon: <FormatBold />, label: "Bold" },
  { id: richTextAction.italics, icon: <FormatItalic />, label: "Italics" },
  { id: richTextAction.underline, icon: <FormatUnderlined />, label: "Underline" },
  {
    id: richTextAction.strikethrough,
    icon: <FormatStrikethrough />,
    label: "Strikethrough",
  },
  {
    id: richTextAction.highlight,
    icon: <Highlight />,
    label: "Highlight",
  },
  { id: richTextAction.divider },

  {
    id: richTextAction.number,
    icon: <FormatListNumbered />,
    label: "Numbered list",
  },
  {
    id: richTextAction.bullet,
    icon: <FormatListBulleted />,
    label: "Bulleted list",
  },
  {
    id: richTextAction.link,
    icon: <Link />,
    label: "Link",
  },
  { id: richTextAction.divider },
  {
    id: richTextAction.left,
    icon: <FormatAlignLeft />,
    label: "Align Left",
  },
  {
    id: richTextAction.center,
    icon: <FormatAlignCenter />,
    label: "Align Center",
  },
  {
    id: richTextAction.right,
    icon: <FormatAlignRight />,
    label: "Align Right",
  },
  {
    id: richTextAction.justify,
    icon: <FormatAlignJustify />,
    label: "Align Justify",
  },

  { id: richTextAction.divider },
  {
    id: richTextAction.undo,
    icon: <Undo />,
    label: "Undo",
  },
  {
    id: richTextAction.redo,
    icon: <Redo />,
    label: "Redo",
  },
  {
    id: richTextAction.clear,
    icon: <FormatClear />,
    label: "Clear formatting",
  },
];

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [disableMap, setDisableMap] = useState({
    [richTextAction.undo]: true,
    [richTextAction.redo]: true
  });
  const [selectionMap, setSelectionMap] = useState({});

  const checkListType = (selection, listType) => {
    let hasListType = false;
    const selectedNodes = selection.getNodes();
    selectedNodes.forEach((selectedNode) => {
      const selectedNodeParent = selectedNode.getParent()
      // Check for list formatting and confirm the list type
      if ($isListNode(selectedNodeParent)) {
        hasListType = selectedNodeParent.__listType === listType;
      }
      // Check for a list item and confirm the parent list type
      if ($isListItemNode(selectedNodeParent)) {
        const selectedNodeGrandparent = selectedNodeParent.getParent();
        hasListType = selectedNodeGrandparent.__listType === listType;
      }
    })
    return hasListType;
  };

  // Checks for selected list formatting, removes if already applied or adds if not applied
  const handleListUpdate = (command, listType) => {
    const isListApplied = selectionMap[listType];
    isListApplied ?
      editor.dispatchCommand(REMOVE_LIST_COMMAND) :
      editor.dispatchCommand(command);
  };

  const checkLink = (selection) => {
    let isLink = false;
    const selectedNodes = selection.getNodes();
    selectedNodes.forEach((selectedNode) => {
      const selectedNodeParent = selectedNode.getParent()
      if ($isLinkNode(selectedNodeParent)) {
        isLink = true
      }
    })
    return isLink;
  };

  // to do: add url validation and figure out why links are not opening in a new tab
  const handleLinkUpdate = () => {
    const isLinkApplied = selectionMap["link"];
    isLinkApplied ?
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
      :
      navigator.clipboard.readText().then(val => {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
          url: val, target: "_blank"
        })
      }).catch(err => {
        console.error('Failed to read clipboard contents: ', err);
      })
  };

  // to do: for some reason you can't clear a link and a list at the same time
  const clearFormatting = () => {
    const formatTypes = Object.keys(selectionMap);
    formatTypes.forEach((formatType) => {
      if (selectionMap[formatType]) {
        onAction(formatType);
      }
    });
  };

  // to do: for some reason the link and list buttons can't be active at the same time (even through formatting is applied)
  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [richTextAction.bold]: selection.hasFormat("bold"),
        [richTextAction.italics]: selection.hasFormat("italic"),
        [richTextAction.underline]: selection.hasFormat("underline"),
        [richTextAction.strikethrough]: selection.hasFormat("strikethrough"),
        [richTextAction.highlight]: selection.hasFormat("highlight"),
        [richTextAction.number]: checkListType(selection, "number"),
        [richTextAction.bullet]: checkListType(selection, "bullet"),
        [richTextAction.link]: checkLink(selection),
      }
      setSelectionMap(newSelectionMap)
    }
  }

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

  // to do: add custom styling
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
        handleLinkUpdate();
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
      case "clear":
        clearFormatting();
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
          id === richTextAction.Divider ? (
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
