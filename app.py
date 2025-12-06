from ast import Return
from flask import Flask, render_template, request, jsonify, url_for
from datetime import datetime
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

@app.route('/certificate')
def certificate():
    """Afficher le nouveau certificat (version premium)"""
    return render_template(
        'certificate_premium.html',
        user_name='Student Name',
        level='B2',
        level_description='Upper Intermediate',
        reading_score=0,
        listening_score=0,
        total_score=0,
        issue_date=datetime.now().strftime("%B %d, %Y"),
        certificate_id='CX-PREVIEW-0001'
    )


@app.route('/public_certificate')
def public_certificate():
    """Public shareable certificate page (for LinkedIn, etc.)."""
    user_name = request.args.get('user_name', 'Student Name')
    level = request.args.get('level', 'A1')
    total_score_raw = request.args.get('total_score', '0')
    try:
        total_score = int(total_score_raw)
    except ValueError:
        total_score = 0

    certificate_id = request.args.get('certificate_id', 'CX-PUBLIC-0001')
    issue_date = request.args.get('issue_date') or datetime.now().strftime("%B %d, %Y")

    og_url = request.url
    og_image_url = url_for('images', filename='logo conseilux english.png', _external=True)

    return render_template(
        'public_certificate.html',
        user_name=user_name,
        level=level,
        total_score=total_score,
        certificate_id=certificate_id,
        issue_date=issue_date,
        og_url=og_url,
        og_image_url=og_image_url
    )

@app.route('/reading-to-listening')
def reading_to_listening():
    return render_template('reading_to_listening.html')

@app.route('/listening')
def listening():
    return render_template('listening.html')

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

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/images/<path:filename>')
def images(filename: str):
    images_dir = os.path.join(app.root_path, 'images')
    return send_from_directory(images_dir, filename)


@app.route('/download_certificate', methods=['GET', 'POST'])
def download_certificate():
    """Génère et télécharge directement le certificat PDF premium"""
    from weasyprint import HTML, CSS
    from datetime import datetime
    from jinja2 import Environment, FileSystemLoader
    import json
    
    try:
        # Récupérer les données depuis la requête
        if request.method == 'POST':
            data = request.get_json() if request.is_json else request.form.to_dict()
        else:
            # GET request - récupérer depuis les paramètres
            data = request.args.to_dict()
        
        # Extraire les données nécessaires
        user_name = data.get('user_name', data.get('name', 'Student'))
        level = data.get('level', 'A1')
        reading_score = int(data.get('reading_score', data.get('reading', 0)))
        listening_score = int(data.get('listening_score', data.get('listening', 0)))
        total_score = int(data.get('total_score', data.get('total', reading_score + listening_score)))
        
        # Descriptions CEFR
        cefr_descriptions = {
            'A1': 'Beginner',
            'A2': 'Elementary',
            'B1': 'Intermediate',
            'B2': 'Upper Intermediate',
            'C1': 'Advanced',
            'C2': 'Proficient'
        }
        
        # Générer l'ID du certificat
        timestamp = datetime.now().strftime('%Y%m%d')
        random_part = abs(hash(f"{user_name}{timestamp}{level}")) % 10000
        certificate_id = f"CX-{timestamp}-{random_part:04d}-{level}"
        
        # Logo path
        logo_path = os.path.join(app.root_path, 'images', 'logo conseilux english.png')
        if os.path.exists(logo_path):
            if os.name == 'nt':  # Windows
                logo_path = 'file:///' + logo_path.replace('\\', '/')
            else:  # Unix/Mac
                logo_path = 'file://' + logo_path
        else:
            logo_path = ''
        
        # Préparer le contexte
        context = {
            'user_name': user_name,
            'level': level,
            'level_description': cefr_descriptions.get(level, ''),
            'reading_score': reading_score,
            'listening_score': listening_score,
            'total_score': total_score,
            'issue_date': datetime.now().strftime("%B %d, %Y"),
            'certificate_id': certificate_id,
            'logo_path': logo_path if logo_path else ''
        }
        
        # Charger le template
        template_dir = os.path.join(app.root_path, 'templates')
        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template('certificate_premium.html')
        html_content = template.render(**context)
        
        # Générer le PDF
        from weasyprint import HTML, CSS
        base_url = app.root_path
        
        # Créer le répertoire de certificats si nécessaire
        cert_dir = os.path.join('static', 'certificates')
        os.makedirs(cert_dir, exist_ok=True)
        
        # Nom du fichier
        timestamp_file = datetime.now().strftime('%Y%m%d_%H%M%S')
        safe_name = "".join(c for c in user_name if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_name = safe_name.replace(' ', '_')
        filename = f"certificate_premium_{safe_name}_{timestamp_file}.pdf"
        output_path = os.path.join(cert_dir, filename)
        
        # Générer le PDF
        HTML(
            string=html_content,
            base_url=base_url
        ).write_pdf(
            output_path,
            stylesheets=[
                CSS(string='''
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                ''')
            ]
        )
        
        # Envoyer le fichier
        from flask import send_file
        return send_file(
            output_path,
            as_attachment=True,
            download_name=f'Conseilux_Certificate_{safe_name}.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        app.logger.error(f"Certificate generation error: {error_details}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
