export interface Employee {
    id: number;
    cedula: string;
    fullname: string;
    pricePerHour: number;
  }
  
  export interface WorkedHour {
    employeeId: number;
    hours: number;
  }
  
  // Predefinir algunos empleados en la lista
  export const db = {
    employees: [
      { id: 1, cedula: "001-1234567-8", fullname: "Juan Perez", pricePerHour: 500 },
      { id: 2, cedula: "002-2345678-9", fullname: "Maria Lopez", pricePerHour: 600 },
      { id: 3, cedula: "003-3456789-0", fullname: "Carlos Gomez", pricePerHour: 450 }
    ] as Employee[],
    
    workedHours: [] as WorkedHour[]
  };