/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-no-comment-textnodes */
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
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;

  & > * {
    margin-bottom: 8px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
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

 


  const [editProduct, setEditProduct] = useState(null); // Producto seleccionado para edición

 

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };
  


  const handleUpdateProduct = () => {
    // Encuentra el índice del producto editado en la lista de productos
    const editedProductIndex = products.findIndex((p) => p.barcode === editProduct.barcode);
  
    // Actualiza el producto en la lista con los nuevos valores
    const updatedProduct = {
      ...editProduct,
      quantity: parseInt(editProduct.quantity, 10), // Convierte a número entero
      costo: parseFloat(editProduct.costo), // Convierte a número de punto flotante
      price: parseFloat(editProduct.price), // Convierte a número de punto flotante
    };
    // Actualiza la lista de productos

    const updatedProducts = [...products];
    updatedProducts[editedProductIndex] = updatedProduct;
  


    setProducts(updatedProducts);
  
    // Limpia el estado de editProduct
    setEditProduct(null);
  };
  const handleCancelEdit = () => {
  // Limpia el estado de editProduct
  setEditProduct(null);
};


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
      <div style={{ display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' }}>
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
            Buscar Productos{' '}
          </Button>
          <hr/>
          <ErrorMessage message={availableProducts.products.message} show={searchError} />
         
          {editProduct ? (
  // Renderizar el formulario de edición aquí, utilizando los valores de editProduct
  <div>
  <input style={{ padding:'10px', marginBottom:'10px', border:'1px solid #ccc',
  boxSizing:'border-box', borderRadius:'4px', fontSize:'16px', marginLeft:'5px'}}
  type="text"
  value={editProduct.barcode}
  onChange={(e) => {
    // Actualiza el nombre del producto en modo de edición
    const updatedCodigo= e.target.value;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      barcode: updatedCodigo,
    }));
  }}
  />


<input
style={{ padding:'10px', marginBottom:'10px', border:'1px solid #ccc',
boxSizing:'border-box', borderRadius:'4px', fontSize:'16px'}}
  type="text"
  value={editProduct.name}
  onChange={(e) => {
    // Actualiza el nombre del producto en modo de edición
    const updatedName = e.target.value;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      name: updatedName,
    }));
  }}
  />
  <input style={{ padding:'10px', marginBottom:'10px', border:'1px solid #ccc',
  boxSizing:'border-box', borderRadius:'4px', fontSize:'16px', marginLeft:'5px'}}
  type="text"
  value={editProduct.description}
  onChange={(e) => {
    // Actualiza el nombre del producto en modo de edición
    const updatedDescription = e.target.value;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      description: updatedDescription ,
    }));
  }}
  />

<input style={{ padding:'10px', marginBottom:'10px', border:'1px solid #ccc',
  boxSizing:'border-box', borderRadius:'4px', fontSize:'16px', marginLeft:'5px'}}
 
  type='number'
  inputMode='numeric'
  value={editProduct.quantity}
  onChange={(e) => {
    // Actualiza el nombre del producto en modo de edición
    const updatedQuantity = e.target.value;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      quantity: updatedQuantity ,
    }));
  }}
  />
  <input style={{ padding:'10px', marginBottom:'10px', border:'1px solid #ccc',
  boxSizing:'border-box', borderRadius:'4px', fontSize:'16px', marginLeft:'5px'}}
  inputMode="decimal"
  type='number'
  value={editProduct.costo}
  onChange={(e) => {
    // Actualiza el nombre del producto en modo de edición
    const updatedCosto = e.target.value;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      costo: updatedCosto ,
    }));
  }}
  />
<input style={{ padding:'10px', marginBottom:'10px', border:'1px solid #ccc',
  boxSizing:'border-box', borderRadius:'4px', fontSize:'16px', marginLeft:'5px'}}
   inputMode="decimal"
   type='number'
  value={editProduct.price}
 
  onChange={(e) => {
    // Actualiza el nombre del producto en modo de edición
    const updatedPrice = e.target.value;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      price: updatedPrice ,
    }));
  }}
  />
    <Button   style={{backgroundColor:'#4caf50', color:"#fff", marginLeft:'10px', marginRight:'10px'}}
  color="secondary" onClick={handleUpdateProduct}>Guardar cambios</Button>
    {/* Botón para cancelar la edición */}
    <Button   variant="contained"
  color="secondary" onClick={handleCancelEdit}>Cancelar</Button>
  </div>
) : (

          <Table>

        
            <TableHead>
                    <TableRow>
                      <TableCell>Codigo</TableCell>
                      <TableCell align="center">Producto</TableCell>
                      <TableCell align="center">Descripcion</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="center">Costo</TableCell>
                      <TableCell align="center">PrecioVenta</TableCell>
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
                          <TableCell>
                            
                            <button onClick={() => handleEditProduct(product)}>Editar</button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                   
                               
  </Table>

  )}
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
