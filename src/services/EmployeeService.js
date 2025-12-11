import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Nigerian employee names for sample data
const nigerianNames = [
  'Adebayo Johnson',
  'Chinwe Okoro',
  'Emeka Nwosu',
  'Funmi Adeyemi',
  'Gbenga Okafor',
  'Halima Bello',
  'Ifeanyi Eze',
  'Jumoke Adebayo',
  'Kemi Ogunleye',
  'Lola Ibrahim',
  'Mustapha Aliyu',
  'Ngozi Chukwu',
  'Olufemi Adeolu',
  'Patience Nwankwo',
  'Quadri Yusuf',
  'Rashida Hassan',
  'Sola Adewale',
  'Tunde Bakare',
  'Uche Nnamdi',
  'Victoria Okafor',
];

class EmployeeService {
  async getAllEmployees() {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeeById(id) {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  async createEmployee(employeeData) {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(id) {
    try {
      await api.delete(`/employees/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  // Method to generate sample employees with Nigerian names
  generateSampleEmployees(count = 10) {
    const employees = [];
    for (let i = 0; i < count; i++) {
      const name = nigerianNames[i % nigerianNames.length];
      const [firstName, lastName] = name.split(' ');
      employees.push({
        id: i + 1,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu.ng`,
        phone: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        department: ['Mathematics', 'English', 'Science', 'History', 'Arts'][Math.floor(Math.random() * 5)],
        position: ['Teacher', 'Principal', 'Vice Principal', 'Counselor', 'Librarian'][Math.floor(Math.random() * 5)],
        salary: Math.floor(Math.random() * 50000) + 30000,
        hireDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
      });
    }
    return employees;
  }
}

const employeeService = new EmployeeService();
export default employeeService;
