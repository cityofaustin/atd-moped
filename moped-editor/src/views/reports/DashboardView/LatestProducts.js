import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import subHours from "date-fns/subHours";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import StorageIcon from "@material-ui/icons/Storage";
import BuildIcon from "@material-ui/icons/Build";
import BusinessIcon from "@material-ui/icons/Business";

const data = [
  {
    id: uuid(),
    name: "Finance Data",
    updatedAt: subHours(Date.now(), 2),
    imageUrl: <MonetizationOnIcon />,
  },
  {
    id: uuid(),
    name: "ATD Data Tracker",
    imageUrl: <StorageIcon />,
    updatedAt: subHours(Date.now(), 2),
  },
  {
    id: uuid(),
    name: "TXDOT Systems",
    imageUrl: <BusinessIcon />,
    updatedAt: subHours(Date.now(), 3),
  },
  {
    id: uuid(),
    name: "Finance Data",
    imageUrl: <MonetizationOnIcon />,
    updatedAt: subHours(Date.now(), 5),
  },
  {
    id: uuid(),
    name: "eCapris Project Reporting",
    imageUrl: <BuildIcon />,
    updatedAt: subHours(Date.now(), 9),
  },
];

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  image: {
    height: 48,
    width: 48,
  },
});

const LatestProducts = ({ className, ...rest }) => {
  const classes = useStyles();
  const [products] = useState(data);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        subtitle={`${products.length} in total`}
        title="Latest Data Syncs"
      />
      <Divider />
      <List>
        {products.map((product, i) => {
          return (
            <ListItem divider={i < products.length - 1} key={product.id}>
              <ListItemAvatar>{product.imageUrl}</ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={`Updated ${formatDistanceToNow(
                  new Date(product.updatedAt),
                  {
                    addSufix: true,
                  }
                )} ago`}
              />
              <IconButton edge="end" size="small">
                <MoreVertIcon />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string,
};

export default LatestProducts;
