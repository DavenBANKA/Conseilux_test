"""
Application Flask complète avec système d'authentification et génération de certificats PDF
"""
from flask import Flask, render_template, request, redirect, url_for, flash, send_file, abort
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Progress
from config import Config
from pdf_certificate_generator import create_user_certificate
import os
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

# Initialiser la base de données
db.init_app(app)

# Initialiser Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Veuillez vous connecter pour accéder à cette page.'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# ============================================================================
# ROUTES D'AUTHENTIFICATION
# ============================================================================

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Page d'inscription"""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        full_name = request.form.get('full_name')
        
        # Validation
        if not email or not password or not full_name:
            flash('Tous les champs sont requis.', 'error')
            return render_template('auth/register.html')
        
        # Vérifier si l'email existe déjà
        if User.query.filter_by(email=email).first():
            flash('Cet email est déjà utilisé.', 'error')
            return render_template('auth/register.html')
        
        # Créer le nouvel utilisateur
        user = User(email=email, full_name=full_name)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Créer le profil de progression
        progress = Progress(user_id=user.id)
        db.session.add(progress)
        db.session.commit()
        
        flash('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success')
        return redirect(url_for('login'))
    
    return render_template('auth/register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Page de connexion"""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash('Email ou mot de passe incorrect.', 'error')
    
    return render_template('auth/login.html')


@app.route('/logout')
@login_required
def logout():
    """Déconnexion"""
    logout_user()
    flash('Vous avez été déconnecté.', 'info')
    return redirect(url_for('home'))


# ============================================================================
# ROUTES PRINCIPALES
# ============================================================================

@app.route('/')
def home():
    """Page d'accueil"""
    return render_template('index.html')


@app.route('/dashboard')
@login_required
def dashboard():
    """Tableau de bord utilisateur"""
    progress = Progress.query.filter_by(user_id=current_user.id).first()
    return render_template('dashboard.html', progress=progress)


@app.route('/test')
@login_required
def test():
    """Page du test"""
    return render_template('test.html')


@app.route('/results')
@login_required
def results():
    """Page des résultats"""
    progress = Progress.query.filter_by(user_id=current_user.id).first()
    
    if not progress or not progress.test_completed:
        flash('Vous devez d\'abord terminer le test.', 'warning')
        return redirect(url_for('test'))
    
    return render_template('results.html', progress=progress)


# ============================================================================
# GÉNÉRATION DE CERTIFICAT PDF
# ============================================================================

@app.route('/generate_certificate')
@login_required
def generate_certificate():
    """
    Génère et télécharge un certificat PDF pour l'utilisateur connecté
    """
    # Vérifier que l'utilisateur a terminé le test
    progress = Progress.query.filter_by(user_id=current_user.id).first()
    
    if not progress or not progress.test_completed:
        flash('Vous devez d\'abord terminer le test pour obtenir votre certificat.', 'warning')
        return redirect(url_for('test'))
    
    # Déterminer le niveau CEFR (vous devrez adapter selon votre logique)
    # Exemple : récupérer depuis les résultats stockés
    answers = progress.get_answers()
    level = calculate_cefr_level(answers)  # Fonction à implémenter selon votre logique
    
    try:
        # Générer le certificat PDF
        pdf_path = create_user_certificate(
            full_name=current_user.full_name,
            level=level,
            output_dir='certificates'
        )
        
        # Envoyer le fichier PDF au navigateur
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'certificate_{current_user.full_name.replace(" ", "_")}.pdf'
        )
        
    except Exception as e:
        app.logger.error(f"Erreur lors de la génération du certificat: {str(e)}")
        flash('Une erreur est survenue lors de la génération du certificat.', 'error')
        return redirect(url_for('results'))


def calculate_cefr_level(answers):
    """
    Calcule le niveau CEFR basé sur les réponses
    À adapter selon votre logique de scoring
    """
    # Exemple simple - à remplacer par votre vraie logique
    if not answers:
        return "A1"
    
    # Compter les bonnes réponses (exemple)
    correct_count = sum(1 for answer in answers.values() if answer.get('correct', False))
    total = len(answers)
    
    if total == 0:
        return "A1"
    
    score_percentage = (correct_count / total) * 100
    
    # Déterminer le niveau selon le score
    if score_percentage >= 90:
        return "C2"
    elif score_percentage >= 80:
        return "C1"
    elif score_percentage >= 70:
        return "B2"
    elif score_percentage >= 60:
        return "B1"
    elif score_percentage >= 50:
        return "A2"
    else:
        return "A1"


# ============================================================================
# ROUTES STATIQUES
# ============================================================================

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
def images(filename):
    """Servir les images"""
    images_dir = os.path.join(app.root_path, 'images')
    return send_file(os.path.join(images_dir, filename))


# ============================================================================
# INITIALISATION DE LA BASE DE DONNÉES
# ============================================================================

@app.cli.command()
def init_db():
    """Initialise la base de données"""
    db.create_all()
    print("Base de données initialisée !")


@app.cli.command()
def create_test_user():
    """Crée un utilisateur de test"""
    user = User(
        email='test@example.com',
        full_name='Jean Dupont'
    )
    user.set_password('password123')
    
    db.session.add(user)
    db.session.commit()
    
    progress = Progress(user_id=user.id, test_completed=True)
    db.session.add(progress)
    db.session.commit()
    
    print("Utilisateur de test créé : test@example.com / password123")


# ============================================================================
# LANCEMENT DE L'APPLICATION
# ============================================================================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
