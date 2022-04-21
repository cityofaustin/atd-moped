// copied and adapted from 
// https://github.com/material-table-core/core/blob/master/src/components/MTableToolbar/index.js

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten, withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React, { useState } from 'react';


export function MTableToolbar(props) {
  const [columnsButtonAnchorEl, setColumnsButtonAnchorEl] = useState(null);

  function renderDefaultActions() {
    const localization = {
      ...MTableToolbar.defaultProps.localization,
      ...props.localization
    };
    const { classes } = props;

    return (
      <div style={{ display: 'flex' }}>
        {props.columnsButton && (
          <span>
            <Tooltip title={localization.showColumnsTitle}>
              <IconButton
                color="inherit"
                onClick={(event) =>
                  setColumnsButtonAnchorEl(event.currentTarget)
                }
                aria-label={localization.showColumnsAriaLabel}
              >
                <props.icons.ViewColumn />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={columnsButtonAnchorEl}
              open={Boolean(columnsButtonAnchorEl)}
              onClose={() => setColumnsButtonAnchorEl(null)}
            >
              <MenuItem
                key={'text'}
                disabled
                style={{
                  opacity: 1,
                  fontWeight: 600,
                  fontSize: 12
                }}
              >
                {localization.addRemoveColumns}
              </MenuItem>

              {/**
               * Add columns to the Columns Button Menu
               * aka the menu that pops up when `MaterialTable.options.columnsButton` is true
               */}
              {props.columns.map((col) => {
                const hiddenFromColumnsButtonMenu =
                  col.hiddenByColumnsButton !== undefined
                    ? col.hiddenByColumnsButton
                    : props.columnsHiddenInColumnsButton;

                if (hiddenFromColumnsButtonMenu) {
                  return null;
                }

                return (
                  <li key={col.tableData.id}>
                    <MenuItem
                      className={classes.formControlLabel}
                      component="label"
                      htmlFor={`column-toggle-${col.tableData.id}`}
                      disabled={col.removable === false}
                    >
                      <Checkbox
                        checked={!col.hidden}
                        id={`column-toggle-${col.tableData.id}`}
                        onChange={() => {
                          props.setHiddenColumns({...props.columnConfiguration, [col.field]: !col.hidden,} )
                          props.onColumnsChanged(col, !col.hidden);
                        }}
                      />
                      <span>{col.title}</span>
                    </MenuItem>
                  </li>
                );
              })}
              {/** End Add columns to the Columns Button Menu */}
            </Menu>
          </span>
        )}
      </div>
    );
  }

  function renderSelectedActions() {
    return (
      <React.Fragment>
        <props.components.Actions
          actions={props.actions.filter(
            (a) => a.position === 'toolbarOnSelect'
          )}
          data={props.selectedRows}
          components={props.components}
        />
      </React.Fragment>
    );
  }

  function renderActions() {
    const { classes } = props;

    return (
      <div className={classes.actions}>
        <div>
          {props.selectedRows && props.selectedRows.length > 0
            ? renderSelectedActions()
            : renderDefaultActions()}
        </div>
      </div>
    );
  }

  function render() {
    const { classes } = props;
    return (
      <Toolbar
        ref={props.forwardedRef}
        className={classNames(classes.root, {
          [classes.highlight]:
            props.showTextRowsSelected &&
            props.selectedRows &&
            props.selectedRows.length > 0
        })}
      >
        <div className={classes.spacer} />
        {renderActions()}
      </Toolbar>
    );
  }

  return render();
}

MTableToolbar.defaultProps = {
  actions: [],
  columns: [],
  columnsHiddenInColumnsButton: false, // By default, all columns are shown in the Columns Button (columns action when `options.columnsButton = true`)
  columnsButton: false,
  localization: {
    addRemoveColumns: 'Add or remove columns',
    showColumnsTitle: 'Show Columns',
    showColumnsAriaLabel: 'Show Columns',
  },
  showTitle: true,
  showTextRowsSelected: true,
  toolbarButtonAlignment: 'right',
  selectedRows: [],
  title: 'No Title!'
};


export const styles = (theme) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: '1 1 10%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    overflow: 'hidden'
  },
  formControlLabel: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
});

const MTableToolbarRef = React.forwardRef(function MTableToolbarRef(
  props,
  ref
) {
  return <MTableToolbar {...props} forwardedRef={ref} />;
});

export default withStyles(styles, { name: 'MTableToolbar' })(MTableToolbarRef);
