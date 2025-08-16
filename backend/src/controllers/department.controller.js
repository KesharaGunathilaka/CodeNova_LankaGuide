import Department from '../models/department.js';
import Service from '../models/service.js';

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single department with its services
export const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    const services = await Service.find({ department: req.params.id });
    res.json({ department, services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create department (admin only)
export const createDepartment = async (req, res) => {
  const { name, description, imageUrl } = req.body;
  
  try {
    const department = new Department({
      name,
      description,
      imageUrl: imageUrl || ''
    });
    
    const savedDepartment = await department.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};