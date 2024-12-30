from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Cargar el modelo y el tokenizador
model = GPT2LMHeadModel.from_pretrained("gpt2")
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

# Función para generar preguntas
def generar_preguntas(tema):
    prompt = f"Genera preguntas sobre el tema: {tema}"
    inputs = tokenizer.encode(prompt, return_tensors="pt")

    # Generar texto con el modelo
    outputs = model.generate(inputs, max_length=100, num_return_sequences=5, no_repeat_ngram_size=2)
    
    preguntas = []
    for output in outputs:
        pregunta = tokenizer.decode(output, skip_special_tokens=True)
        preguntas.append(pregunta)
    
    return preguntas

# Ejemplo de uso
tema = "Evolución de la informática"
preguntas = generar_preguntas(tema)
for pregunta in preguntas:
    print(pregunta)