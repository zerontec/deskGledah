/* eslint-disable consistent-return */

const {PaymentCuenta,Customer, AccountsReceivable, InvoiceFactura} = require('../db')

const createAccountsReceivable = async (req, res, next) => {
    try {
      const {clientData,status,notes,    amount, dueDate } = req.body;
  
      // const existingSale = await Sale.findByPk(saleId);
      const existingCustomer = await Customer.findByPk(customerId);
  
      if ( !existingCustomer) {
        return res.status(404).json({ message: ' cliente no encontrado' });
      }
  
      const newAccountsReceivable = await AccountsReceivable.create({
        clientData,
        status,
        notes,
        amount,
        dueDate,
        paid: false, // Inicialmente se establece como no pagado
      });
  
      res.status(200).json(newAccountsReceivable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al crear la cuenta por cobrar' });
    }
  };
  
  const updateAccountsReceivable = async (req, res, next) => {
    try {
      const id= req.params.id;
      const { amount, dueDate, paid } = req.body;
  
      const accountsReceivable = await AccountsReceivable.findByPk(id);
  
      if (!accountsReceivable) {
        return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
      }
      
        accountsReceivable.update(req.body);
        res
          .status(201)
          .json({ message: `cuenta por Cobrar  con ${id} actualizado con exito ` });
      
      // accountsReceivable.amount = amount;
      // accountsReceivable.dueDate = dueDate;
      // accountsReceivable.paid = paid;
  
      // await accountsReceivable.save();
  
      // res.status(200).json(accountsReceivable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al actualizar la cuenta por cobrar' });
    }
  };
  
  const deleteAccountsReceivable = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const accountsReceivable = await AccountsReceivable.findByPk(id);
  
      if (!accountsReceivable) {
        return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
      }
  
      await accountsReceivable.destroy();
  
      res.status(200).json({ message: 'Cuenta por cobrar eliminada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al eliminar la cuenta por cobrar' });
    }
  };
  
  const getAccountsReceivable = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const accountsReceivable = await AccountsReceivable.findByPk(id, {
        include: [InvoiceFactura, Customer],
      });
  
      if (!accountsReceivable) {
        return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
      }
  
      res.status(200).json(accountsReceivable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al obtener la cuenta por cobrar' });
    }
  };
  
  const getAllAccountsReceivable = async (req, res, next) => {
    try {
      const accountsReceivable = await AccountsReceivable.findAll({
        include: [InvoiceFactura, Customer],
      });
  
      res.status(200).json(accountsReceivable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al obtener las cuentas por cobrar' });
    }
  };


  const createPayment = async (req, res, next) => {
    try {
      const {notes,  montoPagado, fechaPago, ventaId, metodoPago } = req.body;
  
      // Obtener la cuenta por pagar correspondiente a la compra
      const accountReceivable = await AccountsReceivable.findByPk(ventaId);
  
      // Verificar si la cuenta por cobrar existe y no ha sido pagada anteriormente
      if (!accountReceivable || accountReceivable.status === "pagada") {
        return res
          .status(400)
          .json({ message: "La cuenta por cobrar no existe o ya ha sido pagada" });
      }
  
      const abonos = parseFloat(accountReceivable.abonos) || 0;
      let saldoPendientes = parseFloat(accountReceivable.saldoPendiente) || 0;
      const montoTotal = parseFloat(accountReceivable.montoCobrar) || 0;
  
      // Verificar si el monto pagado es válido
      if (montoPagado <= 0) {
        return res.status(400).json({ message: "El monto pagado debe ser mayor a cero" });
      }
  
      // Verificar si el monto pagado excede el saldo pendiente
      if (montoPagado > accountReceivable.montoCobrar  && montoPagado !== saldoPendientes) {
        return res.status(400).json({ message: "El monto pagado excede el saldo pendiente de la cuenta por pagar" });
      }
  
      let nuevoSaldoPendiente=0;
      // Calcular el nuevo saldo pendiente y los nuevos abonos
      const nuevoAbono = abonos + montoPagado;
      console.log("nuevoAbono ",nuevoAbono )
        if(saldoPendientes=== 0){
           nuevoSaldoPendiente= accountReceivable.montoCobrar-montoPagado
  
        }else{
  
           nuevoSaldoPendiente = saldoPendientes - montoPagado;
        }
        
  
     
      console.log("nuevoSaldoPendiente ",nuevoSaldoPendiente)
      // Actualizar el saldo pendiente y los abonos en la cuenta por pagar
      accountReceivable.abonos = nuevoAbono.toFixed(2);
      accountReceivable.saldoPendiente = nuevoSaldoPendiente.toFixed(2);
      await accountReceivable.save();
  
      // Verificar si la cuenta por pagar ha sido totalmente pagada
      if (nuevoSaldoPendiente === 0) {
        accountReceivable.status = "Cobrada";
        await accountReceivable.save();
      }
  
      // Crear el pago en la base de datos
      const payment = await PaymentCuenta.create({
      
        montoPagado,
        fechaPago,
        // metodoPago,
        ventaId, // Asignar el ID de la compra al campo de clave externa
        notes
      });
  
      // Respuesta exitosa
      res.status(201).json({ message: "Pago creado exitosamente", payment });
    } catch (error) {
      // Error al crear el pago
      res.status(500).json({ message: "Error al crear el pago de la cuenta por pagar" });
      next(error);
    }
  };
  
  const getAllPagoVentasID = async(req, res, next)=> {

    try{
      const ventaId = req.body;
    
      const pago = await PaymentCuenta.findAll({
        
        where:ventaId
    
    
    
      });
    
    if(!pago){
    
      return res.status(404).json({message:'No se encontraron pagos con ese Id'})
    }
    
    res.status(200).json(pago)
    
    
    
    
    }catch(error){
    
      res.status(500).json(error)
    
      next(error)
    
    }
    
    
    
    }
    



  
  module.exports = {
    createAccountsReceivable,
    updateAccountsReceivable,
    deleteAccountsReceivable,
    getAccountsReceivable,
    getAllAccountsReceivable,
    createPayment,
    getAllPagoVentasID
  };
  