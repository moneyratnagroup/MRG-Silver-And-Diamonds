from fastapi import APIRouter
from app.api.admin import auth, products, metal_rates, banners, coupons, testimonials

admin_router = APIRouter()

admin_router.include_router(auth.router, prefix="/auth", tags=["Admin Auth"])
admin_router.include_router(products.router, prefix="/products", tags=["Admin Products"])
admin_router.include_router(metal_rates.router, prefix="/metal-rates", tags=["Admin Metal Rates"])
admin_router.include_router(banners.router, prefix="/banners", tags=["Admin Banners"])
admin_router.include_router(coupons.router, prefix="/coupons", tags=["Admin Coupons"])
admin_router.include_router(testimonials.router, prefix="/testimonials", tags=["Admin Testimonials"])

__all__ = ["admin_router"]
