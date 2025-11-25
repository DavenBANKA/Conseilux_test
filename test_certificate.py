"""
Test Certificate Generator - Quick test script
Run this to generate a sample certificate
"""

from certificate_generator import generate_user_certificate

# Generate a test certificate
cert_path = generate_user_certificate(
    user_name="John Doe",
    level="B2",
    score=75,
    user_id=1
)

print(f"✅ Certificate generated successfully!")
print(f"📄 Location: {cert_path}")
print(f"\nOpen the file to view your certificate.")
