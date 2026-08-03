import io
import time
import redis.asyncio as redis
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

async def generate_ciso_audit_pdf(redis_client: redis.Redis, tenant_id: str) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'TitleStyle', parent=styles['Heading1'], fontSize=18, textColor=colors.darkblue, spaceAfter=20
    )
    header_style = ParagraphStyle(
        'HeaderStyle', parent=styles['Heading2'], fontSize=14, textColor=colors.black, spaceAfter=10, spaceBefore=15
    )
    normal_style = styles['Normal']
    
    elements = []
    
    # Header
    elements.append(Paragraph("AegisClaw AI Agent Governance", title_style))
    elements.append(Paragraph("Executive Risk & Compliance Audit", title_style))
    elements.append(Paragraph(f"Generated At: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}", normal_style))
    elements.append(Spacer(1, 20))
    
    # Fetch Data
    pii_count_str = await redis_client.get(f"tenant:{tenant_id}:pii_redactions_count")
    pii_count = int(pii_count_str) if pii_count_str else 0
    
    prevented_spend = await redis_client.get(f"tenant:{tenant_id}:prevented_spend")
    prevented_spend = float(prevented_spend) if prevented_spend else 0.0
    
    audit_len = await redis_client.llen(f"tenant:{tenant_id}:audit_ledger")
    
    from app.audit_engine import verify_audit_chain
    verify_res = await verify_audit_chain(redis_client, tenant_id)
    chain_valid = verify_res.get("chain_valid", False)
    
    # Section 1
    elements.append(Paragraph("Section 1: DPDP Act Compliance Score", header_style))
    elements.append(Paragraph(f"Total PII Redactions (Aadhaar, PAN, UPI, Mobile): {pii_count}", normal_style))
    elements.append(Spacer(1, 10))
    
    # Section 2
    elements.append(Paragraph("Section 2: RBI Financial Risk Shield", header_style))
    elements.append(Paragraph(f"Total Rupees in Unauthorized Spend Prevented: \u20b9{prevented_spend:,.2f}", normal_style))
    elements.append(Spacer(1, 10))
    
    # Section 3
    elements.append(Paragraph("Section 3: Cryptographic Evidence Verification", header_style))
    status_color = "<font color='green'>VALID</font>" if chain_valid else "<font color='red'>TAMPERED</font>"
    elements.append(Paragraph(f"SHA-256 Merkle Chain Status: <b>{status_color}</b>", normal_style))
    elements.append(Paragraph(f"Total Audit Records: {audit_len}", normal_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
