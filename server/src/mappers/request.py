from typing import List
from pydantic import BaseModel
from src.filter_engine.core.filter_interface import PredicateInput

class PageRequest(BaseModel):
    page: int
    page_size: int
    predicates: List[PredicateInput] = []