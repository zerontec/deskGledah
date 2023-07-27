import React from 'react';


const PosPage = () => (
    <>
 
   
    </>
  );

export default PosPage;





// COMPONENTE DDDE COMPRA 
// import React, { useState } from 'react';
// import { Box, Button, Grid, TextField, Typography } from '@mui/material';
// import styled from 'styled-components';

// const FormContainer = styled(Grid)`
//   margin-bottom: 16px;
// `;

// const SummaryContainer = styled(Box)`
//   margin-top: 16px;
//   padding: 16px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
// `;

// const Pos = () => {
//   const [provider, setProvider] = useState({});
//   const [invoice, setInvoice] = useState({});
//   const [product, setProduct] = useState({});
//   const [total, setTotal] = useState(0);

//   const handleSearchProvider = () => {
//     // Agregar lógica para buscar al proveedor
//   };

//   const handleAddProduct = () => {
//     // Agregar lógica para agregar un producto
//   };

//   return (
//     <Box>
//       <Typography variant="h5" sx={{ marginBottom: 2 }}>
//         Carga de Compras
//       </Typography>

//       {/* Formulario de búsqueda y agregar proveedor */}
//       <FormContainer container spacing={2} alignItems="flex-start">
//         <Grid item xs={12} md={4}>
//           <TextField
//             label="Buscar Proveedor"
//             variant="outlined"
//             fullWidth
//             onChange={handleSearchProvider}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField label="Nombre" variant="outlined" fullWidth value={provider.name || ''} disabled />
//           <TextField
//             label="Identificación"
//             variant="outlined"
//             fullWidth
//             value={provider.identification || ''}
//             disabled
//           />
//           <TextField
//             label="Dirección"
//             variant="outlined"
//             fullWidth
//             value={provider.address || ''}
//             disabled
//           />
//         </Grid>
//       </FormContainer>

//       {/* Formulario de datos de la factura */}
//       <FormContainer container spacing={2} alignItems="flex-start">
//         <Grid item xs={12} md={4}>
//           <TextField label="Número de Factura" variant="outlined" fullWidth />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField label="Fecha de Factura" variant="outlined" fullWidth type="date" />
//         </Grid>
//       </FormContainer>

//       {/* Resumen de la compra */}
//       <SummaryContainer>
//         <Typography variant="h6">Resumen de la Compra</Typography>
//         <Typography>Total: {total}</Typography>
//       </SummaryContainer>

//       {/* Formulario de carga de producto */}
//       <FormContainer container spacing={2} alignItems="flex-start">
//         <Grid item xs={12} md={2}>
//           <TextField label="Código" variant="outlined" fullWidth />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField label="Descripción" variant="outlined" fullWidth />
//         </Grid>
//         <Grid item xs={12} md={2}>
//           <TextField label="Precio" variant="outlined" fullWidth />
//         </Grid>
//         <Grid item xs={12} md={2}>
//           <TextField label="Costo" variant="outlined" fullWidth />
//         </Grid>
//         <Grid item xs={12} md={2}>
//           <TextField label="Precio de Venta" variant="outlined" fullWidth />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Button variant="contained" onClick={handleAddProduct}>
//             Agregar Producto
//           </Button>
//         </Grid>
//       </FormContainer>
//     </Box>
//   );
// };

// export default Pos;




// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 16px;
//   padding: 24px;
//   background-color: #f5f5f5;
//   border-radius: 8px;
// `;

// const FormContainer = styled.div`
//   display: flex;
//   gap: 16px;
// `;

// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
// `;

// const SubtotalContainer = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
//   gap: 8px;
//   margin-top: 16px;
// `;

// const ProductContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
// `;

// const Pos = () => {
//   const [buscarCliente, setBuscarCliente] = useState('');
//   const [agregarCliente, setAgregarCliente] = useState('');
//   const [buscarProducto, setBuscarProducto] = useState('');
//   const [agregarProducto, setAgregarProducto] = useState('');
//   const [descripcionProducto, setDescripcionProducto] = useState('');
//   const [cantidad, setCantidad] = useState(1);
//   const [precio, setPrecio] = useState(0);
//   const [usarDolares, setUsarDolares] = useState(false);
//   const [subtotal, setSubtotal] = useState(0);
//   const [productos, setProductos] = useState([]);

//   const handleCantidadChange = (event) => {
//     const value = event.target.value;
//     setCantidad(value);
//     calcularSubtotal(value, precio);
//   };

//   const handlePrecioChange = (event) => {
//     const value = event.target.value;
//     setPrecio(value);
//     calcularSubtotal(cantidad, value);
//   };

//   const calcularSubtotal = (cantidad, precio) => {
//     const subtotal = cantidad * precio;
//     setSubtotal(subtotal);
//   };

//   const handleUsarDolaresChange = (event) => {
//     const checked = event.target.checked;
//     setUsarDolares(checked);
//   };

//   const handleBuscarCliente = () => {
//     // Lógica para buscar cliente
//   };

//   const handleAgregarCliente = () => {
//     // Lógica para agregar cliente
//   };

//   const handleBuscarProducto = () => {
//     // Lógica para buscar producto
//   };

//   const handleAgregarProducto = () => {
//     const nuevoProducto = {
//       cantidad,
//       descripcion: descripcionProducto,
//       precio,
//       subtotal,
//     };
//     setProductos([...productos, nuevoProducto]);
//     setDescripcionProducto('');
//     setCantidad(1);
//     setPrecio(0);
//     setSubtotal(0);
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     // Lógica para enviar el formulario
//   };

//   return (
//     <Container>
//       <form onSubmit={handleFormSubmit}>
//         <Typography variant="h6">Facturación</Typography>

//         <FormContainer>
//         <FormGroup>
//   <TextField
//     label="Agregar Cliente"
//     value={agregarCliente}
//     onChange={(event) => setAgregarCliente(event.target.value)}
//   />
//   <Button variant="outlined" onClick={handleAgregarCliente}>
//     Agregar
//   </Button>
// </FormGroup>
//           <FormGroup>
//             <TextField
//               label="Agregar Cliente"
//               value={agregarCliente}
//               onChange={(event) => setAgregarCliente(event.target.value)}
//             />
//             <Button variant="outlined" onClick={handleAgregarCliente}>
//               Agregar
//             </Button>
//           </FormGroup>
//         </FormContainer>

//         <FormContainer>
//           <FormGroup>
//             <TextField
//               label="Buscar Producto"
//               value={buscarProducto}
//               onChange={(event) => setBuscarProducto(event.target.value)}
//             />
//             <Button variant="outlined" onClick={handleBuscarProducto}>
//               Buscar
//             </Button>
//           </FormGroup>

//           <FormGroup>
//             <TextField
//               label="Agregar Producto"
//               value={agregarProducto}
//               onChange={(event) => setAgregarProducto(event.target.value)}
//             />
//             <Button variant="outlined" onClick={handleAgregarProducto}>
//               Agregar
//             </Button>
//           </FormGroup>
//         </FormContainer>

//         <ProductContainer>
//           <TextField
//             label="Descripción del Producto"
//             value={descripcionProducto}
//             onChange={(event) => setDescripcionProducto(event.target.value)}
//           />

// <FormGroup>
//   <TextField
//     label="Cantidad"
//     type="number"
//     value={cantidad}
//     onChange={handleCantidadChange}
//   />
// </FormGroup>

// <FormGroup>
//   <TextField
//     label="Precio"
//     type="number"
//     value={precio}
//     onChange={handlePrecioChange}
//   />
// </FormGroup>

//           <Button variant="contained" onClick={handleAgregarProducto}>
//             Agregar Producto
//           </Button>
//         </ProductContainer>

//         <SubtotalContainer>
//           <Typography>
//             Cantidad de Productos: {productos.length} - Subtotal: {usarDolares ? '$' : 'Bs.'} {subtotal}
//           </Typography>
//           <Button variant="contained" type="submit">
//             Finalizar Compra
//           </Button>
//         </SubtotalContainer>
//       </form>
//     </Container>
//   );
// };

// export default Pos;








// import React, { useState } from 'react';
// import { TextField, FormControlLabel, Checkbox, Button, Typography,Box,  Grid, } from '@mui/material';
// // import { styled } from '@mui/system';
// import styled from "styled-components";
// // MUI components


// // Styled components
// const SummaryContainer = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   gap: 16px;
//   margin-top: 16px;
// `;

// const ProductFormContainer = styled.div`
//   margin-top: 16px;
// `;

// const ProductForm = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr;
//   gap: 16px;
// `;

// const ProductDescription = styled.div`
//   grid-column: 1 / -1;
// `;

// const ProductItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 8px;
// `;

// const Pos = () => {
//   const [products, setProducts] = useState([]);
//   const [subtotal, setSubtotal] = useState(0);
//   const [total, setTotal] = useState(0);

//   const handleAddProduct = () => {
//     // Agregar lógica para agregar un producto a la factura
//   };

//   return (
//     <Box>
//       <Typography variant="h5" sx={{ marginBottom: 2 }}>
//         Facturación
//       </Typography>

//       {/* Formulario de búsqueda y agregar cliente */}
//       {/* ... código del formulario de búsqueda y agregar cliente ... */}

//       {/* Formulario de búsqueda y agregar productos */}
//       <ProductFormContainer>
//         <Typography variant="h6" sx={{ marginBottom: 2 }}>
//           Agregar Producto
//         </Typography>

//         <ProductForm>
//           <TextField label="Número de Items" variant="outlined" />
//           <TextField label="Descripción" variant="outlined" />
//           <TextField label="Cantidad" variant="outlined" />
//         </ProductForm>

//         <Button variant="contained" onClick={handleAddProduct} sx={{ marginTop: 2 }}>
//           Agregar Producto
//         </Button>
//       </ProductFormContainer>

//       {/* Productos agregados a la factura */}
//       <ProductFormContainer>
//         <Typography variant="h6" sx={{ marginBottom: 2 }}>
//           Productos Agregados
//         </Typography>

//         {products.map((product, index) => (
//           <ProductItem key={index}>
//             <div>{product.description}</div>
//             <div>{product.quantity}</div>
//             <div>{product.price}</div>
//           </ProductItem>
//         ))}
//       </ProductFormContainer>

//       {/* Resumen de la factura */}
//       <SummaryContainer>
//         <Typography variant="subtitle1">Subtotal: {subtotal}</Typography>
//         <Typography variant="subtitle1">IVA: {subtotal * 0.16}</Typography>
//         <Typography variant="h6">Total: {total}</Typography>
//       </SummaryContainer>
//     </Box>
//   );
// };

// export default Pos;
