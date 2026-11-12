import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { type SvgIconComponent } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import theme, { phaseColors as backgroundColors } from "src/theme";

export const defaultIcon = HelpOutlineOutlinedIcon;
export const defaultLabel = "Unknown";

/**
 * Font colors
 */
const primary = theme.palette.text.primary;

/**
 * Main style configuration per phase name, containing font `color`, chip `background` color and the icon.
 */
export const styleMapping: Record<
  string,
  { color: string; background: string; icon: SvgIconComponent }
> = {
  planned: {
    color: primary,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  preliminary_engineering: {
    color: primary,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  scoping: {
    color: primary,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  preliminary_design: {
    color: primary,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  design: {
    color: primary,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  pre_construction: {
    color: primary,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  bid_award_execution: {
    color: primary,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  construction_ready: {
    color: primary,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  construction: {
    color: primary,
    background: backgroundColors.warning,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  post_construction: {
    color: primary,
    background: backgroundColors.info,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  potential: {
    color: primary,
    background: backgroundColors.potentialAndOnHold,
    icon: RemoveCircleOutlineOutlinedIcon,
  },
  canceled: {
    color: primary,
    background: backgroundColors.error,
    icon: CancelOutlinedIcon,
  },
  on_hold: {
    color: primary,
    background: backgroundColors.potentialAndOnHold,
    icon: PauseCircleOutlineOutlinedIcon,
  },
  complete: {
    color: primary,
    background: backgroundColors.info,
    icon: CheckCircleOutlineOutlinedIcon,
  },
  default: {
    color: primary,
    background: backgroundColors.default,
    icon: defaultIcon,
  },
};
