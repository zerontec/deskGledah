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

const SummaryContainerP = styled(Box)`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
  color: white;
  font-weight: 600;
  background-color: #27ae60;
  margin-bottom: 10px;
  margin-top: 30px;
  margin-right: 20px;

  & > * {
    margin-right: 10px;
  }
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

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: right;
  margin-top: 20;
`;

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
  handleAddProduct,
  limpiar,
  setLimpiar,
  searchProductRef,
  openModal,  // la recibo como prosps

}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const availableProducts = useSelector((state) => state.product);
 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  

  const [products, setProducts] = useState([]);
  const [queryp, setQueryp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [product, setProduct] = useState({});
  const [productsQuantity, setProductsQuantity] = useState(0);
  
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
  
    console.log(selectedProductPrice, productsQuantity)
  };

  useEffect(() => {
    if (queryp) {
      dispatch(fetchProducts(queryp));
    }
  }, [queryp, dispatch]);

  const resetFormP = () => {
    setProduct({});
    setProducts([])
    setProductsQuantity(0);
    setSelectedProductPrice('');
  };

  const quantityRef = useRef(null);

  const handleProductQuantityChange = (event) => {
    setProductsQuantity(event.target.value);
  };
  
//   const handleProductSelect = (selectedProduct) => {
//     setProduct({
//       description: selectedProduct.description || '',
//       price: selectedProduct.price || '',
//       barcode: selectedProduct.barcode || '',
//       name: selectedProduct.name || '',
    
//     });
    
//     // handleAddProduct(product, productsQuantity);
// console.log("handle", handleProductSelect)
   
// setSelectedProductPrice(selectedProduct.price || '');
//     console.log("enHandle",product)
//     setTimeout(() => {
//       quantityRef.current.focus();
//     }, 0);

//     setModalOpen(false);
//   };

const [searchResults, setSearchResults] = useState([]);

const handleProductSelect = (product) => {
  setProduct(product);
  if (product && product.price) {
    setSelectedProductPrice(product.price);
  } else {
    setSelectedProductPrice(0);
  }
  setSearchResults([]);
  
  setModalOpen(false);
 setQueryp('')
};



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
          {queryp.length > 0 &&
            Array.isArray(availableProducts.products) &&
            availableProducts.products.length > 0 && (
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
            value={product.name}
           
          />
        </Grid>


        <Grid item xs={12} md={2}>
          <TextField
            label="Precio"
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