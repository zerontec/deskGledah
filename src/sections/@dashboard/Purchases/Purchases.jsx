/* eslint-disable radix */

import React, { useState, useEffect,useRef } from 'react';

import {
  IconButton,
  InputLabel,
  Box,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
  MenuItem,
  Select,
  FormControl,
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import styled from 'styled-components';
import Modal from '@mui/material/Modal';
import Swal from "sweetalert2";
import { useSelector, useDispatch } from 'react-redux';

import { fetchSupliers } from '../../../redux/modules/supplier';
import { fetchProducts } from '../../../redux/modules/products';
import { createPurchase, fetchPurchases } from '../../../redux/modules/purchase';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { CreateSupplier } from '../../../components/CreateSupplier';

import { FloatingButtonComponent } from '../../../components/FloatingButtonComponent';


const FormContainer = styled(Grid)`
  margin-bottom: 16px;
`;


const SummaryContainer = styled(Box)`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-top: 10px;
    color: #ffffff;
    text-align: center;

    input {
      text-align: center;
      
    color: #919EAB;
    }
  }
`;

const Purchases = () => {
  const [product, setProduct] = useState({});
  const [total, setTotal] = useState(0);
  const [supplier, setSupplier] = useState({});
  const [query, setQuery] = useState('');
  const [productsQuantity, setProductsQuantity] = useState(0);
  const [productsPrice, setProductsPrice] = useState(0);
  const [productCantidad, setProductCantidad] = useState(0);
  const [productsCosto, setProductsCosto] = useState(0);

  const [numberinvoice, setNumberInvoice] = useState('');
  const [numberPurchase, setNumberpurchase] = useState('');
  const [porcentajeGanacia, setPorcentajeGanancia] = useState(0);
  const [searchError, setSearchError] = useState(false);
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [queryp, setQueryp] = useState('');
  const [queryPu, setQueryPu] = useState('');
  const [manualProductData, setManualProductData] = useState({
    name: '',
    description: '',
    barcode: '',
    productsPrices: '',
    costo:''
  });
  
  const [isPopupOpen, setIsPopupOpen] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [limpiarForm, setLimpiarForm] = useState('');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageError, setMessageError] = useState({});
  const [loading, setLoading] = useState(false);

  const searchProductRef = useRef(null);

  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    rif: supplier.rif || '',
    name: supplier.name || '',
    address: supplier.address || '',
    phoneNumber: supplier.phoneNumber || '',
    barcode: product.barcode || '',
  });

  useEffect(() => {
    setFormValues({
      rif: supplier.rif || '',
      name: supplier.name || '',
      address: supplier.address || '',
      phoneNumber: supplier.phoneNumber || '',
    });
  }, [supplier]);

  const resetForm = () => {
    setFormValues({
      ...formValues,
      rif: '',
      name: '',
      address: '',
      phoneNumber: '',
    });
  };

  const [formValuesP, setFormValuesP] = useState({
    barcode: product.barcode || '',
    name: product.name || '',
    description: product.description || '',
    cantidad: productsQuantity || '',
    costo: productsCosto || '',
    precioVenta: productsPrice || '',
    porcentajeGan: porcentajeGanacia || '',
  });

  useEffect(() => {
    setFormValuesP({
      barcode: product.barcode || '',
      name: product.name || '',
      description: product.description || '',
      cantidad: productsQuantity || '',
      costo: productsCosto || '',
      precioVenta: productsPrice || '',
      porcentajeGan: porcentajeGanacia || '',
    });
  }, [product, porcentajeGanacia, productsCosto, productsQuantity, productsPrice]);

  const resetFormP = () => {
    setFormValuesP({
      ...formValuesP,
      barcode: '',
      name: '',
      description: '',
      cantidad: '',
      costo: '',
      precioVenta: '',
      porcentajeGan: '',
      
    });
    setManualProductData({})


  };

  useEffect(() => {
    if (products.length === 0) {
      setIsPopupOpen(null);
    }
  }, [products]);

  const proveedor = useSelector((state) => state.supplier);
  console.log('aqui proveerdor', proveedor);

  const availableProducts = useSelector((state) => state.product);
  console.log('aqui producto', availableProducts);

  const compras = useSelector((state) => state.purchase);

  console.log('compras', compras);

  const handleSearchProvider = () => {
   
    const exactMatch = proveedor?.suppliers.find((supplier) => supplier?.rif === query);
    if (exactMatch) {
      setSupplier(exactMatch);
    } else {
      const partialMatch = proveedor?.suppliers.find((supplier) => supplier.rif.includes(query));
      setSupplier(partialMatch || {});
    }
    setSearchError(true);
  };

  const handleSearchProduct = () => {
    const exactMatch = availableProducts?.products.find(
      (product) => product?.barcode === queryp || product.name === queryp
    );

    if (exactMatch) {
      setProduct(exactMatch);
    } else {
      const partialMatch = availableProducts?.products.find((product) => product.barcode.includes(queryp));
      setProduct(partialMatch || {});
    }
  };

  const handleNumFacturaCompraChange = (event) => {
    setQueryPu(event.target.value); // Se debe utilizar setQueryPu en lugar de event para actualizar el estado
  };

  const handleSearchCompra = () => {
    console.log('aquiiiii');
    const existeNumeroCompra = compras.purchases.find((purchase) => purchase.purchaseNumber === queryPu);

    if (existeNumeroCompra) {
      console.log("'aqui numero de compra existe'", existeNumeroCompra);
      setMessage('Epaleee');
      setSearchError(true);
    } else {
      setSearchError(false);
      // Realizar las acciones correspondientes si el número de compra es válido
    }
  };

  const validarNumeroCompra = () => {
    // Agregar lógica para buscar la compra en el array de compras

    const existeNumeroCompra = compras.purchases.find((purchase) => purchase.purchaseNumber === queryPu);

    if (existeNumeroCompra) {
      setSearchError(true);
      setMessage('Epaleee');
    } else {
      setSearchError(false);
      // Realizar las acciones correspondientes si el número de compra es válido
    }
  };

  const handleProductQuantityChange = (event) => {
    setProductsQuantity(event.target.value);
  };

  const handleProductCostoChange = (event) => {
    setProductsCosto(event.target.value);
    // calculatePrice();
  };
  const handlePrecioVenta = (event) => {


    setProductsPrice(event.target.value)

  }
  const handlePorcentajeGanancia = (event) => {
    setPorcentajeGanancia(event.target.value);
    // calculatePrice();
  };

  const handleStatusChange = (event) => {
    setPaymentStatus(event.target.value);
  };

  // const calculatePrice = () => {
  //   const cost = parseFloat(productsCosto);
  //   const ganancia = parseFloat(porcentajeGanacia);
  //   const precioVenta = cost + (cost * ganancia) / 100;
  //   setProductsPrice(precioVenta);
  // };

  const handlenumberInvoice = (event) => {
    setNumberInvoice(event.target.value);
  };

  const handlenumberPurchase = (event) => {
    setNumberpurchase(event.target.value);
  };

  // const handleCostoChange =(event) => {

  //   setCostoChange(event.targe.value);

  // }

  // Agregar producto
  let updatedProducts = [];
  const handleAddProduct = () => {
    const updatedProduct = {
      ...product,
      barcode: product.barcode || manualProductData.barcode,
      cantidad: parseInt(productsQuantity),
      costo: parseFloat(productsCosto),
      price: parseFloat(productsPrice || manualProductData.productsPrice),
      name: product.name || manualProductData.name,
      description: product.description || manualProductData.description,
      subtotalP: productsQuantity * productsCosto,
    };
    
     updatedProducts = [...products, updatedProduct];
  
    setProducts(updatedProducts);
    setProduct({});
    setProductsQuantity(0);
    setProductsCosto(0);
    setProductsPrice(0)
    setManualProductData({})
  
    const updatedSubtotal = updatedProducts.reduce((subtotal, product) => subtotal + product.subtotalP, 0);
    setSubtotal(updatedSubtotal);
  
    // Enfocar nuevamente el campo de buscar producto después de agregar un producto
    // searchProductRef.current.focus();
    setQueryp('');
    setProductsQuantity(0);
  };
  const productoLista = products;

  console.log('aquiProductoList', productoLista);

  const handleRemoveProduct = (index) => {
    const newList = [...products];
    newList.splice(index, 1);
    setProducts(newList);
  };

  console.log('rif suu', supplier.rif);

  console.log('aqui podu list, productoLista', productoLista);

  const handleSubmit = (event) => {
    event.preventDefault();
	 
    const PurchaseData = {
      invoiceNumber: numberinvoice,
      purchaseNumber: numberPurchase,
      rif: supplier.rif,
      // totalAmount:subtotal,
      status: paymentStatus,

      products: productoLista,
    };
    setLoading(true);
    dispatch(createPurchase(PurchaseData))
    
    .then((response) => {
      setLoading(false);
		  Swal.fire("Compra cargada  con éxito!", "", "success");
		
	
		
		
    setQuery('');
    setSupplier({});
    setProduct({});
    setProducts([]);
    setProductsQuantity(0);
    setSubtotal(0);
    setNumberInvoice('');
    setNumberpurchase('');
    setPorcentajeGanancia(0);
    setProductsCosto(0);
    setProductsPrice(0);
    setManualProductData({})
    // setIsPopupOpen(null);
    // setManualClientData('');
    // setSeller({});
    
   setIsPopupOpen(null);
    if (response.error) {
      
      setMessageError	(response.error);
     

		  }

  })
  .catch((error) => {
    console.log(error);
    setLoading(false);
    setIsPopupOpen(null);
    setMessageError(error.message);
    Swal.fire(error.message);
  });
  
  };

  const [isBarcodeDirty, setIsBarcodeDirty] = useState(false);
  const [isNameDirty, setIsNameDirty] = useState(false);
  const [isDescriptionDirty, setIsDescriptionDirty] = useState(false);

  useEffect(() => {
    if (query) {
      dispatch(fetchSupliers(query));
    }
  }, [query, dispatch]);

  useEffect(() => {
    if (queryp) {
      dispatch(fetchProducts(queryp));
    }
  }, [queryp, dispatch]);

  useEffect(() => {
    if (queryPu) {
      dispatch(fetchPurchases(queryPu));
    }
  }, [queryPu, dispatch]);

  const openPopup = () => {
    if (products.length > 0) {
      setIsPopupOpen(true);
    }
  };
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const quantityRef = useRef(null);

  const handleProductSelect = (selectedProduct) => {
    // Actualizar los campos de productos con el producto seleccionado
    setProduct({
      description: selectedProduct.description || '',
      price: selectedProduct.price || '',
      barcode: selectedProduct.barcode || '',
      name: selectedProduct.name || '',
      costo: selectedProduct.costo || '',

     
     
    });
  
    
    setTimeout(() => {
      if (quantityRef.current) {
        quantityRef.current.focus();
      }
    }, 0);
  
    // Cerrar el modal
    setModalOpen(false);
   
  };
  function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const handleCloseModal = () => {
    // Restablece los estados a sus valores iniciales
 setQueryp('')
  };
  const closeModal = () => {
  
  };

  return (
    <>
    
      <Modal open={isPopupOpen === true} onClose={() => setIsPopupOpen(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ marginBottom: 2 }}>
            {/* <Typography variant="body1">SubTotal: {subtotal.toFixed(2)}</Typography> */}

            <Typography>
              Total Compra: $
              {subtotal.toFixed(2)}
            </Typography>
            {/* <Typography variant="body1">Método de pago: {paymentMethod}</Typography>
          <Typography variant="body1">A crédito: {isCredit ? 'Sí' : 'No'}</Typography> */}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">Status de Compra</InputLabel>
                <Select
                  labelId="payment-method-label"
                  id="payment-method"
                  value={paymentStatus}
                  onChange={handleStatusChange}
                  label="status"
                >
                  <MenuItem value="pagada">pagada</MenuItem>
                  <MenuItem value="Por Pagar">Por Pagar</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="credit-label">A crédito</InputLabel>
              <Select
                labelId="credit-label"
                id="credit"
                value={isCredit ? 'credit' : 'cash'}
                onChange={handleCreditChange}
                label="A crédito"
              >


                <MenuItem value="credit">Sí</MenuItem>
                <MenuItem value="cash">No</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
            {/* {isCredit && (
            <Grid item xs={12}>
              <DayPicker selected={selectedDate} onDayClick={handleDateChange} />
            </Grid>
          )} */}
            <Grid item xs={12}>
            <Button
  type="submit"
  onClick={handleSubmit}
  variant="contained"
  color="primary"
  // disabled={!isFormValid} // Deshabilitar el botón si isFormValid es false
>
  {loading ? "Cargando..." : "Cargar Compra"}
				  </Button>
            </Grid>
          </Grid>

          <hr />

          <Button variant="contained" onClick={() => setIsPopupOpen(null)}>
            X
          </Button>
        </Box>
      </Modal>



      <Modal open={modalOpen} onClose={handleCloseModal}>
    <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            
            maxHeight: '80vh',
            overflowY: 'auto',width: 400,
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            backgroundColor:"#212B36"
          }}
        >

<StyledTextField
              label="Busqueda Productos"
              onChange={(e) => setQueryp(e.target.value.toLowerCase())}
            />
          

            {queryp.length  &&
              Array.isArray(availableProducts.products) &&
              availableProducts.products.length > 0 && (
                <Table >
                  {availableProducts.products.map((result, index) => (
                    <TableRow
                      key={result.id}
                      onClick={() => handleProductSelect(result)}
                    >
                      <TableCell style={{color:"white"}}>{result.name}</TableCell>
                      <TableCell style={{color:"white"}}>{result.description}</TableCell>
                      <TableCell style={{color:"white"}}>{result.price}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              )}
{/* No existe Producto en inventario Stored */}
<div style={{color:"white"}}>
<ErrorMessage message={availableProducts.products.message} show={searchError} /></div>
            {/* {query.length > 6 &&
              (!Array.isArray(availableProducts) || availableProducts.length === 0) && (
                <p>No se encontro Producto</p>
              )} */}


<Button style={{marginTop:10, backgroundColor:"transparent"}} variant="contained" onClick={() => setModalOpen(null)}>
            x
          </Button>

  
  </Box>
</Modal>



      <Box>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Carga de Compras
        </Typography>

        {/* Formulario de búsqueda y agregar proveedor */}
        <FormContainer container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <TextField
              label="Buscar Proveedor"
              variant="outlined"
              fullWidth
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={handleSearchProvider}
            />
            <ErrorMessage message={proveedor.suppliers.message} show={searchError} />
            <CreateSupplier />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Nombre" variant="outlined" fullWidth value={formValues.name || ''} disabled />

            <TextField label="Rif" variant="outlined" fullWidth name="rif" value={formValues.rif} disabled />
            <TextField label="Dirección" varian="outlined" fullWidth value={formValues.address || ''} disabled />

            <TextField
              label="Numero Telefonico"
              varian="outlined"
              fullWidth
              value={formValues.phoneNumber || ''}
              disabled
            />
          </Grid>

          <Button onClick={resetForm}>Limpiar Form </Button>
        </FormContainer>

        {/* Formulario de datos de la factura */}
        <FormContainer container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <TextField
              label="Número de Factura"
              type="number"
              variant="outlined"
              value={numberinvoice}
              onChange={handlenumberInvoice}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Número de Compra"
              type="number"
              variant="outlined"
              value={numberPurchase}
              onChange={handlenumberPurchase}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField label="Fecha de Factura" variant="outlined" fullWidth type="date" />
          </Grid>
        </FormContainer>

        {/* Resumen de la compra */}
        <SummaryContainer>
          <Typography variant="h6">Resumen de la Compra</Typography>
          <Typography>Total: {total}</Typography>
          <Button onClick={resetFormP}>Limpiar Form Productos </Button>
        </SummaryContainer>
        <Button
              label="Buscar Producto"
              ref={searchProductRef}
              variant="outlined"
              // fullWidth
              // value={queryp}
              onClick={() => setModalOpen(true)} // Abrir el modal al hacer clic
              // onChange={(event) => setQueryp(event.target.value)}
              // onBlur={handleSearchProduct}
            >Agregar Productos </Button>
        <ErrorMessage message={availableProducts.products.message} show={searchError} />
        {/* Formulario de carga de producto */}

        <FormContainer container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={2}>
            <TextField
              label="Código"
              variant="outlined"
              value={formValuesP.barcode || manualProductData.barcode|| ''}
              onChange={(event) =>
                setManualProductData({
                  ...manualProductData,
                  barcode: event.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      setManualProductData({
                        ...manualProductData,
                        barcode: '',
                      });
                      setIsBarcodeDirty(false);
                    }}
                    edge="end"
                  >
                    {isBarcodeDirty}
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Producto"
              variant="outlined"
              // style={{ marginTop: 10 }}
              type="text"
              value={capitalizeFirstLetter(formValuesP.name) || capitalizeFirstLetter(manualProductData.name) || ''}
              onChange={(event) =>
                setManualProductData({
                  ...manualProductData,
                  name: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Descripción"
              variant="outlined"
              // style={{ marginTop: 10 }}
              value={capitalizeFirstLetter(formValuesP.description) || capitalizeFirstLetter(manualProductData.description) || ''}
              onChange={(event) =>
                setManualProductData({
                  ...manualProductData,
                  description: event.target.value,
                })
              }
            />
          </Grid>
          {/* <Grid item xs={12} md={2}>
      <TextField label="Precio"
       variant="outlined"
       value={product.price || manualProductData.price || ''}
       onChange={(event) =>
         setManualProductData({
           ...manualProductData,
           price: event.target.value,
         })
       } />
    </Grid> */}

          <Grid item xs={12} md={2}>
            <TextField
              label="Cantidad"
              type="number"
              inputMode="decimal"
              variant="outlined"
              value={formValuesP.cantidad}
              onChange={handleProductQuantityChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Costo"
              // type="number"
              // inputMode="decimal"
              variant="outlined"
              value={formValuesP.costo}
              onChange={handleProductCostoChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Porcentaje Ganancia "
              variant="outlined"
              type="number"
              value={formValuesP.porcentajeGan}
              onChange={handlePorcentajeGanancia}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Precio de Venta"
              variant="outlined"
              // type="number"
              // inputMode="decimal"
              value={formValuesP.precioVenta}
              onChange={handlePrecioVenta}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button variant="contained" onClick={handleAddProduct} disabled={!product || productsQuantity <= 0}>
              Agregar Producto
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" onClick={openPopup}>
              Finalizar Compra
            </Button>
          </Grid>
        </FormContainer>

        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h6">Productos Agregados : </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Codigo</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio venta</TableCell>
                    <TableCell>Costo</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Sub total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.barcode || manualProductData.barcode}</TableCell>
                      <TableCell>{item.name || manualProductData.name}</TableCell>
                      <TableCell>{item.description || manualProductData.description}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.costo}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>{item.subtotalP}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="error" onClick={() => handleRemoveProduct(index)}>
                          Quitar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Suma de productos por item:</Typography>
            {/* <ul>
      {Object.entries(sumasPorItem).map(([item, cantidad]) => (
        <li key={item}>{`${item}: ${cantidad}`}</li>
      ))}
    </ul> */}
          </Grid>
        </Grid>
      </Box>

      <FloatingButtonComponent/>
    </>
  );
};

export default Purchases;
