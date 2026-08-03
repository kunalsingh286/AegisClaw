import httpx
import asyncio

async def main():
    pol = """
permit(
    principal == User::"alice",
    action == Action::"view",
    resource == Document::"123"
);
"""
    payload = {
        'principal': 'User::"alice"', 
        'action': 'Action::"view"', 
        'resource': 'Document::"123"', 
        'context': {}, 
        'policies': pol
    }
    
    async with httpx.AsyncClient() as c:
        res = await c.post('http://localhost:8180/v1/is_authorized', json=payload)
        print("MINIMAL ALICE RESPONSE:", res.text)

asyncio.run(main())
