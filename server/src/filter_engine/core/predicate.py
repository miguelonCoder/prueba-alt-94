from abc import ABC, abstractmethod
import pandas as pd

class Predicate(ABC):
    @abstractmethod
    def apply(self, df: pd.DataFrame) -> pd.Series:
        """Devuelve una Series booleana indicando las filas que cumplen la condición"""
        pass


