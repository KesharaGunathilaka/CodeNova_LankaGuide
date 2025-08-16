import Service from '../models/service.js';
import Department from '../models/department.js';

// Get all services for a department
export const getServicesByDepartment = async (req, res) => {
  try {
    const services = await Service.find({ department: req.params.departmentId });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single service
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('department');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create service (admin only)
export const createService = async (req, res) => {
  const { name, description, shortDescription, imageUrl, departmentId } = req.body;
  
  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    const service = new Service({
      name,
      description,
      shortDescription,
      imageUrl: imageUrl || '',
      department: departmentId
    });
    
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

