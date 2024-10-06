"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("./models");
const router = (0, express_1.Router)();
// Obtener todos los empleados
router.get('/employee', (req, res) => {
    res.json(models_1.db.employees);
});
// Obtener un empleado por id
router.get('/employee/:id', (req, res) => {
    const employee = models_1.db.employees.find(e => e.id === parseInt(req.params.id));
    if (employee) {
        res.json(employee);
    }
    else {
        res.status(404).send('Employee not found');
    }
});
// Obtener todas las horas trabajadas por un empleado
router.get('/employee/:id/hours', (req, res) => {
    const employeeId = parseInt(req.params.id);
    const hours = models_1.db.workedHours.filter(h => h.employeeId === employeeId);
    res.json(hours);
});
// Obtener el salario a pagar basado en las horas trabajadas
router.get('/employee/:id/salary', (req, res) => {
    const employeeId = parseInt(req.params.id);
    const employee = models_1.db.employees.find(e => e.id === employeeId);
    if (!employee) {
        return res.status(404).send('Employee not found');
    }
    const totalHours = models_1.db.workedHours
        .filter(h => h.employeeId === employeeId)
        .reduce((sum, h) => sum + h.hours, 0);
    const salary = totalHours * employee.pricePerHour;
    res.json({ salary });
});
// Agregar un nuevo empleado
router.post('/employee', (req, res) => {
    const { cedula, fullname, pricePerHour } = req.body;
    const newEmployee = {
        id: models_1.db.employees.length + 1,
        cedula,
        fullname,
        pricePerHour
    };
    models_1.db.employees.push(newEmployee);
    res.status(201).json(newEmployee);
});
// Agregar un registro de horas trabajadas
router.post('/employee/:id/hours', (req, res) => {
    const employeeId = parseInt(req.params.id);
    const { hours } = req.body;
    const newWorkedHour = {
        employeeId,
        hours
    };
    models_1.db.workedHours.push(newWorkedHour);
    res.status(201).json(newWorkedHour);
});
// Actualizar la información del empleado
router.put('/employee/:id', (req, res) => {
    const employeeId = parseInt(req.params.id);
    const { fullname, pricePerHour } = req.body;
    const employee = models_1.db.employees.find(e => e.id === employeeId);
    if (employee) {
        employee.fullname = fullname;
        employee.pricePerHour = pricePerHour;
        res.json(employee);
    }
    else {
        res.status(404).send('Employee not found');
    }
});
// Borrar un empleado y todos sus registros de horas trabajadas
router.delete('/employee/:id', (req, res) => {
    const employeeId = parseInt(req.params.id);
    models_1.db.employees = models_1.db.employees.filter(e => e.id !== employeeId);
    models_1.db.workedHours = models_1.db.workedHours.filter(h => h.employeeId !== employeeId);
    res.status(204).send();
});
exports.default = router;
