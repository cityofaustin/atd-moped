import { ListItem, ListItemText } from "@mui/material";

export const mopedUserAutocompleteProps = {
  getOptionLabel: (option) => {
    return option.user_id ? `${option.first_name} ${option.last_name}` : "";
  },
  // default is using the optionLabel as key, this prevents an error since users can have the same name
  getOptionKey: (option) => option.user_id,
  // custom renderOption prop to render user's email along with user name
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
