from src.filter_engine.core.filter_interface import PredicateInput
from src.filter_engine.predicates.contains_predicate import FieldContains
from src.filter_engine.predicates.greater_than_predicte import FieldGreaterThan
from src.filter_engine.predicates.lower_than_predicte import FieldLowerThan
from src.filter_engine.core.predicate import Predicate

#TODO: Importar los predicados que se vayan creando en el futuro

def predicate_factory(f: PredicateInput) -> Predicate:
  '''
  Usa el patron Factory para crear instancias de los predicados de manera dinamica.
  '''
  field = f.field
  value = f.value
  ftype = f.type

  match ftype:
    case "lower_than":
      return FieldLowerThan(field, value)
    case "greater_than":
      return FieldGreaterThan(field, value)
    case "contains":
      return FieldContains(field, value)
    case _:
      raise ValueError(f"Unknown predicate type: {ftype}")