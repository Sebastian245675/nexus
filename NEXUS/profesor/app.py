from flask import Flask, render_template, request, jsonify
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)

# Ruta del modelo preentrenado
modelo_path = r"D:\nexus\modelo_entrenado"
model = AutoModelForCausalLM.from_pretrained(modelo_path)
tokenizer = AutoTokenizer.from_pretrained(modelo_path)

@app.route('/')
def index():
    return render_template("ctivid.html")

@app.route('/generate', methods=['POST'])
def generate_response():
    try:
        data = request.get_json()
        question = data.get('question')

        if not question:
            return jsonify({"error": "La pregunta está vacía"}), 400

        # Generar la respuesta
        input_ids = tokenizer.encode(question, return_tensors='pt')
        output = model.generate(input_ids, max_length=100, num_return_sequences=1)
        answer = tokenizer.decode(output[0], skip_special_tokens=True)

        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "_main_":
    app.run(debug=True)