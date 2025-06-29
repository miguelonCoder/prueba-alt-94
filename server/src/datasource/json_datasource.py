from src.datasource.datasource_interface import Datasource
import pandas as pd

class JsonDatasource(Datasource):
  def __init__(self, file_path: str):
    super().__init__()
    try:
      self.data = pd.read_json(file_path)
    except ValueError as e:
      raise ValueError(f"Error loading JSON data: {e}")
    
  def get_all_as_df(self) -> pd.DataFrame:
    """
    Returns the entire dataset as a DataFrame.
    """
    if not self.data.empty:
      return self.data
    else:
      raise ValueError("The dataset is empty.")