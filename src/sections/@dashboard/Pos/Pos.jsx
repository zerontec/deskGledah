import React, { useState, useEffect, useRef } from 'react';
import {
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import Modal from '@mui/material/Modal';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { fetchCustomers, createCustomer } from '../../../redux/modules/customer';
import { fetchProducts } from '../../../redux/modules/products';
import { createInvoices } from '../../../redux/modules/invoices';
import { fetchSellers } from '../../../redux/modules/seller';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { fDateTime } from '../../../utils/formatTime';
import { CreateDevolucion } from '../../../components/CreateDevolucion';
import { ProductRow } from '../../../components/ProductRow';


const SummaryContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 40px;

  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
  color: white;
  font-weight: 600;
  background-color: #ff8000;
  margin-bottom: 10px;
  margin-top: 30px;
  margin-right: 20px;
  font-family: 'DIGIT-LCD';
  background-image: linear-gradient(to bottom, #ff8000, #ffbf00);
`;



const FormContainer = styled.form`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #212f3d;
  border-radius: 30px;
`;



const StyledTextField = styled(TextField)`
  && {
    margin-top: 10px;
    color: #ffffff;
    text-align: center;

    input {
      text-align: center;

      color: #919eab;
    }
  }
`;

const Pos = () => {
  const [client, setClient] = useState({});
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [subtotal, setSubtotal] = useState(0);

  const [currency, setCurrency] = useState('Bs');
  const [currencys, setCurrencys] = useState('$');
  const [query, setQuery] = useState('');
  const [queryp, setQueryp] = useState('');
  const [querys, setQuerys] = useState('');
  const [productsQuantity, setProductsQuantity] = useState(0);

  const [seller, setSeller] = useState({});

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [isCredit, setIsCredit] = React.useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [manualClientData, setManualClientData] = useState({ name: '', identification: '', address: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [limpiar, setLimpiar] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [preciosModificados, setPreciosModificados] = useState({});

  const dispatch = useDispatch();

  const quantityRef = useRef(null);
  
  // Actualizar los campos de productos con el producto seleccionado
  const handleProductSelect = (selectedProduct) => {
    // Actualizar los campos de productos con el producto seleccionado
    setProduct({
      description: selectedProduct.description || '',
      price: selectedProduct.price || '',
      barcode: selectedProduct.barcode || '',
      name: selectedProduct.name || '',
      quantity: selectedProduct.quantity,
    });

    setTimeout(() => {
      quantityRef.current.focus();
    }, 0);

    // Cerrar el modal
    setModalOpen(false);
  };

  useEffect(() => {
    if (products.length === 0) {
      setIsPopupOpen(false);
    }
  }, [products]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCreditChange = (event) => {
    setIsCredit(event.target.value === 'credit');
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const searchProductRef = useRef(null);
  // aqui entro al estado de customer la el archivo desde customer entro a customers la variable que los obtiene
  const customers = useSelector((state) => state.customer);
  const availableProducts = useSelector((state) => state.product);
  const availableSeller = useSelector((state) => state.vendedores.vendedores);

  // console.log('vendedores', availableSeller);
  // console.log(customers);
  // console.log('ErrorProd', availableProducts);
  const { message } = useSelector((state) => state.customer);

  // console.log('Error', customers.customers.message);

  // const customerError = useSelector((state) => state.customer.error);
  // console.log(customerError);

  const handleProductQuantityChange = (event) => {
    setProductsQuantity(event.target.value);
  };

  const handleSearchClient = () => {
    const exactMatch = customers.customers.find((customer) => customer.identification === query);
    if (exactMatch) {
      setClient(exactMatch);
    } else {
      const partialMatch = customers.customers.find((customer) => customer.identification.includes(query));
      setClient(partialMatch || {});
    }
    setSearchError(true);
  };

  const resetForm = () => {
    setClient('');
    setSeller('');
    setProduct('');
  };

  const resetFormP = () => {
    setProduct('');
  };

  // eslint-disable-next-line consistent-return
  // const handleSearchProduct = () => {
  //   const exactMatch = availableProducts.products.find(
  //     (product) => product.barcode === queryp || product.name === queryp
  //   );

  //   if (exactMatch) {
  //     setProduct(exactMatch);
  //   } else {
  //     const partialMatch = availableProducts.products.find((product) => product.barcode.includes(queryp));
  //     setProduct(partialMatch || {});
  //   }

  //   // const ProExis = availableProducts.find((product) => product.quantity === 0);
  //   // if (ProExis) {
  //   //   return  setErrorMessage("No hay existencia en inventario de Tienda");

  //   // }
  // };


  const updateSubtotal = () => {
    const updatedSubtotal = products.reduce((subtotal, product) => subtotal + product.subtotalP, 0);
    setSubtotal(updatedSubtotal);
  };

  const handleSearchSeller = () => {
    const exactMatch = availableSeller.find((seller) => seller.identification === querys || seller.codigo === querys);
    if (exactMatch) {
      setSeller(exactMatch);
    } else {
      const partialMatch = availableSeller.find((seller) => seller.codigo.includes(querys));
      setSeller(partialMatch || {});
    }
  };

  const [editedPrices, setEditedPrices] = useState([]);

  // const handlePriceChange = (index, price) => {
  //   const updatedPrices = [...editedPrices];
  //   updatedPrices[index] = price;
  //   setEditedPrices(updatedPrices);
  //   updateSubtotal(updatedPrices); // Actualizar el subtotal con los nuevos precios
  // };
  
  
  // eslint-disable-next-line spaced-comment
  // Agregar producto

  const [editedPrice, setEditedPrice] = useState();
  
  const handleAddProduct = () => {
    console.log('prodcu', product.quantity);
    console.log('producQun', productsQuantity);
  
    if (product && productsQuantity > 0) {
      if (productsQuantity > product.quantity) {
        setSearchError(true);
        setErrorMessage('La cantidad de venta es mayor a la cantidad disponible del producto');
        setQueryp('');
        setLimpiar('');
        return;
      }
  
      const updatedProduct = {
        ...product,
        cantidad: productsQuantity,
        price: editedPrice !== undefined ? editedPrice : product.price,
        subtotalP: (editedPrice !== undefined ? editedPrice : product.price) * productsQuantity,
      };
    
  
      const updatedProducts = [...products, updatedProduct];
  
      // Actualizar editedPrices agregando undefined para el nuevo producto
      const updatedEditedPrices = [...editedPrices];
      updatedEditedPrices.push(undefined); // Agregar el precio editado como undefined inicialmente
      setEditedPrices(updatedEditedPrices);
  
      setProducts(updatedProducts);
      setProduct({});
      setProductsQuantity(0);
  
      const updatedSubtotal = updatedProducts.reduce(
        (subtotal, product) => subtotal + product.subtotalP,
        0
      );
      setSubtotal(updatedSubtotal);
    }
  
    // Enfocar nuevamente el campo de buscar producto después de agregar un producto
    searchProductRef.current.focus();
    setQueryp('');
    setProductsQuantity(0);
  };
  
  const productoLista = products;
  console.log('aquiProductoList', productoLista);

  // console.log("aqui clienteData", clienteData)
  const handleRemoveProduct = (index) => {
 
  };

  // envio para crear Factura
  fDateTime(selectedDate);

  const handleSubmit = (event) => {
    event.preventDefault();

    const invoiceData = {
      credit: isCredit,
      paymentMethod,
      dueDate: selectedDate,
      customer: {
        identification: client.identification || manualClientData.identification,
        name: client.name || manualClientData.name,
        address: client.address || manualClientData.address,
      },

      seller: {
        codigo: seller.codigo,
        identification: seller.identification,
        name: seller.name,
      },

      productos: productoLista,
    };

    dispatch(createInvoices(invoiceData));

    setQuery('');
    setClient({});
    setProduct({});
    setProducts([]);
    setProductsQuantity(0);
    setSubtotal(0);
    setIsPopupOpen(null);
    setManualClientData('');
    setSeller({});
  };

  useEffect(() => {
    if (query) {
      dispatch(fetchCustomers(query));
    }
  }, [query, dispatch]);

  useEffect(() => {
    if (queryp) {
      dispatch(fetchProducts(queryp));
    }
  }, [queryp, dispatch]);

  useEffect(() => {
    if (querys) {
      dispatch(fetchSellers(querys));
    }
  }, [querys, dispatch]);

  const openPopup = () => {
    if (products.length > 0) {
      setIsPopupOpen(true);
    }
  };
  const closePopup = () => {
    setIsPopupOpen(false);
  };




  const sumasPorItem = products.reduce((acc, item) => {
    if (acc[item.name]) {
      acc[item.name] += item.cantidad;
    } else {
      acc[item.name] = item.cantidad;
    }
    return acc;
  }, {});

  return (
    <>
  
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            backgroundColor: '#212B36',
          }}
        >
          <StyledTextField label="Busqueda Productos" onChange={(e) => setQueryp(e.target.value.toLowerCase())} />

          {queryp.length && Array.isArray(availableProducts.products) && availableProducts.products.length > 0 && (
            <Table>
              {availableProducts.products.map((result, index) => (
                <TableRow key={result.id} onClick={() => handleProductSelect(result)}>
                  <TableCell style={{ color: 'white' }}>{result.name}</TableCell>
                  <TableCell style={{ color: 'white' }}>{result.description}</TableCell>
                  <TableCell style={{ color: 'white' }}>{result.price}</TableCell>
                </TableRow>
              ))}
            </Table>
          )}
          {/* No existe Producto en inventario Stored */}
          <div style={{ color: 'white' }}>
            <ErrorMessage message={availableProducts.products.message} show={searchError} />
          </div>
          {/* {query.length > 6 &&
              (!Array.isArray(availableProducts) || availableProducts.length === 0) && (
                <p>No se encontro Producto</p>
              )} */}

          <Button
            style={{ marginTop: 10, backgroundColor: 'transparent' }}
            variant="contained"
            onClick={() => setModalOpen(null)}
          >
            x
          </Button>
        </Box>
      </Modal>

      {/* resuman de pago */}
      <Modal open={isPopupOpen === true} onClose={() => setIsPopupOpen(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Resumen de pago
          </Typography>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">SubTotal: {subtotal.toFixed(2)}</Typography>
            <Typography variant="h6">Iva(16%): {(subtotal * 0.16).toFixed(2)}</Typography>
            <Typography variant="h6">
              Total: {currency}
              {(subtotal + subtotal * 0.16).toFixed(2)}
            </Typography>
            <Typography variant="h6">Método de pago: {paymentMethod}</Typography>
            <Typography variant="h6">A crédito: {isCredit ? 'Sí' : 'No'}</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">Método de pago</InputLabel>
                <Select
                  labelId="payment-method-label"
                  id="payment-method"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  label="Método de pago"
                >
                  <MenuItem value="credito">Crédito</MenuItem>
                  <MenuItem value="debit">Transferencia</MenuItem>
                  <MenuItem value="cash">Efectivo $</MenuItem>
                  <MenuItem value="pagoM">Pago Movil</MenuItem>
                  <MenuItem value="cashB">Efectivo Bolivares</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            {isCredit && (
              <Grid item xs={12}>
                <DayPicker selected={selectedDate} onDayClick={handleDateChange} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button style={{ marginLeft: 80 }} variant="contained" onClick={handleSubmit}>
                Crear factura
              </Button>
            </Grid>
          </Grid>

          <hr />




          <Button variant="contained" onClick={() => setIsPopupOpen(null)}>
            X
          </Button>
        </Box>
      </Modal>

      <Box>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Facturación
        </Typography>

        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Tasa de el día {currencys}{' '}
        </Typography>

        <CreateDevolucion />

        <hr style={{ color: 'transparent', backgroundColor: 'transparent' }} />
        <FormContainer>
          {' '}
          {/* Formulario de búsqueda y agregar cliente */}
          <Grid
            container
            spacing={2}
            sx={{
              marginBottom: 2,
              marginTop: '20px',
              marginLeft: '10px',
            }}
          >
            <Grid item xs={12} md={3}>
              <StyledTextField
                label="Buscar Cliente"
                variant="outlined"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onBlur={handleSearchClient}
              />

              <>
                <ErrorMessage message={customers.customers.message} show={searchError} />
              </>

              <StyledTextField
                style={{ marginTop: 10 }}
                label="Agregar Vendedor"
                variant="outlined"
                value={querys}
                onChange={(event) => setQuerys(event.target.value)}
                onBlur={handleSearchSeller}
              />

              <StyledTextField
                label="Nombre vendedor"
                variant="outlined"
                sx={{ marginBottom: 2 }}
                value={seller.name || ''}
                disabled
                style={{ marginTop: 10 }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '20px',
              }}
            >
              <StyledTextField
                label="Nombre"
                variant="outlined"
                sx={{
                  marginBottom: 2,
                  marginRight: 20,
                }}
                value={client.name || manualClientData.name || ''}
                onChange={(event) =>
                  setManualClientData({
                    ...manualClientData,
                    name: event.target.value,
                  })
                }
              />
              <StyledTextField
                label="Identificación"
                variant="outlined"
                sx={{
                  marginBottom: 2,
                  marginRight: 20,
                }}
                value={client.identification || manualClientData.identification || ''}
                onChange={(event) =>
                  setManualClientData({
                    ...manualClientData,
                    identification: event.target.value,
                  })
                }
              />
              <StyledTextField
                label="Dirección"
                variant="outlined"
                sx={{
                  marginBottom: 2,
                  marginRight: 20,
                }}
                value={client.address || manualClientData.address || ''}
                onChange={(event) =>
                  setManualClientData({
                    ...manualClientData,
                    address: event.target.value,
                  })
                }
              />

              <Button onClick={resetForm}>Limpiar Form Cliente </Button>
            </Grid>

            <Box>
              {' '}
              {/* Resumen de la factura */}
              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} md={12}>
                  <SummaryContainer>
                    <Typography style={{ fontFamily: 'DIGIT-LCD', fontSize: 20 }}>
                      Subtotal: {subtotal.toFixed(2)}
                    </Typography>
                    <Typography style={{ fontFamily: 'DIGIT-LCD', fontSize: 20 }}>
                      Iva(16%): {(subtotal * 0.16).toFixed(2)}
                    </Typography>
                    <Typography style={{ fontFamily: 'DIGIT-LCD', fontSize: 20 }}>
                      Total: {currency}
                      {(subtotal + subtotal * 0.16).toFixed(2)}
                    </Typography>
                    <Typography>Moneda: {currency}</Typography>
                    <Typography>Monto en: {currencys}</Typography>
                  </SummaryContainer>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </FormContainer>

        {/* Formulario de búsqueda y agregar productos */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={3}>
            <Button
              label="Buscar Producto"
              ref={searchProductRef}
              variant="outlined"
              fullWidth
              // value={queryp}
              onClick={() => setModalOpen(true)} // Abrir el modal al hacer clic
              // onChange={(event) => setQueryp(event.target.value)}
              // onBlur={handleSearchProduct}
            >
              Buscar Productos{' '}
            </Button>
            {/* Cantidad de venta supera inventario */}
            <ErrorMessage message={errorMessage} show={searchError} />
            {/* No existe Producto en inventario Stored */}
            <ErrorMessage message={availableProducts.products.message} show={searchError} />
            <div style={{ color: 'white' }}>
              <ErrorMessage message={availableProducts.products.message} show={searchError} />
            </div>
            <Button onClick={resetFormP}>Limpiar Form Productos </Button>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField label="Descripción" variant="outlined" fullWidth value={product.description || ''} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField label="Precio" variant="outlined" fullWidth value={product.price || ''} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Cantidad"
              type="number"
              variant="outlined"
              ref={quantityRef}
              fullWidth
              value={productsQuantity}
              onChange={handleProductQuantityChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="contained" onClick={handleAddProduct} disabled={!product || productsQuantity <= 0}>
              Agregar Producto
            </Button>

            <Button variant="contained" onClick={openPopup}>
              Finalizar Venta
            </Button>
          </Grid>
        </Grid>

        {/* Lista de productos agregados */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h6">Productos Agregados : {products.length} </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Codigo</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Quitar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {products.map((item, index) => (
  <ProductRow
    key={index}
    product={item}
    index={index}
    handleRemoveProduct={handleRemoveProduct}
    editedPrices={editedPrices}
    products={products}
    setProducts={setProducts}
    setEditedPrices={setEditedPrices}
  
    setSubtotal={setSubtotal}
    editedPrice={editedPrice}
    setEditedPrice={setEditedPrice}
    subtotal={subtotal}
     
  />
))}
</TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Suma de productos por item:</Typography>
            <ul>
              {Object.entries(sumasPorItem).map(([item, cantidad]) => (
                <li key={item}>{`${item}: ${cantidad}`}</li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Pos;
