/* eslint-disable object-shorthand */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */

const {Sequelize}= require('sequelize')
const {ProductoDevuelto,InvoiceFactura,ProductosDefectuosos,Purchase,DevolucionesCompras,NotaDebito ,Product  }= require('../db');

InvoiceFactura.prototype.getProductos = async function () {
  const products = await this.getProducts();
  return products;
};

const generarDevolucionNumber = async () => {
    // Obtener el número de devolución más alto actualmente en la base de datos
    const highestDevolucion = await DevolucionesCompras.findOne({
      attributes: [
        [Sequelize.fn("max", Sequelize.col("numeroDevolucion")), "maxDevolucion"],
      ],
    });
  
    // Obtener el número de devolución más alto o establecerlo en 0 si no hay devoluciones existentes
    const highestDevolucionNumber = highestDevolucion
      ? highestDevolucion.get("maxDevolucion")
      : 0;
  
    // Incrementar el número de devolución en 1
    const nextDevolucionNumber = highestDevolucionNumber + 1;
  
    return nextDevolucionNumber;
  };

  const generarNumeroNota = async () => {
    // Obtener el número de devolución más alto actualmente en la base de datos
    const highestNota = await NotaDebito.findOne({
      attributes: [
        [Sequelize.fn("max", Sequelize.col("numeroNota")), "maxNota"],
      ],
    });
  
    // Obtener el número de devolución más alto o establecerlo en 0 si no hay Noataes existentes
    const highestNotaNumber = highestNota
      ? highestNota.get("maxNota")
      : 0;
  
    // Incrementar el número de devolución en 1
    const nextNotaNumber = highestNotaNumber + 1;
  
    return nextNotaNumber;
  };


const crearDevolucionCompra = async (req, res, next) => {
  try {
    const {invoiceNumber, id,purchaseNumber, motivo, productos } = req.body;


    // Verificar si la compra existe
    const compra = await Purchase.findOne({
      where: {
        purchaseNumber,
      }, 
      
      // {
      //   include: {
      //   model: Product,
      //   as: 'productos',
      // },
    
    });

    if (!compra) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    // Verificar si la compra ya tiene una devolución asociada
    // const devolucionExistente = await DevolucionCompras.findOne({
    //   where: { numeroFactura },
    // });

    // if (devolucionExistente) {
    //   return res
    //     .status(400)
    //     .json({ message: 'Ya se ha creado una devolución para esta compra' });
    // }

    let totalDevolucion = 0;

    // const productosArray = Array.isArray(productos) ? productos : [productos];
    // Actualizar los montos totales de la compra y los productos devueltos
   

    for (const producto of productos) {
      const { id, quantity, defectuoso, barcode } = producto;

      // Verificar si el producto existe en la factura
      let productoFactura = null;

      for (const productoFacturaItem of compra.productDetails) {
        if (productoFacturaItem.barcode === barcode) {
          productoFactura = productoFacturaItem;
          break;
        }
      }

      if (!productoFactura) {
        return res
          .status(400)
          .json({ message: "El producto no existe en la factura" });
      }
      // Verificar que la cantidad devuelta no supere la cantidad comprada
      if (quantity > productoFactura.quantity) {
        return res.status(400).json({
          message: 'La cantidad devuelta es mayor a la cantidad comprada',
        });
      }

      // Actualizar la cantidad devuelta del producto en la compra
      productoFactura.cantidadDevuelta += quantity;

      // Calcular el monto total de la devolución para el producto
      const montoDevuelto = quantity * productoFactura.price;

      totalDevolucion += montoDevuelto;


    }

    // Actualizar el monto total de la compra
    compra.montoTotal -= totalDevolucion;
    await compra.save();

    for (const producto of productos) {
      const { barcode, quantity } = producto;

      const productoEnTabla = await ProductosDefectuosos.findOne({
        where: { barcode },
      });

      if (productoEnTabla) {
        productoEnTabla.cantidadDevuelta -= quantity;
        await productoEnTabla.save();
      }
    }

    for(const producto of productos){

      const {barcode, quantity} = producto;

      const productoTabla = await Product.findOne({
          where:{barcode},

      });
      if (productoTabla){

        productoTabla.quantity += quantity;
          await productoTabla.save();
      }

    }




    // Crear la devolución en compra
    const numeroDevolucion = await generarDevolucionNumber();
    console.log("numero devolucion", numeroDevolucion)
    
    const montoDev = totalDevolucion + 0.16;
    const devolucionCompra = await DevolucionesCompras.create({
      numeroDevolucion,
      fechaDevolucion: new Date(),
      motivo,
      invoiceNumber,
      
      total: montoDev,
       productoD: productos,
       purchaseNumber


    });
    await compra.save();
    // tengo que sacar el o los  productos de defectuoso y agregar a porductos 
    // Actualizar la cantidad de productos devueltos en la tabla Product
   

    // Crear la nota de débito
    const numeroNota = await generarNumeroNota();
   
    const notaDebito = await NotaDebito.create({
      numeroNota,
      fechaEmision: new Date(),
      motivo,
      montoDev: montoDev || 0,
      // numeroDevolucion,
      productosDevueltos: JSON.stringify(productos),
      facturaAfectada: purchaseNumber,
      monto: totalDevolucion,
      // supplierData:compra.
    });


    await devolucionCompra.save();

    res.status(201).json({ message: 'Devolución en compra creada exitosamente' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Ocurrió un error al crear la devolución en compra' });
  next(error)
    }
};









const obtenerDevolucionesCompras = async (req, res, next) => {
  try {
    const devoluciones = await DevolucionesCompras.findAll({
      // Aquí puedes incluir opciones de consulta, como incluir modelos relacionados
    });
    res.json(devoluciones);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener las devoluciones de ventas" });
    next(error);
  }
};





const obtenerDevolucionCompra= async (req, res, next) => {
  try {
    const { id } = req.params;

    const devolucion = await DevolucionesCompras.findByPk(id, {
      include: [
        {
          model: ProductoDevuelto,
          as: "productosDevueltos",
          // include: [Product], // Incluye el modelo de producto
        },
      ],
    });

    if (!devolucion) {
      return res
        .status(404)
        .json({ message: "Devolución de venta no encontrada" });
    }

    res.json(devolucion);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener la devolución de venta" });

    next(error);
  }
};

const editDevolucionCompra =async(req, res, net)=> {

  try{
  
  const id = req.params.id
  const { motivo, total} = req.body;
  
  const devolucion = await DevolucionesCompras.findByPk(id);
  if(devolucion){
  
      devolucion.update({
  
  // eslint-disable-next-line object-shorthand
  motivo:motivo,
  total:total
  
      });
  
  res.status(201).json({messague:"Devolucion edita exitosamente"})
  
  
  }else res.staus(404).json({messague:"no se encontro devolucion con ese id"})
  
  
  
  
  
  }catch(err){
  
      res.status(500).json(err)
     
  }
  
  } 
  


module.exports = {
  crearDevolucionCompra,
  obtenerDevolucionCompra,
  obtenerDevolucionesCompras,
  editDevolucionCompra
};
