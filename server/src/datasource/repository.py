from typing import List
from src.filter_engine.predicates.or_predicate import Or
from src.filter_engine.predicates.predicate_factory import predicate_factory
from src.filter_engine.core.filter_interface import PredicateInput
from src.datasource.datasource_interface import Datasource

class Repository:
  def __init__(self, source: Datasource):
    self.source = source.get_all_as_df()
    
  def get_all(self):
    return self.source.copy()

  def get_by_id(self, id_column, id_value):
    result = self.source[self.source[id_column] == id_value]
    if not result.empty:
      return result.iloc[0].to_dict()
    return None
  
  def get_properties_by_ids(self, property_ids):
      return self.source[self.source['id'].isin(property_ids)]
    
  def get_filtered(self, predicates: List[PredicateInput]):
    """
    Aplicar una lista de predicados a un DataFrame.
    """
    df = self.source.copy()
    predicates = [predicate_factory(f) for f in predicates]
    composite = Or(*predicates)
    
    mask = composite.apply(df)
    filtered_df = df[mask]
    
    return filtered_df
  
  def get_recommends_by_id():
    pass