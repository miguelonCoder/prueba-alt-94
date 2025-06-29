import pandas as pd
from src.filter_engine.core.predicate import Predicate

class FieldContains(Predicate):
    def __init__(self, field: str, substring: str):
        self.field = field
        self.substring = substring.lower()

    def apply(self, df: pd.DataFrame) -> pd.Series:
        return df[self.field].astype(str).str.lower().str.contains(self.substring)