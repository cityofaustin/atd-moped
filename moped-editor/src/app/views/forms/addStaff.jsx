 import React from "react";
// import { useFormContext } from "react-hook-form";
 import { Breadcrumb } from "matx";
// import MaterialTable from 'material-table';
// import { forwardRef } from 'react';
// import {AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, DeleteOutline, Clear, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn }from '@material-ui/icons';

// // const tableIcons = {
// //     Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
// //     Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
// //     Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
// //     Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
// //     DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
// //     Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
// //     Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
// //     Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
// //     FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
// //     LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
// //     NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
// //     PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
// //     ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
// //     Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
// //     SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
// //     ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
// //     ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
// //   };


  function AddStaff() {
//   // const methods = useFormContext();
//   // const { register, handleSubmit, setValue, control, reset } = methods;
//   // const { useState } = React;
//   // useEffect(() => {
//   //   reset({ ...formContent.two }, { errors: true });
//   // }, []);

//   // const [columns, setColumns] = useState([
//   //   { title: 'Name', field: 'name', initialEditValue: '' },
//   //   { title: 'Role', field: 'Role', lookup: {
//   //     1: 'Owner', 2: 'Team Member', 3: 'Executive Sponsor'
//   //   } },
//   //   { title: 'Work Group', field: 'WorkGroup', lookup: { 1: 'Signals', 2: 'Division', 3: 'Manager'} },
//   //   {
//   //     title: 'Division',
//   //     field: 'Division',
//   //     lookup: { 1: 'Arterial Management', 2: 'Choice 2' },
//   //   },
//   // ]);

//   // const [data, setData] = useState([
//   //   { name: 'Renee Orr', role: 1, workgroup: 2, division: 1 },
//   //   { name: 'Judith Olvera', role: 2, workgroup: 3, division: 1 },
//   //   { name: 'Scott Feldman', role: 3, workgroup: 1, division: 1 },
//   //   { name: 'Jen Duthie', role: 2, workgroup: 1, division: 1 },
//   // ]);

  return (
    <div>
    <Breadcrumb
    routeSegments={[
      { name: "Forms", path: "/addStaff" },
      { name: "Add Staff" }
    ]}
  /> 
    
       <h1>Add Staff</h1>
       {/* <MaterialTable
//       title="Editable Preview"
//       icons={tableIcons}
//       columns={columns}
//       data={data}
//       editable={{
//         onRowAdd: newData =>
//           new Promise((resolve, reject) => {
//             setTimeout(() => {
//               setData([...data, newData]);
              
//               resolve();
//             }, 1000)
//           }),
//         onRowUpdate: (newData, oldData) =>
//           new Promise((resolve, reject) => {
//             setTimeout(() => {
//               const dataUpdate = [...data];
//               const index = oldData.tableData.id;
//               dataUpdate[index] = newData;
//               setData([...dataUpdate]);
//               resolve();
//             }, 1000)
//           }),
//         onRowDelete: oldData =>
//           new Promise((resolve, reject) => {
//             setTimeout(() => {
//               const dataDelete = [...data];
//               const index = oldData.tableData.id;
//               dataDelete.splice(index, 1);
//               setData([...dataDelete]);
              
//               resolve()
//             }, 1000)
//           }),
//       }}
//     /> */}
     </div>
   );
 }


export default AddStaff;


