#PRUEBA TÉCNICA ALT94

- **Documentacion servidor:** http://18.116.147.172:8000
- **Aplicación web:** http://18.116.147.172:8080/

## RESUMEN

Este repositorio contiene el código fuente de un sistema de visualización y recomendación de bienes inmuebles. Las funcionalidades son las siguientes:

1. Visualización del listado de propiedades.
2. Paginación del listado de propiedades.
3. Filtro por coincidencia parcial para el título y la ciudad de la publicación.
4. Visualización del perfil de la propiedad.
5. Recomendación de las dos propiedades más parecidas a la propiedad del perfil.

## DISEÑO DEL SISTEMA

De manera general la aplicación se encuentra diseñada en una arquitectura de cliente - servidor. Tanto el cliente como el servidor se han empaquetado en contenedores de Docker y se ha realizado un archivo de docker compose para levantar facilmente los servicios, el cual se encuentra dentro del repositorio.

A continuación se presentan las características de ambos servicios:

### Servidor

***Lenguaje***
Se seleccionó Python como lenguaje para el backend. Esta decisión esta fundamentada en su extenso ecosistema para el desarrollo de productos con funciones de machine learning, lo que ofreció grandes ventajas para el sitema de recomendación.

***Framework***
Se seleccionó FastAPI como framework sobre Python, ya que permite el desarrollo rápido de servicios REST.

***Fuente de datos***
Se mantuvo como fuente de datos el archivo json con la lista de propiedades previamente dispuesta, sin embargo, se desarrolló la lógica de fuente de datos mediante los patrones de diseño Repository y Adapter, que en conjunto permiten intercambiar las fuentes de datos facilmente mediante la substitución de implementaciones e inyección de dependencias.

***Sistema de recomendación***
Se diseñó un sistema de recomendación basado en el algorítmo **nearest neighbors** mediante la biblioteca Sckit Learn con las siguientes caracteristicas:

1. Se tomaron las propiedades de ciudad, precio, metros cuadrados y numero de ambientes como base de comparación.
   
2. Se realizó una priorización inicial de la propiedad ciudad sobre las demas propiedades, de esta manera, el sistema recomendará las propiedades más cercanas sobre las propiedades con el resto de caracteristicas similares.
   
3. El sistema recomienda inicialmente las dos propiedades mas parecidas, pero este es un valor parametrizable en el servidor, asi que puede ajustarse para que presente un conjunto de tamaño determinado.
   
4. El sistema siempre mostrará propiedades recomendadas, pues el algoritmo se basa en la similitud de los vectores de caracteristicas, asi que si hay al menos dos propiedades en la fuente de datos, una de ellas será la recomendación de la otra en el caso más extremo.
   
***Filtrado***
Se diseñó un sistema de filtrado totalmente escalable mediante la abstracción de operadores lógicos, usando los patrones de diseño Criteria y Factory. 

El patrón Criteria fue usado para definir la familia de operadores de comparación 'greater_than', 'lower_than' y 'contains', así como los operadores de contatenación 'and' y 'or'. Entonces, para definir multiples filtros aplicados al tiempo, estos se envían en una lista del tipo:

'''
Predicate:
  field: El campo a filtrar,
  type: El operador de comparación ('greater_than', 'lower_than', 'contains')
  value: El valor de comparación
'''

La lista de filtros es procesada para crear cada predicado mediante el patrón Factory, y por último se componen mediante los operadores 'or' o 'and'.

Con este diseño los filtros pueden crecer indeterminadamente sin realizar ninguna modificacioen a la lógica de su aplicación, incluso se puede reutilizar sobre diferentes entidades distintas a 'Property'.

***Paginación***
El servidor envía los resultados del filtrado de los datos mediante paginación, la cual se puede controlar mediante la aplicación del cliente.

***Documentación***
La documentación de la API se puede encontrar en la ruta '/docs' del servidor, la cual se crea automaticamente  con OpenAPI y Swagger.

### Cliente

***Framework***
Se seleccionó el framework de Angular. La decisión de su uso se basa en la experiencia de desarrollo sobre este, además de contar con un sistema muy robusto para el manejo de flujos de datos mediante Rxjs y Signals, que permitieron crear claramente la logica de filtrado reactivo de los datos.

***Rutas***
La aplicación cuenta con dos rutas:

- main: Muestra la lista de las propiedades.
- property: Muestra el detalle de una propiedad junto con las recomendadas.
  
***Testing***
Debido al tiempo de desarrollo limitado, se crearon los tests de las partes con mayor dinamismo en la aplicación: el sistema de paginación y la lógica de representación de los estados de 'loading', 'success', 'no_data' y 'error' en la lista de las propiedades. Los demas componentes conllevan al manejo de las funciones anteriormente testeadas, así que no se tuvieron en cuenta, sin embargo con mayor tiempo esto sería una tarea indispensable.

## DESPLIEGUE

Para poner en marcha la aplicación, realice los siguientes pasos:
1.
Clone el repositorio:
   
   '''
   git clone git@github.com:miguelonCoder/prueba-alt-94.git
   '''
o con http:

   '''
   git clone https://github.com/miguelonCoder/prueba-alt-94.git
   '''
2.
Copie los datos de propiedades en el servidor dentro de la carpeta static:

'''
cd prueba-alt-94
mkdir server/static
cp properties_mock_100_clean.json server/static/properties.json
'''

3.
levante los servicios con Docker Compose:

'''
docker compose up -d
'''

4.
Acceda a las rutas:

- **Documentacion servidor:** http://localhost:8000
- **Aplicación web:** http://localhost:8080
  
> **Nota:** Si encuentra dificultades en el despliegue de la aplicación, recuerde que podrá encontrarlas desplegadas en las rutas:
- **Documentacion servidor:** http://18.116.147.172:8000
- **Aplicación web:** http://18.116.147.172:8080/