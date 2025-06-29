import pandas as pd
from src.filter_engine.core.predicate import Predicate

class And(Predicate):
    def __init__(self, *predicates: Predicate):
        self.predicates = predicates

    def apply(self, df: pd.DataFrame) -> pd.Series:
        return pd.concat([p.apply(df) for p in self.predicates], axis=1).all(axis=1)