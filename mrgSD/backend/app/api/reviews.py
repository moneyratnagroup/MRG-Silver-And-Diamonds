from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.database.database import get_db
from app.models.review import Review
from app.models.product import Product
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewItem, ProductReviewsResponse
from app.api.auth import get_current_user

router = APIRouter(tags=["Reviews"])

@router.get("/product/{product_id}", response_model=ProductReviewsResponse)
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    # Verify product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    reviews = (
        db.query(Review)
        .filter(Review.product_id == product_id, Review.is_approved == True)
        .order_by(Review.created_at.desc())
        .all()
    )

    total_reviews = len(reviews)
    if total_reviews > 0:
        avg_score = round(sum(r.rating for r in reviews) / total_reviews, 1)
    else:
        avg_score = 0.0

    return ProductReviewsResponse(
        average_rating=avg_score,
        total_reviews=total_reviews,
        reviews=[
            ReviewItem.model_validate(review).model_copy(update={
                "admin_reply": None,
                "admin_replied_at": None,
            }) if review.admin_reply_hidden else ReviewItem.model_validate(review)
            for review in reviews
        ]
    )

@router.post("/", response_model=ReviewItem, status_code=status.HTTP_201_CREATED)
def create_review(
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify product exists
    product = db.query(Product).filter(Product.id == review_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Determine author name
    author_name = "Customer"
    if current_user.full_name and current_user.full_name.strip():
        author_name = current_user.full_name.strip()
    elif current_user.phone_number:
        # e.g., Customer ...1234
        last_digits = current_user.phone_number[-4:] if len(current_user.phone_number) >= 4 else current_user.phone_number
        author_name = f"Customer (...{last_digits})"

    new_review = Review(
        product_id=review_in.product_id,
        user_id=current_user.id,
        user_name=author_name,
        rating=review_in.rating,
        title=review_in.title.strip(),
        comment=review_in.comment.strip(),
        image_url=review_in.image_url,
        is_approved=True
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review

