from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List
import pandas as pd

class Datasource(ABC):
    @abstractmethod
    def get_all_as_df(self) -> pd.DataFrame:
        pass