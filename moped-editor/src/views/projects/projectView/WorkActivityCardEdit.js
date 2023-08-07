import { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CheckCircle } from "@mui/icons-material";
import {
  Button,
  TextField,
  Switch,
  FormControlLabel,
  FormHelperText,
  Divider,
} from "@mui/material";

export default function ActivityCardEdit({ activity, setEditId }) {
  return (
    <Card sx={{ marginBottom: "1rem" }}>
      <CardHeader
        action={
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircle />}
              type="submit"
              onClick={() => setEditId(null)}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CheckCircle />}
              type="submit"
              onClick={() => setEditId(null)}
            >
              Cancel
            </Button>
          </>
          //   <IconButton aria-label="settings" onClick={() => setEditId(null)}>
          //     <MoreVertIcon />
          //   </IconButton>
        }
        title={<Typography variant="h3">Work Activity</Typography>}
        subheader={"#104"}
      />
      <CardContent>
        <form>
          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Status"
                value={activity.moped_work_activity_status.name}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                autoFocus
                label="Status note"
                value={activity.status_note}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={6} md={3}>
              {/* <FormLabel id="roles-label">Contractor</FormLabel> */}
              <TextField
                size="small"
                fullWidth
                label="Contractor"
                value={activity.contractor}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Contract"
                value={activity.contract_number}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Work Assignment"
                value={activity.work_assignment_id}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Amount"
                value={activity.amount}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Workgroup"
                value={activity.implementation_workgroup}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Task order(s)"
                value={activity.task_orders
                  ?.map((tk) => tk.task_order)
                  .join(", ")}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Description"
                value={activity.description}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="h4">Updated</Typography>
            <Typography variant="body2" color="text.secondary">
              John Clary - 10m ago
            </Typography>
          </Grid>
          <Grid item></Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
