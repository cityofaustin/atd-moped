import { ListItem, ListItemText } from "@mui/material";

export const mopedUserAutocompleteProps = {
  getOptionLabel: (option) => {
    return option.user_id ? `${option.first_name} ${option.last_name}` : "";
  },
  getOptionKey: (option) => option.user_id,
  renderOption: (props, option) => {
    return (
      <ListItem {...props} key={option.user_id}>
        <ListItemText
          primary={`${option.first_name} ${option.last_name}`}
          secondary={option.email}
        />
      </ListItem>
    );
  },
};
