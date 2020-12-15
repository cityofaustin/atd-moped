import React, {useEffect, useState} from "react";
import { useQuery } from "@apollo/react-hooks";

import {
    Box,
    Container,
    makeStyles,
    CircularProgress
} from "@material-ui/core";
import Page from "src/components/Page";
import ProjectsTable from "./ProjectsTable";
import Toolbar from "./Toolbar";
import {GQLAbstract} from "atd-kickstand";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: "100%",
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
    },
}));

const projectsQueryConf = {
    table: "moped_project",
    single_item: "project",
    showDateRange: false,
    columns: {
        project_id: {
            primary_key: true,
            searchable: false,
            sortable: false,
            label_search: "Search by Project ID",
            label_table: "Project ID",
            type: "Int",
        },
        project_name: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Project Name",
            type: "String",
        },
        project_description: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Description",
            type: "String",
        },
        current_status: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Status",
            type: "String",
        },
        date_added: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Date Added",
            type: "String",
        },
        start_date: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Start Date",
            type: "String",
        },
        capitally_funded: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Capitally Funded",
            type: "String",
        }
    },
    order_by: {},
    where: {},
    limit: 25,
    offset: 0,
};

let projectsQuery = new GQLAbstract(projectsQueryConf);

const StaffListView = () => {
    const classes = useStyles();
    const { data, loading, error } = useQuery(projectsQuery.gql);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [projectList, setProjectList] = useState([]);

    if (error) {
        console.log(error);
    }

    const filterSearch = (event) => {
        setSearchKeyword(event.target.value);
    }

    useEffect(() => {
        if (data) {
            const currentProjectList = data.moped_project.filter((item) => {
                return item.project_name.toString().toLowerCase().includes(searchKeyword.toLowerCase());
            });
            setProjectList(currentProjectList);
        }
    }, [data, searchKeyword]);

    return (
        <Page className={classes.root} title="Projects">
            <Container maxWidth={false}>
                <Toolbar change={filterSearch} />
                <Box mt={3}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <ProjectsTable projects={projectList} />
                    )}
                </Box>
            </Container>
        </Page>
    );
};

export default StaffListView;
