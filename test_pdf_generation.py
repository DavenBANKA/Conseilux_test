"""
Script de test pour la génération de certificats PDF
Exécutez ce script pour tester la génération sans avoir besoin de l'application Flask
"""
from pdf_certificate_generator import CertificateGenerator, create_user_certificate
from datetime import datetime
import os


def test_basic_certificate():
    """Test de génération basique d'un certificat"""
    print("🧪 Test 1: Génération d'un certificat basique...")
    
    generator = CertificateGenerator()
    output_path = "test_certificate_basic.pdf"
    
    generator.generate_certificate(
        output_path=output_path,
        full_name="Jean Dupont",
        level="B2",
        completion_date=datetime.now()
    )
    
    if os.path.exists(output_path):
        print(f"✅ Certificat créé avec succès: {output_path}")
        print(f"   Taille: {os.path.getsize(output_path)} bytes")
    else:
        print("❌ Échec de la création du certificat")


def test_helper_function():
    """Test de la fonction helper"""
    print("\n🧪 Test 2: Utilisation de la fonction helper...")
    
    pdf_path = create_user_certificate(
        full_name="Marie Martin",
        level="C1"
    )
    
    if os.path.exists(pdf_path):
        print(f"✅ Certificat créé avec succès: {pdf_path}")
        print(f"   Taille: {os.path.getsize(pdf_path)} bytes")
    else:
        print("❌ Échec de la création du certificat")


def test_multiple_levels():
    """Test avec différents niveaux CEFR"""
    print("\n🧪 Test 3: Génération pour tous les niveaux CEFR...")
    
    levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
    
    for level in levels:
        pdf_path = create_user_certificate(
            full_name=f"Test User {level}",
            level=level,
            output_dir="test_certificates"
        )
        
        if os.path.exists(pdf_path):
            print(f"✅ Niveau {level}: {pdf_path}")
        else:
            print(f"❌ Niveau {level}: Échec")


def test_special_characters():
    """Test avec des caractères spéciaux dans le nom"""
    print("\n🧪 Test 4: Noms avec caractères spéciaux...")
    
    names = [
        "François Müller",
        "José García",
        "Søren Østergård",
        "Владимир Петров"
    ]
    
    for name in names:
        try:
            pdf_path = create_user_certificate(
                full_name=name,
                level="B1",
                output_dir="test_certificates"
            )
            print(f"✅ {name}: {pdf_path}")
        except Exception as e:
            print(f"⚠️  {name}: {str(e)}")


if __name__ == "__main__":
    print("=" * 60)
    print("TEST DE GÉNÉRATION DE CERTIFICATS PDF")
    print("=" * 60)
    
    test_basic_certificate()
    test_helper_function()
    test_multiple_levels()
    test_special_characters()
    
    print("\n" + "=" * 60)
    print("TESTS TERMINÉS")
    print("=" * 60)
    print("\n📁 Vérifiez les fichiers PDF générés dans:")
    print("   - Racine du projet (test_certificate_basic.pdf)")
    print("   - Dossier certificates/")
    print("   - Dossier test_certificates/")
