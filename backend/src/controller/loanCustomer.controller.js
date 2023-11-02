/* eslint-disable consistent-return */
const {LoanClient, Customer, PaymentClient} = require('../db');



const createLoan = async (req, res, next) => {
    try {
      const { codigoClinte, amount, notes, phoneNumber } = req.body;
  
      // Verificar si el vendedor existe
      const customer = await Customer.findOne({
        where: { identification: codigoClinte },
      });
      if (!customer) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
  
      // Crear la deuda para el vendedor
      const debt = await LoanClient.create({
        customerId: customer.id, // Utilizamos el ID del vendedor para relacionar la deuda
        amount,
        notes,
        phoneNumber,
        status:'pendiente',
        codigoClinte
      });


  
      res.status(201).json(debt);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la deuda", error });
      next(error);
    }
  };
  


  const getAllLoan = async (req, res, next) => {
    try {
      
        const loansClinte = await LoanClient.findAll({
            where: {
              status: 'pendiente', // Filtrar solo las deudas pendientes
            },
            include: [{ model: Customer }],
          });
          
      res.status(200).json(loansClinte);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los préstamos del cliente' });
    next(error)
    }
  };


  const getLoansByCustomer = async (req, res, next) => {
    try {
      const  loanId  = req.body;
  
      const loans = await PaymentClient.findAll({
        where:  loanId 
      });
  
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los préstamos del Cliente' });
      console.log(error)
    }
  };


  const updateLoanStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status,  notes, amount } = req.body;
  
      const loan = await LoanClient.findByPk(id)
  
      if (!loan) {
        return res.status(404).json({ message: 'Préstamo no encontrado' });
      }
  
      loan.status = status;
      loan.notes = notes
      loan.amount=amount
  
      // Actualizar el monto solo si se proporciona en el cuerpo de la solicitud
      if (amount !== undefined) {
        loan.amount = amount;
      }
  
      await loan.save();
  
      // Obtener la suma total de las deudas del vendedor
      const customerId = loan.customerId;
      const totalDebt = await LoanClient.sum('amount', {
        where: {
          customerId,
          status: 'pendiente'
        }
      });
  
      res.status(200).json({ loan, totalDebt });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el estado del préstamo' });
   next(error)
    
    }
  };
  


  const deleteLoan = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const loan = await LoanClient.findByPk(id);
  
      if (!loan) {
        return res.status(404).json({ message: 'Préstamo no encontrado' });
      }
  
      await loan.destroy();
  
      res.status(200).json({ message: 'Préstamo eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el préstamo' });
    }
  };

  const getCustomerDebt = async (req, res, next) => {
    try {
      const { customerId } = req.params;
  
      // Consultar la deuda del vendedor utilizando el ID y obtener los datos del vendedor
      const customer = await Customer.findByPk(
        
        customerId);
      const debt = await LoanClient.sum('amount', {
        where: {
         customerId,
          status: "pendiente", // Filtrar solo las deudas pendientes
        }
      });
  
      res.json({ customer, debt });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la deuda y los datos del vendedor', error });
    next(error)
    }
  };
  


  const createPayment = async (req, res, next) => {
    try {
      const { loanId, amount, paymentDate, } = req.body;
  
      const loan = await LoanClient.findByPk(loanId);
  
      if (!loan) {
        return res.status(404).json({ message: 'Préstamo no encontrado' });
      }
  
      // Realizar validaciones adicionales, como verificar que el monto del abono sea válido
  
      const remainingAmount = loan.amount - amount;
  
      if (remainingAmount < 0) {
        return res.status(400).json({ message: 'El monto del abono excede el monto del préstamo' });
      }
  
      // Actualizar el monto del préstamo y el estado si corresponde
      loan.amount = remainingAmount;
      if (remainingAmount === 0) {
        loan.status = 'pagada';
      }
  
      await loan.save();
  
      // Guardar el abono en el modelo Payment
      const payment = await PaymentClient.create({
        loanId,
        amount,
        paymentDate,
        customerId:loan.customerId
      });
  
      res.status(201).json({ message: 'Abono realizado exitosamente', loan, payment });
    } catch (error) {
      res.status(500).json({ message: 'Error al realizar el abono' });
      next(error);
    }
  };
  
  

  const updatePayment = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { amount, paymentDate } = req.body;
  
      const payment = await PaymentClient.findByPk(id);
  
      if (!payment) {
        return res.status(404).json({ message: 'Abono no encontrado' });
      }
  
      payment.amount = amount;
      payment.paymentDate = paymentDate;
  
      await payment.save();
  
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el abono' });
      next(error);
    }
  };
  const getCompletedPayments = async (req, res, next) => {
    try {
      const completedPayments = await PaymentClient.findAll();
  
      // Obtener los vendedores o empleados asociados a las deudas
      const customerIds = completedPayments.map(payment => payment.cutomerId);
      const customers = await Customer.findAll({
        where: { id: customerIds },
      });
  
      // Agregar la información de los vendedores o empleados a los abonos realizados
      const paymentsWithSeller = completedPayments.map(payment => {
        const customer= customers.find(customer=> customer.id === payment.customerId);
        return {
          ...payment.toJSON(),
          customer: customer? customer.toJSON() : null,
        };
      });
  
      res.status(200).json(paymentsWithSeller);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los abonos realizados' });
      next(error);
    }
  };
  

  module.exports = {
    createLoan,
    getLoansByCustomer,
    updateLoanStatus,
    deleteLoan,
    getAllLoan,
    getCustomerDebt,
    createPayment,
    updatePayment,
    getCompletedPayments
  };