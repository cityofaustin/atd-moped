import Button from "@mui/material/Button";
import { CheckCircle, ContentCopy } from "@mui/icons-material";

// TODO:
// Update eCAPRIS subproject field to show the subproject id that is no longer a clickable link
// Update eCAPRIS subproject field with a clickable copy button with ContentCopy start icon
// Button copies eCAPRIS url in existing link code to the clipboard so it can be pasted in another tab (see CopyMugUsersButton for example code or VZ code)
// Button is outside ProjectSummaryLabel component so hover states don't overlap
// Button text updates from "COPY LINK" to "COPIED!" when clicked for feedback
// Button icon updates from ContentCopy to CheckCircle when clicked
// Replace link icon buttons in data dictionary with this component and move to be after "navigate to top" button

const CopyLinkButton = ({ linkToCopy }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(linkToCopy);
  };

  return (
    <Button variant="outlined" onClick={handleCopyClick}>
      Copy Link
    </Button>
  );
};

export default CopyLinkButton;
