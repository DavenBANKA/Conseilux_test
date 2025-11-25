from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Progress
from config import Config
import os

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Create tables
with app.app_context():
    db.create_all()

# ==================== AUTHENTICATION ROUTES ====================

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        phone = data.get('phone')
        
        # Validation
        if not email or not password:
            if request.is_json:
                return jsonify({'success': False, 'message': 'Email and password are required'}), 400
            flash('Email and password are required', 'error')
            return render_template('auth/register.html')
        
        # Check if user exists
        if User.query.filter_by(email=email).first():
            if request.is_json:
                return jsonify({'success': False, 'message': 'Email already registered'}), 400
            flash('Email already registered', 'error')
            return render_template('auth/register.html')
        
        # Create full name
        full_name = f"{first_name} {last_name}".strip()
        if not full_name:
            full_name = email.split('@')[0]  # Fallback to email username
        
        # Create user
        user = User(
            email=email,
            full_name=full_name,
            first_name=first_name,
            last_name=last_name,
            phone=phone
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Log in user
        login_user(user)
        
        if request.is_json:
            return jsonify({'success': True, 'redirect': url_for('dashboard')})
        
        flash('Registration successful!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('auth/register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user, remember=True)
            
            if request.is_json:
                return jsonify({'success': True, 'redirect': url_for('dashboard')})
            
            next_page = request.args.get('next')
            return redirect(next_page or url_for('dashboard'))
        
        if request.is_json:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        flash('Invalid email or password', 'error')
    
    return render_template('auth/login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('home'))


# ==================== DASHBOARD ====================

@app.route('/dashboard')
@login_required
def dashboard():
    """Dashboard - check if user has progress"""
    progress = Progress.query.filter_by(user_id=current_user.id).first()
    
    return render_template('dashboard.html', 
                         user=current_user, 
                         progress=progress)


# ==================== PROGRESS ROUTES ====================

@app.route('/api/save_progress', methods=['POST'])
@login_required
def save_progress():
    """Save user progress"""
    data = request.get_json()
    
    current_section = data.get('current_section')
    current_question = data.get('current_question')
    answers = data.get('answers', {})
    
    # Get or create progress
    progress = Progress.query.filter_by(user_id=current_user.id).first()
    
    if not progress:
        progress = Progress(user_id=current_user.id)
        db.session.add(progress)
    
    # Update progress
    progress.current_section = current_section
    progress.current_question = current_question
    progress.set_answers(answers)
    
    # Mark sections as completed
    if current_section == 'reading' and data.get('reading_completed'):
        progress.reading_completed = True
    if current_section == 'listening' and data.get('listening_completed'):
        progress.listening_completed = True
    if data.get('test_completed'):
        progress.test_completed = True
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Progress saved',
        'progress': {
            'section': progress.current_section,
            'question': progress.current_question
        }
    })


@app.route('/api/load_progress', methods=['GET'])
@login_required
def load_progress():
    """Load user progress"""
    progress = Progress.query.filter_by(user_id=current_user.id).first()
    
    if not progress:
        return jsonify({
            'success': True,
            'has_progress': False
        })
    
    return jsonify({
        'success': True,
        'has_progress': True,
        'progress': {
            'current_section': progress.current_section,
            'current_question': progress.current_question,
            'answers': progress.get_answers(),
            'reading_completed': progress.reading_completed,
            'listening_completed': progress.listening_completed,
            'test_completed': progress.test_completed,
            'updated_at': progress.updated_at.isoformat()
        }
    })


@app.route('/api/reset_progress', methods=['POST'])
@login_required
def reset_progress():
    """Reset user progress"""
    progress = Progress.query.filter_by(user_id=current_user.id).first()
    
    if progress:
        db.session.delete(progress)
        db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Progress reset successfully'
    })


# ==================== TEST ROUTES ====================

@app.route('/test')
@login_required
def test():
    """Reading test"""
    return render_template('test.html')


@app.route('/listening')
@login_required
def listening():
    """Listening test"""
    return render_template('listening.html')


@app.route('/reading-to-listening')
@login_required
def reading_to_listening():
    """Transition page"""
    return render_template('reading_to_listening.html')


@app.route('/resultats')
@login_required
def results():
    """Results page"""
    return render_template('results.html')


# ==================== PUBLIC ROUTES ====================

@app.route('/')
def home():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')


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


@app.route('/certificate')
@login_required
def certificate():
    return render_template('certificate.html')


@app.route('/api/generate_certificate', methods=['POST'])
@login_required
def generate_certificate():
    """Generate personalized PDF certificate"""
    from certificate_generator import generate_user_certificate
    from flask import send_file
    
    data = request.get_json()
    level = data.get('level', 'A1')
    score = data.get('score', 0)
    
    try:
        # Generate certificate with user's full name
        cert_path = generate_user_certificate(
            user_name=current_user.full_name,
            level=level,
            score=score,
            user_id=current_user.id
        )
        
        return jsonify({
            'success': True,
            'message': 'Certificate generated successfully',
            'download_url': f'/download_certificate?path={cert_path}'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error generating certificate: {str(e)}'
        }), 500


@app.route('/download_certificate')
@login_required
def download_certificate():
    """Download generated certificate"""
    from flask import send_file
    import os
    
    cert_path = request.args.get('path')
    
    if not cert_path or not os.path.exists(cert_path):
        return jsonify({'error': 'Certificate not found'}), 404
    
    # Get just the filename for download
    filename = os.path.basename(cert_path)
    
    return send_file(
        cert_path,
        as_attachment=True,
        download_name=f'Conseilux_Certificate_{current_user.full_name.replace(" ", "_")}.pdf',
        mimetype='application/pdf'
    )


@app.route('/images/<path:filename>')
def images(filename: str):
    images_dir = os.path.join(app.root_path, 'images')
    from flask import send_from_directory
    return send_from_directory(images_dir, filename)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
