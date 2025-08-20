export const fieldGridItem = (theme) => ({
  marginBottom: theme.spacing(3),
});

export const fieldLabel = (theme) => ({
  width: "100%",
  color: theme.palette.text.secondary,
  fontSize: ".8rem",
  paddingLeft: theme.spacing(0.5),
});

export const fieldLabelText = (theme) => ({
  width: "calc(100% - 2rem)",
  paddingLeft: theme.spacing(0.5),
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
};

export const fieldSelectItem = {
  width: "calc(100% - 3rem)",
};

export const fieldLabelDataTrackerLink = (theme) => ({
  width: "calc(100% - 2rem)",
  paddingLeft: theme.spacing(0.5),
});
