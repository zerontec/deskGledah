import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { uploadMasi } from '../../../redux/modules/products';

const UploadProductMasi = () => {

const dispatch = useDispatch();
const [loading, setLoading] = useState(false);
const [messageError, setMessageError] = useState({});
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    barcode: '',
    name: '',
    description:'',
    quantity: '',
    costo:'',
    price: ''
    
   
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const parsedValue = name === 'costo' || name === 'quantity' || name === 'price' ? parseFloat(value) : value;
  
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: parsedValue,
    }));
  };
 
  
  
  function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  
  

  const handleAddProduct = () => {
    const quantityNumber = parseInt(newProduct.quantity, 10);
    const priceNumber = parseFloat(newProduct.price);

 // Verifica si los números son válidos antes de agregar el producto
 if (Number.isNaN(quantityNumber) || Number.isNaN(priceNumber)) {
  // Si alguno de los valores no es un número válido, muestra un mensaje de error
  Swal.fire('Error: La cantidad y el precio deben ser números válidos.');
  console.log('Error: La cantidad y el precio deben ser números válidos.');
  
  return;
}

    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setNewProduct({
      barcode: '',
      name: '',
      description:'',
      quantity: '',
      costo:'',
      price: ''
    });


  };

  const handleDeleteProduct = (index) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
  };

  const handleUploadProducts = () => {
    // Aquí puedes enviar los productos al servidor para su carga masiva
  
	dispatch(uploadMasi(products))
  .then((response) => {
    setLoading(false);
    Swal.fire('Carga creada con éxito!', '', 'success');
	setProducts([])
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <TableContainer>
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
                <TableCell>{product.barcode}</TableCell>
                <TableCell align="center">{product.name}</TableCell>
                <TableCell align="center">{product.description}</TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">{product.costo}</TableCell>
                <TableCell align="center">{product.price}</TableCell>
                
                <TableCell align="center">
                  <DeleteIcon onClick={() => handleDeleteProduct(index)} />
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
        value={newProduct.barcode.toUpperCase()}
        onChange={handleInputChange}
      />
      <TextField
        name="name"
        label="Producto"
        value={capitalizeFirstLetter(newProduct.name)}
        onChange={handleInputChange}
      />
         <TextField
        name="description"
        label="Descripcion"
        value={capitalizeFirstLetter(newProduct.description)}
        onChange={handleInputChange}
      />
   
      <TextField
        name="quantity"
        label="Cantidad"
        type='number'
        inputMode="decimal"
        value={newProduct.quantity}
        onChange={handleInputChange}
      />
    <TextField
        name="costo"
        label="Costo"
        type='number'
        inputMode="decimal"
        value={newProduct.costo}
        onChange={handleInputChange}
      />
      <TextField
        name="price"
        label="Precio Venta"
        type='number'
        inputMode="decimal"
        value={newProduct.price}
        onChange={handleInputChange}
      />
    
        </div>
<div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>

      <Button variant="contained" color="primary" onClick={handleAddProduct} 
	  startIcon={<AddIcon />}
	  disabled={!newProduct.barcode || !newProduct.name ||!newProduct.description || !newProduct.quantity || !newProduct.price || !newProduct.costo}
	  >
        Agregar Producto
      </Button>
      <Button variant="contained" color="secondary" onClick={handleUploadProducts}>
        Cargar Productos
      </Button>

      </div>
    </div>

  );
};

export default UploadProductMasi;
