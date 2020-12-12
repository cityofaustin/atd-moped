import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NavLink as RouterLink } from "react-router-dom";
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    makeStyles, Link,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles(() => ({
    root: {},
    tableCell: {
        "text-transform": "capitalize"
    }
}));


const ProjectsTable = ({ projects }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <PerfectScrollbar>
                <Box minWidth={1050}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell> </TableCell>
                                <TableCell>Project Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date Added</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>Capitally Funded</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.map(project => (
                                <TableRow hover key={project.project_id}>
                                    <TableCell align="center">
                                        <RouterLink to={`/moped/project/${project.project_id}`}>
                                            <EditIcon color="primary" />
                                        </RouterLink>
                                    </TableCell>
                                    <TableCell className={classes.tableCell}><Link href={"/moped/project/"+project.project_id}>{project.project_name}</Link></TableCell>
                                    <TableCell className={classes.tableCell}>{project.project_description}</TableCell>
                                    <TableCell className={classes.tableCell}>{project.current_status.replace('"', "")}</TableCell>
                                    <TableCell>{project.date_added}</TableCell>
                                    <TableCell>{project.start_date}</TableCell>
                                    <TableCell>{project.capitally_funded ? "Yes" : "No"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
        </Card>
    );
};

export default ProjectsTable;
