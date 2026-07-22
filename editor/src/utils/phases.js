import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";

import theme from "src/theme";

export const defaultIcon = HelpOutlinedIcon;
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
    icon: PlayCircleOutlinedIcon,
  },
  preliminary_engineering: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlinedIcon,
  },
  scoping: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlinedIcon,
  },
  preliminary_design: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlinedIcon,
  },
  design: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlinedIcon,
  },
  pre_construction: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlinedIcon,
  },
  bid_award_execution: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlinedIcon,
  },
  construction_ready: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlinedIcon,
  },
  construction: {
    color: primary,
    background: backgroundColors.warning,
    icon: PlayCircleOutlinedIcon,
  },
  post_construction: {
    color: white,
    background: backgroundColors.info,
    icon: PlayCircleOutlinedIcon,
  },
  potential: {
    color: primary,
    background: backgroundColors.default,
    icon: RemoveCircleOutlinedIcon,
  },
  canceled: {
    color: white,
    background: backgroundColors.error,
    icon: CancelOutlinedIcon,
  },
  on_hold: {
    color: primary,
    background: backgroundColors.default,
    icon: PauseCircleOutlinedIcon,
  },
  complete: {
    color: white,
    background: backgroundColors.info,
    icon: CheckCircleOutlinedIcon,
  },
  default: {
    color: primary,
    background: backgroundColors.default,
    icon: defaultIcon,
  },
};
