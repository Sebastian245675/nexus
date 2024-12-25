from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from datasets import Dataset

# Cargar el tokenizador
tokenizer = AutoTokenizer.from_pretrained("distilgpt2")

# Agregar un nuevo token de padding manualmente
tokenizer.add_special_tokens({'pad_token': '[PAD]'})

# Asignar el token de padding
tokenizer.pad_token = '[PAD]'

# Cargar y leer el archivo de texto
ruta_txt = "D:/nexus/datos/La educación.txt"  # Ruta actualizada
with open(ruta_txt, "r", encoding="utf-8") as f:
    texto = f.read().replace("\n", " ")  # Reemplazar saltos de línea por espacios

# Dividir el texto en fragmentos de tamaño máximo permitido
max_len = 1024  # Tamaño máximo de tokens

# Tokenizar el texto con truncamiento y padding para asegurar que todos los fragmentos tengan el mismo tamaño
tokens = tokenizer(texto, truncation=True, padding="max_length", max_length=max_len, return_tensors="pt")["input_ids"][0]

# Crear fragmentos de tamaño max_len si el texto es muy largo (más de 1024 tokens)
fragmentos = [tokens[i:i + max_len] for i in range(0, len(tokens), max_len)]

# Crear un dataset a partir de los fragmentos
dataset = Dataset.from_dict({"input_ids": fragmentos})

# Cargar el modelo base GPT-2
modelo = AutoModelForCausalLM.from_pretrained("distilgpt2")

# Configuración del entrenamiento
argumentos_entrenamiento = TrainingArguments(
    output_dir="modelo_entrenado",  # Carpeta donde se guardará el modelo entrenado
    overwrite_output_dir=True,  # Sobreescribir los archivos existentes
    num_train_epochs=3,  # Número de épocas de entrenamiento
    per_device_train_batch_size=2,  # Tamaño del batch
    save_steps=500,  # Guardar el modelo cada 500 pasos
    save_total_limit=2,  # Guardar solo los últimos 2 modelos
    logging_dir="logs",  # Directorio para logs
)

# Función de entrenamiento personalizada que también pasa las etiquetas (labels)
def custom_data_collator(batch):
    # Tokenizar todos los fragmentos en el batch
    encodings = tokenizer.pad(batch, padding=True, return_tensors="pt")
    input_ids = encodings["input_ids"]
    # Usamos los mismos input_ids como labels
    encodings["labels"] = input_ids.clone()  # Clonar input_ids para labels
    return encodings

# Preparar el entrenador
entrenador = Trainer(
    model=modelo,
    args=argumentos_entrenamiento,
    train_dataset=dataset,
    data_collator=custom_data_collator  # Usar la función personalizada de collator
)

# Entrenamiento del modelo
entrenador.train()

# Guardar el modelo y el tokenizador ajustados
modelo.save_pretrained("modelo_entrenado")
tokenizer.save_pretrained("modelo_entrenado")

# Verificar los archivos guardados
print("Modelo y tokenizador guardados en 'modelo_entrenado'")