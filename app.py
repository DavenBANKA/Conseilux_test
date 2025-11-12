from flask import Flask, render_template
import os
from flask import send_from_directory

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/resultats')
def results():
    return render_template('results.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/method')
def method():
    return render_template('method.html')

@app.route('/cefr-levels')
def cefr_levels():
    return render_template('cefr_levels.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/images/<path:filename>')
def images(filename: str):
    images_dir = os.path.join(app.root_path, 'images')
    return send_from_directory(images_dir, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
