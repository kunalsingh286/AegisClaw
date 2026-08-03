import httpx
import asyncio
import json

async def main():
    with open('cedar/policies/us_hipaa_nist.cedar') as f: 
        pol = f.read()
        
    payload = {
        'principal': 'AgentRole::"admin"', 
        'action': 'Action::"database_deletion"', 
        'resource': 'Endpoint::"/api/v1/db/delete"', 
        'context': {'requested_amount': 0}, 
        'policies': pol
    }
    
    async with httpx.AsyncClient() as c:
        res = await c.post('http://localhost:8180/v1/is_authorized', json=payload)
        print("US RESPONSE:", res.text)
        
    with open('cedar/policies/eu_ai_act.cedar') as f:
        pol_eu = f.read()
        
    payload_eu = {
        'principal': 'AgentRole::"finance_bot"', 
        'action': 'Action::"execute_wire_transfer"', 
        'resource': 'Endpoint::"/api/v1/wire/transfer"', 
        'context': {'requested_amount': 5000}, 
        'policies': pol_eu
    }
    async with httpx.AsyncClient() as c:
        res2 = await c.post('http://localhost:8180/v1/is_authorized', json=payload_eu)
        print("EU RESPONSE:", res2.text)

asyncio.run(main())
