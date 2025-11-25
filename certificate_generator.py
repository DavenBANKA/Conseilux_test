"""
Certificate Generator - Generate personalized PDF certificates
Uses ReportLab to create professional certificates with user's name
"""

from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from datetime import datetime
import os

class CertificateGenerator:
    def __init__(self):
        self.page_width, self.page_height = landscape(A4)
        
        # Colors
        self.color_primary = HexColor('#0b2545')  # Blue
        self.color_accent = HexColor('#f1c40f')   # Gold
        self.color_text = HexColor('#333333')
        
    def generate_certificate(self, user_name, level, score, output_path):
        """
        Generate a personalized certificate PDF
        
        Args:
            user_name (str): Full name of the user
            level (str): CEFR level (A1, A2, B1, B2, C1, C2)
            score (int): Test score
            output_path (str): Path to save the PDF
        
        Returns:
            str: Path to the generated PDF
        """
        c = canvas.Canvas(output_path, pagesize=landscape(A4))
        
        # Draw border
        self._draw_border(c)
        
        # Draw header
        self._draw_header(c)
        
        # Draw certificate title
        self._draw_title(c)
        
        # Draw user name (main focus)
        self._draw_user_name(c, user_name)
        
        # Draw achievement text
        self._draw_achievement_text(c, level, score)
        
        # Draw footer with date and signature
        self._draw_footer(c)
        
        # Save PDF
        c.save()
        
        return output_path
    
    def _draw_border(self, c):
        """Draw decorative border"""
        # Outer border
        c.setStrokeColor(self.color_primary)
        c.setLineWidth(3)
        c.rect(1*cm, 1*cm, self.page_width - 2*cm, self.page_height - 2*cm)
        
        # Inner border
        c.setStrokeColor(self.color_accent)
        c.setLineWidth(1)
        c.rect(1.3*cm, 1.3*cm, self.page_width - 2.6*cm, self.page_height - 2.6*cm)
    
    def _draw_header(self, c):
        """Draw header with logo and title"""
        # Company name
        c.setFont("Helvetica-Bold", 24)
        c.setFillColor(self.color_primary)
        c.drawCentredString(self.page_width / 2, self.page_height - 3*cm, "CONSEILUX")
        
        # Subtitle
        c.setFont("Helvetica", 12)
        c.setFillColor(self.color_text)
        c.drawCentredString(self.page_width / 2, self.page_height - 3.7*cm, "Training and Development")
    
    def _draw_title(self, c):
        """Draw certificate title"""
        c.setFont("Helvetica-Bold", 36)
        c.setFillColor(self.color_accent)
        c.drawCentredString(self.page_width / 2, self.page_height - 5.5*cm, "CERTIFICATE")
        
        c.setFont("Helvetica", 16)
        c.setFillColor(self.color_text)
        c.drawCentredString(self.page_width / 2, self.page_height - 6.5*cm, "of English Proficiency")
    
    def _draw_user_name(self, c, user_name):
        """Draw user's name prominently"""
        # "This certifies that" text
        c.setFont("Helvetica", 14)
        c.setFillColor(self.color_text)
        c.drawCentredString(self.page_width / 2, self.page_height - 8.5*cm, "This certifies that")
        
        # User name (large and prominent)
        c.setFont("Helvetica-Bold", 32)
        c.setFillColor(self.color_primary)
        c.drawCentredString(self.page_width / 2, self.page_height - 10*cm, user_name)
        
        # Underline for name
        name_width = c.stringWidth(user_name, "Helvetica-Bold", 32)
        line_start = (self.page_width - name_width) / 2
        line_end = (self.page_width + name_width) / 2
        c.setStrokeColor(self.color_accent)
        c.setLineWidth(2)
        c.line(line_start, self.page_height - 10.5*cm, line_end, self.page_height - 10.5*cm)
    
    def _draw_achievement_text(self, c, level, score):
        """Draw achievement details"""
        # Main text
        c.setFont("Helvetica", 14)
        c.setFillColor(self.color_text)
        
        text1 = "has successfully completed the English Level Test"
        c.drawCentredString(self.page_width / 2, self.page_height - 12*cm, text1)
        
        text2 = "and demonstrated proficiency at"
        c.drawCentredString(self.page_width / 2, self.page_height - 12.8*cm, text2)
        
        # Level (prominent)
        c.setFont("Helvetica-Bold", 28)
        c.setFillColor(self.color_accent)
        level_text = f"CEFR Level {level}"
        c.drawCentredString(self.page_width / 2, self.page_height - 14.5*cm, level_text)
        
        # Score
        c.setFont("Helvetica", 12)
        c.setFillColor(self.color_text)
        score_text = f"Score: {score}/116"
        c.drawCentredString(self.page_width / 2, self.page_height - 15.5*cm, score_text)
    
    def _draw_footer(self, c):
        """Draw footer with date and signature"""
        # Date
        current_date = datetime.now().strftime("%B %d, %Y")
        c.setFont("Helvetica", 11)
        c.setFillColor(self.color_text)
        
        # Left side - Date
        c.drawString(3*cm, 3*cm, "Date of Issue:")
        c.setFont("Helvetica-Bold", 11)
        c.drawString(3*cm, 2.5*cm, current_date)
        
        # Center - Signature line
        c.setFont("Helvetica", 11)
        signature_x = self.page_width / 2
        c.line(signature_x - 3*cm, 2.8*cm, signature_x + 3*cm, 2.8*cm)
        c.drawCentredString(signature_x, 2.3*cm, "Authorized Signature")
        
        # Right side - Certificate ID
        c.setFont("Helvetica", 9)
        c.setFillColor(HexColor('#999999'))
        cert_id = f"Certificate ID: CSLX-{datetime.now().strftime('%Y%m%d')}-{abs(hash(current_date)) % 10000:04d}"
        c.drawRightString(self.page_width - 3*cm, 2*cm, cert_id)


def generate_user_certificate(user_name, level, score, user_id):
    """
    Convenience function to generate a certificate
    
    Args:
        user_name (str): Full name of the user
        level (str): CEFR level
        score (int): Test score
        user_id (int): User ID for unique filename
    
    Returns:
        str: Path to the generated certificate
    """
    # Create certificates directory if it doesn't exist
    cert_dir = os.path.join('static', 'certificates')
    os.makedirs(cert_dir, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"certificate_{user_id}_{timestamp}.pdf"
    output_path = os.path.join(cert_dir, filename)
    
    # Generate certificate
    generator = CertificateGenerator()
    generator.generate_certificate(user_name, level, score, output_path)
    
    return output_path
