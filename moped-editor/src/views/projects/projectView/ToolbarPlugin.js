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

// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

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
  { id: RichTextAction.Divider },
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
  // const [editor] = useLexicalComposerContext();

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
            />
          )
        )}
      </ButtonGroup>
    </Box>
  );
}

export default ToolbarPlugin;
