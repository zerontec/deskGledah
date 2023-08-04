/* eslint-disable arrow-body-style */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  
  TableCell,
  
  Table,
  TableRow,

  Box,
  Button,
  Grid,
  TextField,
 
  Modal,
} from '@mui/material';
import { ErrorMessage } from '../ErrorMessage';
import { fetchProducts } from '../../redux/modules/products';




const StyledTextField = styled(TextField)`
  && {
    margin-top: 10px;
    color: #ffffff;
    text-align: center;

    input {
      text-align: center;

      color: white;
    }
  }
`;
const SearchProduct = ({
  selectedProductPrice,
  setSelectedProductPrice,
  setProductsQuantity,
  setProductName,
  productName,
  setProduct,
  product,
  productsQuantity,
  handleAddProduct,
  limpiar,
  setLimpiar,
  searchProductRef,
  openModal,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const availableProducts = useSelector((state) => state.product);

  const [products, setProducts] = useState([]);
  const [queryp, setQueryp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchError, setSearchError] = useState(false);
  // const [product, setProduct] = useState({});
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (products.length === 0) {
      setIsPopupOpen(false);
    }
  }, [products]);

  const openPopup = () => {
    if (products.length > 0) {
      setIsPopupOpen(true);
    }
  };

  const handlePriceChange = (event) => {
    setSelectedProductPrice(event.target.value);
  };

  useEffect(() => {
    if (queryp) {
      dispatch(fetchProducts(queryp));
    }
  }, [queryp, dispatch]);

  const resetFormP = () => {
    setProduct({});
    setProducts([]);
    setProductsQuantity(0);
    setSelectedProductPrice('');
  };

  const quantityRef = useRef(null);

  const handleProductQuantityChange = (event) => {
    setProductsQuantity(event.target.value);
  };

  const [searchResults, setSearchResults] = useState([]);


  const handleProductSelect = (product) => {
    setProduct(product);
    if (product && product.price && product.name) {
      setSelectedProductPrice(product.price);
      setProductsQuantity(0); // Reiniciar la cantidad al seleccionar un nuevo producto
      setProductName(product.name)
    } else {
      setSelectedProductPrice(0);
      setProductsQuantity(0);
      setProductName('')
      setProduct({})
    }
    setSearchResults([]);
    setModalOpen(false);
    setQueryp('');
  };

  
  function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  


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
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            backgroundColor: '#212B36',
          }}
        >
          <StyledTextField
            label="Buscar Productos"
            style={{color:'white'}}
            onChange={(e) => setQueryp(e.target.value.toLowerCase())}
          />
          {queryp.length > 0 && Array.isArray(availableProducts.products) && availableProducts.products.length > 0 && (
      <Table>
      {availableProducts.products.map((result, index) => (
        <TableRow
          key={result.id}
          tabIndex={index + 1}
          data-index={index}
          onClick={() => handleProductSelect(result)}
        >
          <TableCell style={{ color: 'white' }}>{capitalizeFirstLetter(result.name)}</TableCell>
          <TableCell style={{ color: 'white' }}>{capitalizeFirstLetter(result.description)}</TableCell>
          <TableCell style={{ color: 'white' }}>$ {result.price}</TableCell>
          <TableCell style={{ color: 'white' }}>Cant {result.quantity}</TableCell>
        </TableRow>
      ))}
    </Table>
      )}
          <div style={{ color: 'white' }}>
            <ErrorMessage message={availableProducts.products.message} show={searchError} />
          </div>
          <Button
            style={{
              marginTop: 10,
              backgroundColor: 'transparent',
            }}
            variant="contained"
            onClick={() => setModalOpen(false)}
          >
            x
          </Button>
        </Box>
      </Modal>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={3}>
          <Button
            ref={searchProductRef}
            variant="outlined"
            fullWidth
            onClick={() => setModalOpen(true)}
          >
            Buscar Productos
          </Button>

          <ErrorMessage message={errorMessage} show={searchError} />

          <Button onClick={resetFormP}>Limpiar Form Productos</Button>
        </Grid>

        {/* <Grid item xs={12} md={3}>
          <TextField
            label="Descripción"
            variant="outlined"
            fullWidth
            value={product.description || ''}
          />
        </Grid> */}
          <Grid item xs={12} md={2}>
          <TextField
            label="Producto"
            variant="outlined"
            fullWidth
            value={productName}
           
          />
        </Grid>


        <Grid item xs={12} md={2}>
          <TextField
            label="Precio"
            type="number"
            variant="outlined"
            fullWidth
            value={selectedProductPrice}
            onChange={handlePriceChange}
          />
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
          <Button
            variant="contained"
            onClick={() => handleAddProduct(product, productsQuantity, selectedProductPrice)}
            disabled={!product || productsQuantity <= 0 || !selectedProductPrice}
          >
            Agregar Producto
          </Button>
          <Button style={{marginTop:10}} variant="contained" onClick={openModal}>
            Finalizar Venta
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default SearchProduct;