const Task = require('../models/task')
const { publishEvent } = require('./webhookController')
const winston = require('winston')
const { validationResult } = require('express-validator')

exports.createTask = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { title, description } = req.body

  const task = new Task({
    title,
    description,
    createdAt: new Date(),
  })

  try {
    await task.save()
    // Publish task creation event to RabbitMQ
    publishEvent(req.channel, 'TaskCreated', task)

    res.status(201).json(task)
  } catch (err) {
    winston.error({ LEVEL: 'createTask error', ERROR: err })
    res.status(500).json({ error: 'Error creating task' })
  }
}
exports.getTasks = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (err) {
    winston.error({ LEVEL: 'getTasks error', ERROR: err })
    res.status(500).json({ error: 'Error fetching tasks' })
  }
}

exports.getTaskById = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const taskId = req.params.taskId

  try {
    const task = await Task.findById(taskId)
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.json(task)
  } catch (err) {
    winston.error({ LEVEL: 'createTask error', ERROR: err })
    res.status(500).json({ error: 'Error fetching task' })
  }
}

exports.updateTask = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const taskId = req.params.taskId
  const { title, description } = req.body

  try {
    const task = await Task.findByIdAndUpdate(taskId, { title, description }, { new: true })

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    // Publish task update event to RabbitMQ
    publishEvent(req.channel, 'TaskUpdated', task)

    res.json(task)
  } catch (err) {
    winston.error({ LEVEL: 'updateTask error', ERROR: err })
    res.status(500).json({ error: 'Error updating task' })
  }
}

exports.deleteTask = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const taskId = req.params.taskId

  try {
    const task = await Task.findByIdAndDelete(taskId)

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    // Publish task deletion event to RabbitMQ
    publishEvent(req.channel, 'TaskDeleted', task)

    res.json({ message: 'Task deleted successfully' })
  } catch (err) {
    winston.error({ LEVEL: 'deleteTask error', ERROR: err })
    res.status(500).json({ error: 'Error deleting task' })
  }
}
