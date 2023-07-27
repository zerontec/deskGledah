/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState,useEffect  } from 'react';

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

const ProductRow = ({
	handlePriceChange,
	product,
	index,
	editedPrices,
	setEditedPrices,
	products,
	setProducts,
	setSubtotal
  }) => {
	const [editedPrice, setEditedPrice] = useState(editedPrices[index] || product.price);
	const [isEditingPrice, setIsEditingPrice] = useState(false);
	useEffect(() => {
		updateSubtotal(); // Llamar a updateSubtotal() cuando editedPrices cambie
	  }, [editedPrices]);

	const handlePriceEdit = () => {
	  setIsEditingPrice(true);
	};
  
const handlePriceSave = () => {
  setIsEditingPrice(false);
  const updatedPrices = [...editedPrices];
  updatedPrices[index] = editedPrice;
  setEditedPrices(updatedPrices);

  updateSubtotal(); // Actualizar el subtotal después de guardar el precio
	
};
  
const handleRemoveProduct = (index) => {
    const newList = [...products];
    newList.splice(index, 1);
    setProducts(newList);
  
    const updatedEditedPrices = [...editedPrices];
    updatedEditedPrices.splice(index, 1);
    setEditedPrices(updatedEditedPrices);
  
    updateSubtotal();
  };
  
	const handlePriceInputChange = (event) => {
	  setEditedPrice(event.target.value);
	  handlePriceChange(index, event.target.value); // Llamar a handlePriceChange() con el nuevo precio
	updateSubtotal()
	};
	const updateSubtotal = () => {
	  const updatedSubtotal = products.reduce((subtotal, item, idx) => {
		const price = editedPrices[idx] !== undefined ? editedPrices[idx] : item.price;
		return subtotal + item.cantidad * price;
	  }, 0);
	  setSubtotal(updatedSubtotal);
	};
  

	return (
	  <TableRow key={index}>
		<TableCell>{product.barcode}</TableCell>
		<TableCell>{product.name}</TableCell>
		<TableCell>{product.description}</TableCell>
		<TableCell>
		  {isEditingPrice ? (
			<TextField
			  value={editedPrice}
			  onChange={handlePriceInputChange}
			  onBlur={handlePriceSave}
			/>
		  ) : (
			<span onClick={handlePriceEdit}>{editedPrice}</span>
		  )}
		</TableCell>
		<TableCell>{product.cantidad}</TableCell>
		<TableCell>{product.subtotal}</TableCell>
		<TableCell>
		  <Button variant="contained" color="error" onClick={handleRemoveProduct}>
			Quitar
		  </Button>
		</TableCell>
	  </TableRow>
	);
  };
  
  export default ProductRow;
  
  


