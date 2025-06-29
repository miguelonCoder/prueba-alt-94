from pydantic import BaseModel
from typing import Union

class PredicateInput(BaseModel):
    field: str
    value: Union[str, int, float, bool]
    type: str