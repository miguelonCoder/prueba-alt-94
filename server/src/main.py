import os
from typing import Optional
from fastapi import FastAPI, Body
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from src.mappers.request import PageRequest
from src.filter_engine.core.filter_interface import PredicateInput
from src.datasource.recommender import Recommender
from src.datasource.repository import Repository
from src.datasource.json_datasource import JsonDatasource
app = FastAPI()


@asynccontextmanager
async def lifespan(app: FastAPI):
  '''
  Aqui se inicializa la fuente de los datos y se configura el sistema de recomendación.
  Esto evita que por cada petición se vuelva a calcular la matriz de similitud (Nearest Neighbors).
  
  En un ambiente de producción, se considera mover esta logica a un servicio separado 
  y manejar la matriz de pesos en Redis, actualizandose solo si se añaden nuevas propiedades.
  '''
  path_data = os.path.join('static', 'properties.json')
  datasource = JsonDatasource(path_data)
  app.state.repository = Repository(datasource)
  
  recommender = Recommender(datasource.get_all_as_df())
  app.state.recommender = recommender
  yield
  

app = FastAPI(lifespan=lifespan)

#TODO: Con mayor tiempo se puede trasladar la lógica de cada petición a casos de uso separados

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite cualquier origen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/") 
def home():
    return RedirectResponse(url="/docs")
  
@app.get("/properties")
def get_properties():
  df = app.state.repository.get_all()
  return df.to_dict(orient="records")

@app.get("/properties/{property_id}")
def get_property_by_id(property_id: int):
  # Primero obtenemos los datos de la propiedad objetivo
    result = app.state.repository.get_by_id("id", property_id)
    
    # Ahora obtenemos las recomendaciones para esa propiedad
    if result:
        recommendation = app.state.recommender.get_top_similar(property_id)
        recomendation = [ 
          app.state.repository.get_by_id("id", id)
          for id in recommendation
        ]
        return {
          "profile": result,
          "recommendation": recomendation
        }
    else:
        return {"error": "Property not found"}, 404
      
@app.get("/recommendation/{property_id}")
def get_recommendation(property_id: int):
  recommendation = app.state.recommender.get_top_similar(property_id)
  if recommendation is not None:
    return recommendation
  else:
    return {"error": "Recommendation not found"}, 404
  
@app.post("/properties/page")
def get_properties_paginated(request_data: PageRequest):
  page = request_data.page
  page_size = request_data.page_size
  predicates = request_data.predicates

  df = None
  if not predicates:
    # Si no hay predicados, paginamos sobre todos los datos
    df = app.state.repository.get_all()
  else:
    df = app.state.repository.get_filtered(predicates)
    
  start = (page - 1) * page_size
  end = start + page_size
  paginated = df.iloc[start:end]
  return {
    "page": page,
    "page_size": page_size,
    "total": len(df),
    "properties": paginated.to_dict(orient="records")
  }