"""
Script de test pour le générateur de certificat premium WeasyPrint
"""

import os
import sys

def test_certificate_generation():
    """Test la génération d'un certificat premium"""
    
    try:
        from weasyprint_certificate_generator import PremiumCertificateGenerator
        
        print("✅ Module WeasyPrint importé avec succès")
        
        # Créer le générateur
        generator = PremiumCertificateGenerator()
        print("✅ Générateur créé avec succès")
        
        # Test de génération
        print("\n🔄 Génération du certificat de test...")
        
        cert_path = generator.generate_certificate(
            user_name="John Doe",
            level="B2",
            reading_score=65,
            listening_score=20,
            total_score=85,
            user_id=999
        )
        
        if os.path.exists(cert_path):
            file_size = os.path.getsize(cert_path)
            print(f"✅ Certificat généré avec succès !")
            print(f"   📄 Chemin : {cert_path}")
            print(f"   📊 Taille : {file_size:,} octets")
            return True
        else:
            print(f"❌ Erreur : Le fichier n'existe pas : {cert_path}")
            return False
            
    except ImportError as e:
        print(f"❌ Erreur d'import : {e}")
        print("\n💡 Solution : Installez WeasyPrint avec :")
        print("   pip install WeasyPrint==60.2")
        return False
        
    except Exception as e:
        print(f"❌ Erreur lors de la génération : {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("🧪 Test du Générateur de Certificat Premium WeasyPrint")
    print("=" * 60)
    print()
    
    success = test_certificate_generation()
    
    print()
    print("=" * 60)
    if success:
        print("✅ Tous les tests ont réussi !")
        sys.exit(0)
    else:
        print("❌ Des erreurs ont été détectées")
        sys.exit(1)
