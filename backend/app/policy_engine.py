import os
import httpx

CEDAR_PDP_URL = os.getenv("CEDAR_PDP_URL", "http://cedar-pdp:8180/v1/is_authorized")
POLICIES_DIR = "/app/cedar/policies"

REGION_POLICY_MAP = {
    "US": "us_hipaa_nist.cedar",
    "EU": "eu_ai_act.cedar",
    "IN": "default_tenant.cedar"
}

async def _evaluate_policy_internal(
    http_client: httpx.AsyncClient, 
    principal: str, 
    action: str, 
    resource: str, 
    requested_amount: int,
    tenant_id: str,
    region: str
) -> bool:
    if not principal or not action or not resource:
        return False

    # Multi-tenant and Region policy resolution
    policy_path = os.path.join(POLICIES_DIR, f"{tenant_id}.cedar")
    
    if not os.path.exists(policy_path):
        region_file = REGION_POLICY_MAP.get(region, "default_tenant.cedar")
        policy_path = os.path.join(POLICIES_DIR, region_file)
        
    if not os.path.exists(policy_path):
        policy_path = os.path.join(POLICIES_DIR, "default_tenant.cedar")
        
    try:
        with open(policy_path, "r") as f:
            policy_content = f.read()
    except Exception as e:
        print(f"Policy Read Error: {e}")
        return False

    payload = {
        "principal": f'AgentRole::"{principal}"',
        "action": f'Action::"{action}"',
        "resource": f'Endpoint::"{resource}"',
        "context": {
            "requested_amount": requested_amount
        },
        "policies": policy_content
    }
    
    response = await http_client.post(CEDAR_PDP_URL, json=payload)
    response.raise_for_status()
    
    result = response.json()
    decision = result.get("decision", "Deny")
    return decision == "Allow"

# Wrap with Circuit Breaker
from app.circuit_breaker import cedar_cb

async def evaluate_policy(
    http_client: httpx.AsyncClient, 
    principal: str, 
    action: str, 
    resource: str, 
    requested_amount: int,
    tenant_id: str = "default_tenant",
    region: str = "IN"
) -> bool:
    return await cedar_cb.call(
        _evaluate_policy_internal, 
        http_client, 
        principal, 
        action, 
        resource, 
        requested_amount, 
        tenant_id,
        region
    )
