"""
Générateur de certificats PDF professionnel avec ReportLab
"""
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.units import cm, inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import os


class CertificateGenerator:
    """Génère des certificats PDF professionnels"""
    
    def __init__(self, page_size=A4):
        self.page_size = page_size
        self.width, self.height = page_size
        
    def generate_certificate(self, output_path, full_name, level, completion_date=None):
        """
        Génère un certificat PDF professionnel
        
        Args:
            output_path: Chemin du fichier PDF à créer
            full_name: Nom complet de l'utilisateur
            level: Niveau CEFR obtenu (ex: "B2")
            completion_date: Date d'obtention (datetime ou None pour aujourd'hui)
        """
        if completion_date is None:
            completion_date = datetime.now()
        
        # Créer le canvas PDF
        c = canvas.Canvas(output_path, pagesize=self.page_size)
        
        # Dessiner le certificat
        self._draw_border(c)
        self._draw_header(c)
        self._draw_title(c)
        self._draw_recipient(c, full_name)
        self._draw_achievement(c, level)
        self._draw_date(c, completion_date)
        self._draw_footer(c)
        
        # Sauvegarder le PDF
        c.save()
        
        return output_path
    
    def _draw_border(self, c):
        """Dessine un cadre élégant autour du certificat"""
        margin = 1.5 * cm
        
        # Cadre extérieur (bleu foncé)
        c.setStrokeColor(colors.HexColor('#1e3a8a'))
        c.setLineWidth(3)
        c.rect(margin, margin, self.width - 2*margin, self.height - 2*margin)
        
        # Cadre intérieur (doré)
        inner_margin = margin + 0.3 * cm
        c.setStrokeColor(colors.HexColor('#d4af37'))
        c.setLineWidth(1)
        c.rect(inner_margin, inner_margin, 
               self.width - 2*inner_margin, self.height - 2*inner_margin)
    
    def _draw_header(self, c):
        """Dessine l'en-tête avec logo optionnel"""
        # Logo (si disponible)
        logo_path = os.path.join('images', 'logo conseilux english.png')
        if os.path.exists(logo_path):
            try:
                c.drawImage(logo_path, self.width/2 - 2*cm, self.height - 5*cm, 
                           width=4*cm, height=2*cm, preserveAspectRatio=True, mask='auto')
            except:
                pass  # Si le logo ne peut pas être chargé, on continue sans
    
    def _draw_title(self, c):
        """Dessine le titre principal du certificat"""
        y_position = self.height - 7 * cm
        
        # Titre principal
        c.setFont("Helvetica-Bold", 32)
        c.setFillColor(colors.HexColor('#1e3a8a'))
        title = "CERTIFICATE"
        c.drawCentredString(self.width / 2, y_position, title)
        
        # Sous-titre
        c.setFont("Helvetica", 18)
        c.setFillColor(colors.HexColor('#4b5563'))
        subtitle = "of English Level Achievement"
        c.drawCentredString(self.width / 2, y_position - 0.8*cm, subtitle)
        
        # Ligne décorative
        line_y = y_position - 1.5*cm
        c.setStrokeColor(colors.HexColor('#d4af37'))
        c.setLineWidth(2)
        c.line(self.width/2 - 5*cm, line_y, self.width/2 + 5*cm, line_y)
    
    def _draw_recipient(self, c, full_name):
        """Dessine la section 'This certifies that'"""
        y_position = self.height / 2 + 2*cm
        
        # Texte d'introduction
        c.setFont("Helvetica", 14)
        c.setFillColor(colors.black)
        c.drawCentredString(self.width / 2, y_position, "This certifies that")
        
        # Nom de l'utilisateur (en grand et élégant)
        c.setFont("Helvetica-Bold", 28)
        c.setFillColor(colors.HexColor('#1e3a8a'))
        c.drawCentredString(self.width / 2, y_position - 1.2*cm, full_name)
        
        # Ligne sous le nom
        name_y = y_position - 1.8*cm
        c.setStrokeColor(colors.HexColor('#d4af37'))
        c.setLineWidth(1)
        c.line(self.width/2 - 6*cm, name_y, self.width/2 + 6*cm, name_y)
    
    def _draw_achievement(self, c, level):
        """Dessine la section de réussite avec le niveau"""
        y_position = self.height / 2 - 1*cm
        
        # Texte de réussite
        c.setFont("Helvetica", 14)
        c.setFillColor(colors.black)
        c.drawCentredString(self.width / 2, y_position, 
                           "has successfully completed the English proficiency test")
        
        c.drawCentredString(self.width / 2, y_position - 0.7*cm, 
                           "and demonstrated competency at")
        
        # Niveau CEFR (mis en évidence)
        c.setFont("Helvetica-Bold", 24)
        c.setFillColor(colors.HexColor('#059669'))
        c.drawCentredString(self.width / 2, y_position - 1.8*cm, 
                           f"CEFR Level {level}")
    
    def _draw_date(self, c, completion_date):
        """Dessine la date d'obtention"""
        y_position = self.height / 2 - 4.5*cm
        
        c.setFont("Helvetica", 12)
        c.setFillColor(colors.HexColor('#4b5563'))
        date_str = completion_date.strftime("%B %d, %Y")
        c.drawCentredString(self.width / 2, y_position, f"Date of Achievement: {date_str}")
    
    def _draw_footer(self, c):
        """Dessine le pied de page avec signature"""
        y_position = 4 * cm
        
        # Ligne de signature
        sig_y = y_position + 1*cm
        c.setStrokeColor(colors.black)
        c.setLineWidth(1)
        c.line(self.width/2 - 4*cm, sig_y, self.width/2 + 4*cm, sig_y)
        
        # Texte sous la signature
        c.setFont("Helvetica", 11)
        c.setFillColor(colors.black)
        c.drawCentredString(self.width / 2, y_position + 0.3*cm, "Authorized Signature")
        
        # Informations supplémentaires
        c.setFont("Helvetica", 9)
        c.setFillColor(colors.HexColor('#6b7280'))
        c.drawCentredString(self.width / 2, y_position - 0.5*cm, 
                           "This certificate verifies the completion of an English language assessment")
        c.drawCentredString(self.width / 2, y_position - 0.9*cm, 
                           "based on the Common European Framework of Reference for Languages (CEFR)")


def create_user_certificate(full_name, level, output_dir='certificates'):
    """
    Fonction helper pour créer un certificat utilisateur
    
    Args:
        full_name: Nom complet de l'utilisateur
        level: Niveau CEFR (ex: "B2")
        output_dir: Dossier de sortie pour les certificats
    
    Returns:
        Chemin du fichier PDF créé
    """
    # Créer le dossier si nécessaire
    os.makedirs(output_dir, exist_ok=True)
    
    # Nom de fichier sécurisé
    safe_name = "".join(c for c in full_name if c.isalnum() or c in (' ', '-', '_')).strip()
    safe_name = safe_name.replace(' ', '_')
    filename = f"certificate_{safe_name}_{level}.pdf"
    output_path = os.path.join(output_dir, filename)
    
    # Générer le certificat
    generator = CertificateGenerator(page_size=A4)
    generator.generate_certificate(output_path, full_name, level)
    
    return output_path
