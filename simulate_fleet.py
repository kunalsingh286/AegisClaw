import time
import httpx
import asyncio
import uuid

PROXY_URL = "http://127.0.0.1:8000/proxy/httpbin.org/anything"

async def simulate():
    print("Starting Live Fleet Simulator (Multi-Tenant SaaS Mode)...")
    
    async with httpx.AsyncClient() as client:
        # Step 0: Register a mock tenant account
        mock_email = f"simulator_{uuid.uuid4().hex[:6]}@example.com"
        mock_password = "password123"
        print(f"Registering mock tenant: {mock_email}")
        
        reg_res = await client.post("http://127.0.0.1:8000/auth/register", json={"email": mock_email, "password": mock_password})
        if reg_res.status_code != 200:
            print(f"Failed to register: {reg_res.text}")
            return
            
        print("Logging in to get JWT...")
        login_res = await client.post("http://127.0.0.1:8000/auth/login", json={"email": mock_email, "password": mock_password})
        if login_res.status_code != 200:
            print(f"Failed to login: {login_res.text}")
            return
            
        jwt_token = login_res.json()["access_token"]
        
        # Step 1: Get API Key for Authentication using JWT
        print("Fetching Provisioned API Key...")
        headers = {"Authorization": f"Bearer {jwt_token}"}
        key_res = await client.get("http://127.0.0.1:8000/admin/keys", headers=headers)
        if key_res.status_code != 200:
            print(f"Failed to fetch keys: {key_res.text}")
            return
            
        keys = key_res.json()
        if not keys:
            print("No keys found for tenant.")
            return
            
        api_key = keys[0]["api_key"]
        print(f"Got API Key: {api_key}")
        
        base_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        while True:
            # Scenario A (India): Agent attempts refund with Aadhaar ID and PAN card
            print("[Agent 1] Sending IN-Region PII leak request...")
            try:
                headers = {**base_headers, "X-Agent-ID": "agent_1_support", "X-Agent-Role": "customer_servicing_bot", "X-Requested-Amount": "2000", "X-Compliance-Region": "IN"}
                res1 = await client.post(
                    f"http://127.0.0.1:8000/proxy/httpbin.org/api/v1/payments/refund",
                    headers=headers,
                    json={"ticket_id": "T-1234", "user": "John Doe", "pan_card": "ABCDE1234F", "aadhaar": "1234 5678 9012"}
                )
                print(f"  -> Result: {res1.status_code}")
            except Exception as e:
                print(f"  -> Error: {e}")
            await asyncio.sleep(2)
            
            # Scenario B (US): Agent attempts database export containing US SSN and credit card
            print("[Agent 2] Sending US-Region DB Export with SSN/CC...")
            try:
                headers = {**base_headers, "X-Agent-ID": "agent_2_export", "X-Agent-Role": "analytics_bot", "X-Requested-Amount": "0", "X-Compliance-Region": "US"}
                res2 = await client.post(
                    f"http://127.0.0.1:8000/proxy/httpbin.org/api/v1/db/export",
                    headers=headers,
                    json={"export_id": "EXP-999", "data_sample": {"ssn": "123-45-6789", "cc": "4111222233334444", "patient": "John Smith"}}
                )
                print(f"  -> Result: {res2.status_code} {res2.text}")
            except Exception as e:
                print(f"  -> Error: {e}")
            await asyncio.sleep(2)
            
            # Scenario C (EU): Agent attempts €15,000 transfer with IBAN number
            print("[Agent 3] Sending EU-Region High-Value Transfer...")
            try:
                headers = {**base_headers, "X-Agent-ID": "agent_3_finance", "X-Agent-Role": "finance_bot", "X-Requested-Amount": "15000", "X-Compliance-Region": "EU"}
                res3 = await client.post(
                    f"http://127.0.0.1:8000/proxy/httpbin.org/api/v1/wire/transfer",
                    headers=headers,
                    json={"recipient": "EU Corp", "iban": "DE89370400440532013000"}
                )
                print(f"  -> Result: {res3.status_code}")
            except Exception as e:
                print(f"  -> Error: {e}")
            await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(simulate())
