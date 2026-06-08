// import React,{useState,useEffect}from "react";
// import { useDispatch,useSelector } from "react-redux";
// import { getAllClientes } from "../../redux/action";
// import dashboardStyles from "../panelAdminDashboard.module.css";


// const ClienteList=()=>{
//     const dispatch=useDispatch();
//     const allClientes=useSelector((state)=>state.allClientes)


//     useEffect(()=>{
//         dispatch(getAllClientes());
//     },[dispatch]);



//     return (
//         <div>
//             <h2 className={dashboardStyles.headerTitle}>Listado de clientes</h2>
//             <div className={dashboardStyles.cardGrid}>
//                 {allClientes.map((cliente) => (
//                     <div key={cliente.id_cliente} className={dashboardStyles.card}>
//                         <div className={dashboardStyles.cardTitle}>ID: <span className={dashboardStyles.cardValue}>{cliente.id_cliente}</span></div>
//                         <div><strong>Nombre:</strong> {cliente.nombre}</div>
//                         <div><strong>Apellido:</strong> {cliente.apellido}</div>
//                         <div><strong>Correo:</strong> {cliente.correo}</div>
//                         <div><strong>Dirección:</strong> {cliente.direccion}</div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }



// export  default ClienteList