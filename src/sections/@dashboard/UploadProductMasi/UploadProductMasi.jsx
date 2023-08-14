import React, { useState, useEffect, useRef } from 'react';

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import Modal from '@mui/material/Modal';
import { ErrorMessage } from '../../../components/ErrorMessage';

import { uploadMasi, fetchProducts } from '../../../redux/modules/products';

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

const UploadProductMasi = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [messageError, setMessageError] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [queryp, setQueryp] = useState('');
  const [products, setProducts] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [product, setProduct] = useState({});
  const [productsQuantity, setProductsQuantity] = useState(0);
  const [productsPrice, setProductsPrice] = useState(0);
  const [productsCosto, setProductsCosto] = useState(0);
  const [manualProductData, setManualProductData] = useState({
    name: '',
    description: '',
    barcode: '',
    price: '',
    costo: '',
  });

  const [formValuesP, setFormValuesP] = useState({
    barcode: product.barcode || '',
    name: product.name || '',
    description: product.description || '',
    quantity: productsQuantity || '',
    costo: productsCosto || '',
    price: productsPrice || '',
  });

  useEffect(() => {
    setFormValuesP({
      barcode: product.barcode || '',
      name: product.name || '',
      description: product.description || '',
      quantity: productsQuantity || '',
      costo: productsCosto || '',
      price: productsPrice || '',
    });
  }, [product, productsCosto, productsQuantity, productsPrice]);

  const resetFormP = () => {
    setFormValuesP({
      ...formValuesP,
      barcode: '',
      name: '',
      description: '',
      cantidad: '',
      costo: '',
      price: '',
      porcentajeGan: '',
    });
    setManualProductData({});
  };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   const parsedValue = name === 'costo' || name === 'quantity' || name === 'price' ? parseFloat(value) : value;

  //   setNewProduct((prevState) => ({
  //     ...prevState,
  //     [name]: parsedValue,
  //   }));
  // };

  const availableProducts = useSelector((state) => state.product);

  function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  useEffect(() => {
    if (queryp) {
      dispatch(fetchProducts(queryp));
    }
  }, [queryp, dispatch]);

  const handleAddProduct = () => {
    //   const quantityNumber = parseInt(manualProductData.quantity, 10);
    //   const priceNumber = parseFloat(manualProductData.price);

    //  // Verifica si los números son válidos antes de agregar el producto
    //  if (Number.isNaN(quantityNumber) || Number.isNaN(priceNumber)) {
    //   // Si alguno de los valores no es un número válido, muestra un mensaje de error
    //   Swal.fire('Error: La cantidad y el precio deben ser números válidos.');
    //   console.log('Error: La cantidad y el precio deben ser números válidos.');

    //   return;
    // }
    let updatedProducts = [];
    const updatedProduct = {
      ...product,
      barcode: product.barcode || manualProductData.barcode,
      quantity: parseInt(productsQuantity, 10),
      costo: parseFloat(productsCosto),
      price: parseFloat(productsPrice || manualProductData.productsPrice),
      name: product.name || manualProductData.name,
      description: product.description || manualProductData.description,
    };
    updatedProducts = [...products, updatedProduct];

    setProducts(updatedProducts);

    setProducts(updatedProducts);
    setProduct({});
    setProductsQuantity(0);
    setProductsCosto(0);
    setProductsPrice(0);
    setManualProductData({});
  };
  const productoLista = products;

  console.log('productoslita', productoLista);

  const handleRemoveProduct = (index) => {
    const newList = [...products];
    newList.splice(index, 1);
    setProducts(newList);
  };

  const handleDeleteProduct = (index) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
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

  const handleCloseModal = () => {
    // Restablece los estados a sus valores iniciales
    setQueryp('');
  };
  const handleProductQuantityChange = (event) => {
    setProductsQuantity(event.target.value);
  };
  const handlePrecioVenta = (event) => {
    setProductsPrice(event.target.value);
  };

  const handleProductCostoChange = (event) => {
    setProductsCosto(event.target.value);
    // calculatePrice();
  };

  const handleUploadProducts = (event) => {
    // Aquí puedes enviar los productos al servidor para su carga masiva
    event.preventDefault();

    dispatch(uploadMasi(products))
      .then((response) => {
        setLoading(false);
        Swal.fire('Carga creada con éxito!', '', 'success');
        setProducts([]);
        if (response.error) {
          setMessageError(response.error);
        }
        console.log(products);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);

        setMessageError(error.message);
        Swal.fire(error.message);
      });
    // Limpia el formulario después de la creación exitosa del proveedor
  };

  const searchProductRef = useRef(null);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TableContainer>
          <Button
            label="Buscar Producto"
            ref={searchProductRef}
            variant="outlined"
            // fullWidth
            // value={queryp}
            onClick={() => setModalOpen(true)} // Abrir el modal al hacer clic
            // onChange={(event) => setQueryp(event.target.value)}
            // onBlur={handleSearchProduct}
          >
            Agregar Productos{' '}
          </Button>
          <ErrorMessage message={availableProducts.products.message} show={searchError} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Codigo</TableCell>
                <TableCell align="center">Producto</TableCell>
                <TableCell align="center">Descripcion</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="center">Costo</TableCell>
                <TableCell align="center">PrecioVEnta</TableCell>
                {/* <TableCell align="center"></TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.barcode || manualProductData.barcode}</TableCell>
                  <TableCell align="center">{product.name || manualProductData.name}</TableCell>
                  <TableCell align="center">{product.description || manualProductData.description}</TableCell>
                  <TableCell align="center">{product.quantity}</TableCell>
                  <TableCell align="center">{product.costo}</TableCell>
                  <TableCell align="center">{product.price}</TableCell>

                  <TableCell align="center">
                    <DeleteIcon onClick={() => handleRemoveProduct(index)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <TextField
            name="barcode"
            label="Código "
            value={formValuesP?.barcode || manualProductData?.barcode || ''}
            onChange={(event) =>
              setManualProductData({
                ...manualProductData,
                barcode: event.target.value,
              })
            }
          />
          <TextField
            name="name"
            label="Producto"
            value={capitalizeFirstLetter(formValuesP.name) || capitalizeFirstLetter(manualProductData.name) || ''}
            onChange={(event) =>
              setManualProductData({
                ...manualProductData,
                name: event.target.value,
              })
            }
          />
          <TextField
            name="description"
            label="Descripcion"
            value={
              capitalizeFirstLetter(formValuesP.description) ||
              capitalizeFirstLetter(manualProductData.description) ||
              ''
            }
            onChange={(event) =>
              setManualProductData({
                ...manualProductData,
                description: event.target.value,
              })
            }
          />

          <TextField
            name="quantity"
            label="Cantidad"
            type="number"
            inputMode="decimal"
            value={formValuesP.quantity}
            onChange={handleProductQuantityChange}
          />
          <TextField
            name="costo"
            label="Costo"
            type="number"
            inputMode="decimal"
            value={formValuesP.costo}
            onChange={handleProductCostoChange}
          />
          <TextField
            name="price"
            label="Precio Venta"
            type="number"
            inputMode="decimal"
            value={formValuesP.price}
            onChange={handlePrecioVenta}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
            startIcon={<AddIcon />}
        
          >
            Agregar Producto
          </Button>
          <Button
  variant="contained"
  color="secondary"
  onClick={handleUploadProducts}
  disabled={products.length === 0}
>
  Cargar Productos
</Button>






          <Button onClick={resetFormP}>Limpiar Form </Button>
        </div>
      </div>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',

            maxHeight: '80vh',
            overflowY: 'auto',
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
    </>
  );
};

export default UploadProductMasi;
