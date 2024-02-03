const { body, param } = require('express-validator')

exports.validateCreateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
]

exports.validateUpdateTask = [
  param('taskId').isMongoId().withMessage('Invalid task ID'),
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('description').optional().notEmpty().withMessage('Description is required'),
]

exports.validateGetTaskById = [param('taskId').isMongoId().withMessage('Invalid task ID')]

exports.validateDeleteTask = [param('taskId').isMongoId().withMessage('Invalid task ID')]
