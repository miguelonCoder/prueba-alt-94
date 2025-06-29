import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

class Recommender:
    def __init__(self, df=None):
        """
        Inicializa el recomendador con un DataFrame opcional.
        Args:
            df (pd.DataFrame): DataFrame con columnas: id, precio, metros_cuadrados, ambientes, ciudad, tipo.
        """
        if df is not None:
            self.set_data(df)
    
    def set_data(self, df):
        """
        Configura los datos y calcula la matriz de similitud.
        Args:
            df (pd.DataFrame): DataFrame con los datos de inmuebles.
        """
        self.df = df.copy()
        self.df_normalized = self._normalize_dataset(df)
        self.similarity_matrix = self._calculate_similarity_matrix()
    
    @staticmethod
    def _normalize_dataset(df):
        """
        Normaliza los datos numéricos y aplica one-hot encoding a las categóricas.
        Args:
            df (pd.DataFrame): DataFrame de entrada.
        Returns:
            pd.DataFrame: DataFrame normalizado.
        """
        # Normalización de features numéricos
        scaler = MinMaxScaler()
        numeric_features = ['precio', 'metros_cuadrados', 'ambientes']
        df_normalized = df.copy()
        df_normalized[numeric_features] = scaler.fit_transform(df[numeric_features])
        
        # One-Hot Encoding para categóricas con ponderación
        df_normalized = pd.concat([
            df_normalized[numeric_features],
            pd.get_dummies(df['ciudad']) * 2.0,  # Peso 2.0 para ciudad
            pd.get_dummies(df['tipo']) * 1.0    # Peso 1.0 para tipo
        ], axis=1)
        
        return df_normalized
    
    def _calculate_similarity_matrix(self):
        """
        Calcula la matriz de similitud coseno entre todos los inmuebles.
        Returns:
            pd.DataFrame: Matriz de similitud con IDs como índice/columnas.
        """
        sim_matrix = cosine_similarity(self.df_normalized)
        return pd.DataFrame(
            sim_matrix,
            index=self.df['id'],
            columns=self.df['id']
        )
    
    def get_top_similar(self, property_id, n=2):
        """
        Retorna los IDs de los n inmuebles más similares.
        Args:
            property_id (int): ID del inmueble de referencia.
            n (int): Número de recomendaciones a retornar.
        Returns:
            list: Lista de IDs recomendados ordenados por similitud (descendente).
        Raises:
            ValueError: Si el property_id no existe en los datos.
        """
        if property_id not in self.similarity_matrix.index:
            raise ValueError(f"ID {property_id} no encontrado en los datos.")
        
        # Obtener similitudes y ordenar
        similarities = self.similarity_matrix[property_id].sort_values(ascending=False)
        # Excluir el propio ID y tomar los top n
        top_ids = similarities.drop(property_id).head(n).index.tolist()
        
        return top_ids
  