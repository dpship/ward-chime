import servicesData from "./services.json";

export interface Service {
  id: number;
  code: string;
  name: string;
  department: string;
  subDepartment: string;
  type: string;
  cost: number;
}

export const services: Service[] = servicesData as Service[];

export function searchServices(query: string, limit: number = 20): Service[] {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  return services
    .filter(
      (service) =>
        service.name.toLowerCase().includes(lowerQuery) ||
        service.code.toLowerCase().includes(lowerQuery) ||
        service.department.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}

export function getServiceByName(name: string): Service | undefined {
  return services.find(
    (service) => service.name.toLowerCase() === name.toLowerCase()
  );
}

export function getServiceById(id: number): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getServicesByDepartment(department: string): Service[] {
  return services.filter(
    (service) => service.department.toLowerCase() === department.toLowerCase()
  );
}

export function getAllDepartments(): string[] {
  const departments = new Set(services.map((s) => s.department));
  return Array.from(departments).sort();
}
