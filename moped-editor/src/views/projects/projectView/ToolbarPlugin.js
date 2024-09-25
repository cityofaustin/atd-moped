import { useCallback, useEffect, useState } from "react";

import {
  Box,
  ButtonGroup,
  Button,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
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
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";

const richTextAction = {
  bold: "bold",
  italics: "italics",
  underline: "underline",
  number: "number",
  bullet: "bullet",
  link: "link",
  divider: "divider",
  clear: "clear"
}

const RICH_TEXT_OPTIONS = [
  { id: richTextAction.bold, icon: <FormatBold />, label: "Bold" },
  { id: richTextAction.italics, icon: <FormatItalic />, label: "Italics" },
  { id: richTextAction.underline, icon: <FormatUnderlined />, label: "Underline" },
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
    id: richTextAction.clear,
    icon: <FormatClear />,
    label: "Clear formatting",
  },
];

  // Iterate through selected node and parent nodes and returns any applicable list type
  const checkListType = (selection, listType) => {
    let hasListType = false;
    const selectedNodes = selection.getNodes();
    selectedNodes.forEach((node) => {
      const nodeParents = node.getParents();
      nodeParents.forEach((parent) => {
        if (parent.__listType === listType) {
          hasListType = true;
        }
      })
    })
    return hasListType;
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

const ToolbarPlugin = ({ noteAddSuccess, classes }) => {
  const [editor] = useLexicalComposerContext();

  const [selectionMap, setSelectionMap] = useState({});

  // Checks for selected list formatting, removes if already applied or adds if not applied
  const handleListUpdate = useCallback((command, listType) => {
    const isListApplied = selectionMap[listType];
    isListApplied ?
      editor.dispatchCommand(REMOVE_LIST_COMMAND) :
      editor.dispatchCommand(command);
  }, [editor, selectionMap]);

  const handleLinkUpdate = useCallback(() => {
    editor.update(() => {
      const isLinkApplied = selectionMap["link"];
      const selection = $getSelection();
      const textContent = selection.getTextContent();
   
      isLinkApplied
        ? editor.dispatchCommand(TOGGLE_LINK_COMMAND, null) // Remove link if already applied
        : editor.dispatchCommand(TOGGLE_LINK_COMMAND, textContent); // Make selected text into a link
    });
  }, [editor, selectionMap]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [richTextAction.bold]: selection.hasFormat("bold"),
        [richTextAction.italics]: selection.hasFormat("italic"),
        [richTextAction.underline]: selection.hasFormat("underline"),
        [richTextAction.number]: checkListType(selection, "number"),
        [richTextAction.bullet]: checkListType(selection, "bullet"),
        [richTextAction.link]: checkLink(selection),
      }
      setSelectionMap(newSelectionMap)
    }
  }, []);

  const getSelectedButtonProps = (isSelected) =>
    isSelected
      ? {
        className: classes.toolbarButtons
      }
      : {};

  const onAction = useCallback((id) => {
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
      case "number":
        handleListUpdate(INSERT_ORDERED_LIST_COMMAND, "number");
        break;
      case "bullet":
        handleListUpdate(INSERT_UNORDERED_LIST_COMMAND, "bullet");
        break;
      case "link":
        handleLinkUpdate();
        break;
      case "clear":
        const formatTypes = Object.keys(selectionMap);
        formatTypes.forEach((formatType) => {
          if (selectionMap[formatType]) {
            onAction(formatType);
          }
        });
        break;
      default:
        break;
    }
  }, [editor, handleLinkUpdate, handleListUpdate, selectionMap])

  useEffect(() => {
    // Update toolbar and other UI elements when certain commands are sent or
    // update listeners are triggered in editor
    // More on update listeners: https://lexical.dev/docs/concepts/listeners
    // More on commands: https://lexical.dev/docs/concepts/commands
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
      ))
  }, [editor, updateToolbar]);

  // Clear editor formatting when note is saved successfully
  useEffect(() => {
    if (noteAddSuccess) {
      onAction("clear");
    }
  }, [noteAddSuccess, onAction]);

  return (
    <Box
      paddingTop="16px"
      display="flex"
      justifyContent="left"
    >
      <ButtonGroup
        size="xs"
        variant="ghost"
      >
        {RICH_TEXT_OPTIONS.map(({ id, label, icon }, key) =>
          id === richTextAction.divider ? (
            <Button key={key} disabled />
          ) : (
            <Button
              key={key}
              classes={{ startIcon: classes.startIcon }}
              aria-label={label}
              startIcon={icon}
              onClick={() => onAction(id)}
              {...getSelectedButtonProps(selectionMap[id])}
            />
          )
        )}
      </ButtonGroup>
    </Box>
  );
}

export default ToolbarPlugin;
