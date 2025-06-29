import pandas as pd
from src.filter_engine.core.predicate import Predicate

class FieldLowerThan(Predicate):
    def __init__(self, field: str, value):
        self.field = field
        self.value = value

    def apply(self, df: pd.DataFrame) -> pd.Series:
        return df[self.field] < self.value