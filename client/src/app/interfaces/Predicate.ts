export interface Predicate {
  value: string | number | boolean;
  type: 'contains' | 'greater_than' | 'less_than'; //TODO: Con mas tiempo, manejar mas opciones y ordenrlas en un enum.
  field: string;
}