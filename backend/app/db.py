import os
import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, String
from sqlalchemy.future import select

# Default to Postgres, fallback to SQLite for local pytest
raw_db_url = os.environ.get("DATABASE_URL", "sqlite+aiosqlite:///aegisclaw.db")
# Fix for Railway/Heroku which provide postgresql:// but we need postgresql+asyncpg://
if raw_db_url.startswith("postgres://") or raw_db_url.startswith("postgresql://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    raw_db_url = raw_db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
DATABASE_URL = raw_db_url

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    tenant_id = Column(String, nullable=False)
    created_at = Column(String, nullable=False)

class APIKey(Base):
    __tablename__ = "api_keys"
    id = Column(String, primary_key=True)
    api_key = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    tenant_id = Column(String, nullable=False)
    created_at = Column(String, nullable=False)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def generate_api_key(name: str, tenant_id: str):
    async with AsyncSessionLocal() as session:
        key_id = str(uuid.uuid4())
        api_key = f"AegisClaw_sk_live_{uuid.uuid4().hex}"
        created_at = datetime.utcnow().isoformat()
        
        new_key = APIKey(id=key_id, api_key=api_key, name=name, tenant_id=tenant_id, created_at=created_at)
        session.add(new_key)
        await session.commit()
        
        return {
            "id": key_id,
            "api_key": api_key,
            "name": name,
            "tenant_id": tenant_id,
            "created_at": created_at
        }

async def get_all_keys(tenant_id: str):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(APIKey).where(APIKey.tenant_id == tenant_id).order_by(APIKey.created_at.desc())
        )
        keys = result.scalars().all()
        return [
            {
                "id": k.id,
                "api_key": k.api_key,
                "name": k.name,
                "tenant_id": k.tenant_id,
                "created_at": k.created_at
            }
            for k in keys
        ]

async def validate_api_key(api_key: str):
    # Returns the key object (with tenant_id) or None
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(APIKey).where(APIKey.api_key == api_key))
        return result.scalar_one_or_none()
