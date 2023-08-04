/* eslint-disable consistent-return */
const {Op} = require('sequelize')

const { Expense } = require('../db');

// Obtener todos los gastos con opciones de filtrado y ordenamiento
const getExpenses = async (req, res, next) => {
  try {
    // Opciones de filtrado y ordenamiento
    const { startDate, endDate, sortBy, sortDirection } = req.query;

    // Construir objeto de opciones de consulta
    const options = {};

    // Filtros por rango de fechas
    if (startDate && endDate) {
      options.fecha = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Ordenamiento
    options.order = [[sortBy || 'fecha', sortDirection || 'DESC']];

    // Obtener los gastos con las opciones de consulta
    const expenses = await Expense.findAll(options);
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los gastos' });
    next(error);
  }
};

// Obtener un gasto por su ID
const getExpenseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }
    res.status(200).json({ expense });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el gasto' });
    next(error);
  }
};

// Crear un nuevo gasto
const createExpense = async (req, res, next) => {
  const { concepto, monto, fecha, montoDolar } = req.body;
  try {
    // Validar los campos requeridos
    if (!concepto || !monto || !fecha || !montoDolar) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Crear el gasto en la base de datos
    const expense = await Expense.create({
      concepto,
      monto,
      fecha,
      montoDolar
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el gasto' });
    next(error);
  }
};

// Actualizar un gasto
const updateExpense = async (req, res, next) => {
  const { id } = req.params;
  const { concepto, monto, fecha, montoDolar } = req.body;
  try {
    // Verificar si el gasto existe
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    // Actualizar los campos del gasto
    expense.concepto = concepto || expense.concepto;
    expense.monto = monto || expense.monto;
    expense.fecha = fecha || expense.fecha;
    expense.montoDolar =montoDolar 
    await expense.save();

    res.status(200).json({ message: 'Gasto actualizado exitosamente', expense });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el gasto' });
    next(error);
  }
};

// Eliminar un gasto
const deleteExpense = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Verificar si el gasto existe
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    // Eliminar el gasto de la base de datos
    await expense.destroy();

    res.status(200).json({ message: 'Gasto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el gasto' });
    next(error);
  }
};



const getWeeklyExpenses = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);

    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
    });

    const totalExpense = expenses.reduce((total, expense) => total + parseFloat(expense.monto), 0);
    const totalExpenseDolar = expenses.reduce((total, expense) => total + parseFloat(expense.montoDolar), 0);

    res.status(200).json({ message: 'Total Gasto de la Semana', totalExpense, totalExpenseDolar });
  } catch (error) {
    next(error);
  }
};


  const getMonthlyExpenses = async (req, res, next) => {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
      const expenses = await Expense.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });
  
      const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
  
      res.status(200).json({ message: 'Gastos mensuales', totalExpense });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getMonthlyExpenses,
  getWeeklyExpenses
};
