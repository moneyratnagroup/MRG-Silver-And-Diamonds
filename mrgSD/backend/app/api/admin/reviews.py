from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql import func
from typing import List, Optional
from app.database.database import get_db
from app.models.review import Review
from app.models.product import Product
from app.core.security import security_scheme, decode_access_token
from app.core.config import settings
from fastapi.security import HTTPAuthorizationCredentials
from app.schemas.review import AdminReviewItem, ReviewStatusUpdate, ReviewReplyRequest, ReviewReplyVisibilityUpdate

router = APIRouter()

@router.get("/", response_model=List[AdminReviewItem])
def get_all_reviews(
    skip: int = 0,
    limit: int = 100,
    rating: Optional[int] = None,
    is_approved: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = (
        db.query(Review)
        .options(joinedload(Review.product).joinedload(Product.images))
        .order_by(Review.created_at.desc())
    )

    if rating is not None:
        query = query.filter(Review.rating == rating)

    if is_approved is not None:
        query = query.filter(Review.is_approved == is_approved)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (Review.title.ilike(search_filter)) |
            (Review.comment.ilike(search_filter)) |
            (Review.user_name.ilike(search_filter))
        )

    reviews = query.offset(skip).limit(limit).all()

    result = []
    for r in reviews:
        prod_name = r.product.name if r.product else "Unknown Product"
        prod_img = None
        if r.product and r.product.images and len(r.product.images) > 0:
            prod_img = r.product.images[0].image_url

        result.append(
            AdminReviewItem(
                id=r.id,
                product_id=r.product_id,
                product_name=prod_name,
                product_image=prod_img,
                user_id=r.user_id,
                user_name=r.user_name,
                rating=r.rating,
                title=r.title,
                comment=r.comment,
                image_url=r.image_url,
                is_approved=r.is_approved,
                admin_reply=r.admin_reply,
                admin_reply_hidden=r.admin_reply_hidden,
                admin_replied_at=r.admin_replied_at,
                created_at=r.created_at
            )
        )

    return result

@router.patch("/{review_id}/status", response_model=AdminReviewItem)
def update_review_status(
    review_id: int,
    status_update: ReviewStatusUpdate,
    db: Session = Depends(get_db)
):
    review = db.query(Review).options(joinedload(Review.product).joinedload(Product.images)).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_approved = status_update.is_approved
    db.commit()
    db.refresh(review)

    prod_name = review.product.name if review.product else "Unknown Product"
    prod_img = None
    if review.product and review.product.images and len(review.product.images) > 0:
        prod_img = review.product.images[0].image_url

    return AdminReviewItem(
        id=review.id,
        product_id=review.product_id,
        product_name=prod_name,
        product_image=prod_img,
        user_id=review.user_id,
        user_name=review.user_name,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        image_url=review.image_url,
        is_approved=review.is_approved,
        admin_reply=review.admin_reply,
        admin_reply_hidden=review.admin_reply_hidden,
        admin_replied_at=review.admin_replied_at,
        created_at=review.created_at
    )

@router.patch("/{review_id}/reply", response_model=AdminReviewItem)
def reply_to_review(
    review_id: int,
    reply_data: ReviewReplyRequest,
    db: Session = Depends(get_db)
):
    review = db.query(Review).options(joinedload(Review.product).joinedload(Product.images)).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if reply_data.admin_reply and reply_data.admin_reply.strip():
        review.admin_reply = reply_data.admin_reply.strip()
        review.admin_replied_at = func.now()
    else:
        review.admin_reply_hidden = False
        review.admin_reply = None
        review.admin_replied_at = None

    db.commit()
    db.refresh(review)

    prod_name = review.product.name if review.product else "Unknown Product"
    prod_img = None
    if review.product and review.product.images and len(review.product.images) > 0:
        prod_img = review.product.images[0].image_url

    return AdminReviewItem(
        id=review.id,
        product_id=review.product_id,
        product_name=prod_name,
        product_image=prod_img,
        user_id=review.user_id,
        user_name=review.user_name,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        image_url=review.image_url,
        is_approved=review.is_approved,
        admin_reply=review.admin_reply,
        admin_reply_hidden=review.admin_reply_hidden,
        admin_replied_at=review.admin_replied_at,
        created_at=review.created_at
    )

@router.delete("/{review_id}", status_code=status.HTTP_200_OK)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully"}



@router.patch("/{review_id}/reply/visibility", response_model=AdminReviewItem)
def update_reply_visibility(
    review_id: int,
    visibility: ReviewReplyVisibilityUpdate,
    db: Session = Depends(get_db),
):
    review = db.query(Review).options(joinedload(Review.product).joinedload(Product.images)).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if not review.admin_reply:
        raise HTTPException(status_code=400, detail="This review has no reply")
    review.admin_reply_hidden = visibility.admin_reply_hidden
    db.commit()
    db.refresh(review)
    item = {
        **{field: getattr(review, field) for field in AdminReviewItem.model_fields if hasattr(review, field)},
        "product_name": review.product.name if review.product else "Unknown Product",
        "product_image": review.product.images[0].image_url if review.product and review.product.images else None,
    }
    return AdminReviewItem(**item)
