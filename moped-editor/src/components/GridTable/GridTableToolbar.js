import React from "react";
import clsx from "clsx";

import {
    makeStyles,
} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    root: {},
    importButton: {
        marginRight: theme.spacing(1),
    },
    exportButton: {
        marginRight: theme.spacing(1),
    },
}));

const GridTableToolbar = ({ children, change, className, ...rest }) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            {children}
        </div>
    );
};

export default GridTableToolbar;
