"""
Subscriptions endpoints
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/plans")
async def get_plans():
    """Get subscription plans"""
    return {"message": "Get plans - to be implemented"}

@router.post("/subscribe")
async def subscribe():
    """Subscribe to a plan"""
    return {"message": "Subscribe - to be implemented"}
