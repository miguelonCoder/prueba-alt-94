from src.datasource.datasource_interface import Datasource
import pandas as pd

class JsonDatasource(Datasource):
  """
  Es una implementación del adaptador de datos que usa como fuente de datos un archivo JSON.
  En caso de implementar una base de datos, se puede trasladar esta logica a una clase que implemente Datasource y se inyecta en lugar de esta clase.
  """
  def __init__(self, file_path: str):
    super().__init__()
    try:
      self.data = pd.read_json(file_path)
    except ValueError as e:
      raise ValueError(f"Error loading JSON data: {e}")
    
  def get_all_as_df(self) -> pd.DataFrame:
    if not self.data.empty:
      return self.data
    else:
      raise ValueError("The dataset is empty.")