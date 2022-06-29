import * as React from "react";
import { NavLink as BaseNavLink } from "react-router-dom";

// Custom NavLink to preserve support for "activeClassName"
// see: https://reactrouter.com/docs/en/v6/upgrading/v5#remove-activeclassname-and-activestyle-props-from-navlink-
const NavLink = React.forwardRef(
  ({ activeClassName, activeStyle, ...props }, ref) => {
    return (
      <BaseNavLink
        ref={ref}
        {...props}
        className={({ isActive }) =>
          [props.className, isActive ? activeClassName : null]
            .filter(Boolean)
            .join(" ")
        }
        style={({ isActive }) => ({
          ...props.style,
          ...(isActive ? activeStyle : null),
        })}
      />
    );
  }
);

export default NavLink;
