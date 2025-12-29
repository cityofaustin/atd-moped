export const fieldGridItem = (theme) => ({
  marginBottom: theme.spacing(2),
});

export const fieldLabel = (theme) => ({
  width: "100%",
  color: theme.palette.text.secondary,
  fontSize: ".8rem",
  paddingLeft: theme.spacing(0.5),
});

export const fieldLabelText = (theme) => ({
  width: "calc(100% - 2rem)",
  padding: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: theme.palette.background.summaryHover,
    borderRadius: theme.spacing(0.5),
    cursor: "pointer",
  },
  overflowWrap: "break-word",
});

export const fieldLabelTextNoHover = (theme) => ({
  width: "calc(100% - 2rem)",
  paddingLeft: theme.spacing(0.5),
  overflowWrap: "break-word",
});

export const fieldLabelTextSpanNoBorder = {
  borderBottom: "inherit",
};

export const fieldBox = {
  width: "100%",
  minWidth: 0, // Allow shrinking
  overflow: "hidden", // Prevent overflow
};

export const fieldSelectItem = {
  width: "calc(100% - 3rem)",
  minWidth: 0, // Allow shrinking
  "& .MuiSelect-select": {
    overflowWrap: "break-word",
    wordBreak: "break-word",
    whiteSpace: "normal",
  },
};

export const fieldLabelDataTrackerLink = (theme) => ({
  width: "calc(100% - 2rem)",
  paddingLeft: theme.spacing(0.5),
});
