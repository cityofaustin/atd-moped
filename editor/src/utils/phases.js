import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import theme from "src/theme";

export const defaultIcon = HelpOutlineIcon;
export const defaultLabel = "Unknown";

/**
 * Font colors
 */
const primary = theme?.palette?.text?.primary;
const white = theme?.palette?.background?.paper;

/**
 * Background color mapping
 */
const backgroundColors = {
  default: theme?.palette?.grey?.[300],
  warning: theme?.palette?.warning?.light,
  success: theme?.palette?.success?.light,
  info: theme?.palette?.info?.main,
  error: theme?.palette?.error?.main,
};

/**
 * Main style configuration per phase name, containing font `color`, chip `background` color and the icon.
 */
export const styleMapping = {
  planned: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  preliminary_engineering: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  scoping: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  preliminary_design: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  design: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  pre_construction: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  bid_award_execution: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  construction_ready: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  construction: {
    color: primary,
    background: backgroundColors.warning,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  post_construction: {
    color: white,
    background: backgroundColors.info,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  potential: {
    color: primary,
    background: backgroundColors.default,
    icon: RemoveCircleOutlineOutlinedIcon,
  },
  canceled: {
    color: white,
    background: backgroundColors.error,
    icon: CancelOutlinedIcon,
  },
  on_hold: {
    color: primary,
    background: backgroundColors.default,
    icon: PauseCircleOutlineOutlinedIcon,
  },
  complete: {
    color: white,
    background: backgroundColors.info,
    icon: CheckCircleOutlineOutlinedIcon,
  },
  default: {
    color: primary,
    background: backgroundColors.default,
    icon: defaultIcon,
  },
};
