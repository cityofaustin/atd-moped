import React from "react";
import { Chip } from "@material-ui/core";

import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import PauseCircleOutlineOutlinedIcon from "@material-ui/icons/PauseCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import PlayCircleOutlineOutlinedIcon from "@material-ui/icons/PlayCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";

import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

/**
 * Picks the right color based on the status-phase combination
 */
const useFontColorStyles = makeStyles(theme => ({
  root: {
    // Find text color
    color: props => {
      const status = props?.status ?? 0;
      const phase = (props?.phase ?? "").toLowerCase();
      const primary = theme.palette.text.primary;
      const white = theme.palette.common.white;

      return status === 1
        ? ["potential"].includes(phase) // this list may grow
          ? primary
          : white
        : ["on hold"].includes(phase) // same here
        ? primary
        : white;
    },
  },
}));

/**
 * Picks the right chip color based on status-phase combination
 */
const useChipStyles = makeStyles(theme => ({
  root: {
    marginLeft: "1rem",
    fontWeight: "500",
    fontSize: "16px",
    fontFamily: "Roboto",
    textTransform: "capitalize",
    borderRadius: "2rem",
    height: "2.5rem",
    padding: ".5rem",

    // Find background color
    backgroundColor: props => {
      const status = props?.status ?? 0;
      const phase = props?.phase ?? "";

      // Phase Value
      const phaseValue = {
        planned: theme.palette.info.dark,
        potential: theme.palette.warning.light,
      };

      return status === 1
        ? Object.keys(phaseValue).includes(phase)
          ? phaseValue[phase]
          : theme.palette.primary.main
        : status === 4
        ? theme.palette.grey[300] // on hold
        : theme.palette.error.main; // cancelled
    },
  },
}));

/**
 * Renders a chip
 * @param {number} status - The status id of the current project
 * @param {string} phase - The current phase name of the project
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectStatusBadge = ({ status, phase }) => {
  /**
   * Bundle style properties object
   */
  const styleProps = {
    status: status,
    phase: phase,
  };

  /**
   * Generate font, chip and icon classes
   */
  const chipClasses = useChipStyles(styleProps);
  const iconClasses = useFontColorStyles(styleProps);

  /**
   * Phase icon mapping to component objects
   */
  const phaseIcons = {
    canceled: CancelOutlinedIcon,
    "on hold": PauseCircleOutlineOutlinedIcon,
    potential: RemoveCircleOutlineOutlinedIcon,
    planned: PlayCircleOutlineOutlinedIcon,
    complete: CheckCircleOutlineOutlinedIcon,
  };

  /**
   * Returns the label given a status-phase combination
   * @param status
   * @param phase
   * @returns {string}
   */
  const getComponentMapName = (status, phase) =>
    status !== 1 ? (status === 4 ? "on hold" : "canceled") : phase;

  /**
   * Create an abstract component pointer
   */
  const ChipIcon = phaseIcons?.[getComponentMapName(status, phase)] ?? null;

  /**
   * Return the object
   */
  return (
    ChipIcon && (
      <Chip
        className={clsx(iconClasses.root, chipClasses.root)}
        icon={<ChipIcon className={iconClasses.root} />}
        label={getComponentMapName(status, phase)}
        color={"default"}
        onDelete={null}
        deleteIcon={null}
      />
    )
  );
};

export default ProjectStatusBadge;
