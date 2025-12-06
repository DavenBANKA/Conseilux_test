"""
Générateur de certificat premium avec WeasyPrint
Crée des certificats professionnels à partir de templates HTML/CSS
"""

import os
from datetime import datetime
from weasyprint import HTML, CSS
from jinja2 import Environment, FileSystemLoader


class PremiumCertificateGenerator:
    """Génère des certificats PDF premium avec WeasyPrint"""
    
    def __init__(self, template_dir='templates', static_dir='static'):
        self.template_dir = template_dir
        self.static_dir = static_dir
        
        # CEFR Level descriptions
        self.cefr_descriptions = {
            'A1': 'Beginner',
            'A2': 'Elementary',
            'B1': 'Intermediate',
            'B2': 'Upper Intermediate',
            'C1': 'Advanced',
            'C2': 'Proficient'
        }
        
        # Level colors for customization (if needed)
        self.level_colors = {
            'A1': '#558b2f',
            'A2': '#2e7d32',
            'B1': '#00838f',
            'B2': '#1565c0',
            'C1': '#283593',
            'C2': '#6a1b9a'
        }
    
    def get_cefr_level(self, score):
        """
        Détermine le niveau CEFR basé sur le score (sur 116)
        
        Args:
            score (int): Score total du test (0-116)
            
        Returns:
            str: Niveau CEFR (A1, A2, B1, B2, C1, C2)
        """
        if score >= 101:
            return 'C2'
        elif score >= 81:
            return 'C1'
        elif score >= 61:
            return 'B2'
        elif score >= 41:
            return 'B1'
        elif score >= 21:
            return 'A2'
        else:
            return 'A1'
    
    def generate_certificate_id(self, user_id, level):
        """
        Génère un ID unique pour le certificat
        
        Args:
            user_id: ID de l'utilisateur
            level: Niveau CEFR
            
        Returns:
            str: ID du certificat
        """
        timestamp = datetime.now().strftime('%Y%m%d')
        random_part = abs(hash(f"{user_id}{timestamp}{level}")) % 10000
        return f"CX-{timestamp}-{random_part:04d}-{level}"
    
    def format_date(self, date_obj=None):
        """
        Formate la date pour l'affichage
        
        Args:
            date_obj: Objet datetime (None pour aujourd'hui)
            
        Returns:
            str: Date formatée
        """
        if date_obj is None:
            date_obj = datetime.now()
        return date_obj.strftime("%B %d, %Y")
    
    def generate_certificate(
        self,
        user_name,
        level=None,
        reading_score=0,
        listening_score=0,
        total_score=None,
        user_id=None,
        output_path=None,
        logo_path=None
    ):
        """
        Génère un certificat PDF premium
        
        Args:
            user_name (str): Nom complet de l'utilisateur
            level (str): Niveau CEFR (A1-C2). Si None, calculé à partir du score
            reading_score (int): Score de lecture (0-90)
            listening_score (int): Score d'écoute (0-26)
            total_score (int): Score total (0-116). Si None, calculé
            user_id: ID de l'utilisateur pour l'ID du certificat
            output_path (str): Chemin de sortie du PDF. Si None, généré automatiquement
            logo_path (str): Chemin vers le logo. Si None, chemin par défaut
            
        Returns:
            str: Chemin vers le fichier PDF généré
        """
        # Calculer le score total si non fourni
        if total_score is None:
            total_score = reading_score + listening_score
        
        # Déterminer le niveau CEFR si non fourni
        if level is None:
            level = self.get_cefr_level(total_score)
        
        # Obtenir la description du niveau
        level_description = self.cefr_descriptions.get(level, '')
        
        # Générer l'ID du certificat
        certificate_id = self.generate_certificate_id(user_id or 0, level)
        
        # Chemin du logo
        if logo_path is None:
            logo_path = os.path.join('images', 'logo conseilux english.png')
            if not os.path.exists(logo_path):
                logo_path = ''  # Pas de logo si introuvable
        
        # Convertir le chemin relatif en chemin absolu pour WeasyPrint
        if logo_path and not os.path.isabs(logo_path):
            logo_abs_path = os.path.abspath(logo_path)
            if os.path.exists(logo_abs_path):
                logo_path = logo_abs_path
        
        # Générer le chemin de sortie si non fourni
        if output_path is None:
            cert_dir = os.path.join('static', 'certificates')
            os.makedirs(cert_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            safe_name = "".join(c for c in user_name if c.isalnum() or c in (' ', '-', '_')).strip()
            safe_name = safe_name.replace(' ', '_')
            filename = f"certificate_premium_{safe_name}_{timestamp}.pdf"
            output_path = os.path.join(cert_dir, filename)
        
        # Créer le répertoire de sortie si nécessaire
        output_dir = os.path.dirname(output_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        
        # Préparer le contexte pour le template
        context = {
            'user_name': user_name,
            'level': level,
            'level_description': level_description,
            'reading_score': reading_score,
            'listening_score': listening_score,
            'total_score': total_score,
            'issue_date': self.format_date(),
            'certificate_id': certificate_id,
            'logo_path': logo_path if logo_path else ''
        }
        
        # Charger le template Jinja2
        env = Environment(loader=FileSystemLoader(self.template_dir))
        template = env.get_template('certificate_premium.html')
        
        # Rendre le template avec le contexte
        html_content = template.render(**context)
        
        # Chemins absolus pour les ressources
        base_url = os.path.abspath('.')
        
        # Générer le PDF avec WeasyPrint
        try:
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
        except Exception as e:
            # En cas d'erreur avec les chemins absolus, essayer avec chemin relatif
            print(f"Warning: Error with absolute paths, trying relative: {e}")
            HTML(string=html_content).write_pdf(output_path)
        
        return output_path


def generate_premium_certificate(
    user_name,
    level=None,
    reading_score=0,
    listening_score=0,
    total_score=None,
    user_id=None,
    output_dir=None
):
    """
    Fonction helper pour générer un certificat premium
    
    Args:
        user_name (str): Nom complet de l'utilisateur
        level (str): Niveau CEFR (optionnel)
        reading_score (int): Score de lecture (0-90)
        listening_score (int): Score d'écoute (0-26)
        total_score (int): Score total (0-116, optionnel)
        user_id: ID de l'utilisateur
        output_dir (str): Répertoire de sortie (optionnel)
        
    Returns:
        str: Chemin vers le certificat PDF généré
    """
    generator = PremiumCertificateGenerator()
    
    # Déterminer le chemin de sortie
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        safe_name = "".join(c for c in user_name if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_name = safe_name.replace(' ', '_')
        filename = f"certificate_premium_{safe_name}_{timestamp}.pdf"
        output_path = os.path.join(output_dir, filename)
    else:
        output_path = None
    
    return generator.generate_certificate(
        user_name=user_name,
        level=level,
        reading_score=reading_score,
        listening_score=listening_score,
        total_score=total_score,
        user_id=user_id,
        output_path=output_path
    )


# Exemple d'utilisation
if __name__ == '__main__':
    # Test de génération
    test_cert = generate_premium_certificate(
        user_name='John Doe',
        reading_score=75,
        listening_score=20,
        user_id=1
    )
    print(f"Certificat généré: {test_cert}")
