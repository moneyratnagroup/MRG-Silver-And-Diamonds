from fastapi import HTTPException


def validate_product_weights(gross_weight, stone_weight):
    if stone_weight and gross_weight is None:
        raise HTTPException(422, 'Gross weight is required when stone weight is provided')
    if gross_weight is not None and (stone_weight or 0) > gross_weight:
        raise HTTPException(422, 'Stone weight cannot exceed gross weight')
