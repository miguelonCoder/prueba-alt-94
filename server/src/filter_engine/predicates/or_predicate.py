import pandas as pd
from src.filter_engine.core.predicate import Predicate

class Or(Predicate):
    '''Define el operador de concatenacion logica OR entre varios predicados.
    Permite combinar varios predicados y devuelve True si al menos uno de ellos es True
    '''
    def __init__(self, *predicates: Predicate):
        self.predicates = predicates

    def apply(self, df: pd.DataFrame) -> pd.Series:
      return pd.concat([p.apply(df) for p in self.predicates], axis=1).any(axis=1)