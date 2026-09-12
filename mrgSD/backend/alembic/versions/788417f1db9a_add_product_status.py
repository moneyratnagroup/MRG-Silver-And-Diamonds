"""add product status

Revision ID: 788417f1db9a
Revises: 4cc235adbc66
Create Date: 2026-09-11 13:14:53.702584

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '788417f1db9a'
down_revision: Union[str, Sequence[str], None] = '4cc235adbc66'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create the enum type first
    product_status_enum = sa.Enum('DRAFT', 'PUBLISHED', 'ARCHIVED', name='productstatus')
    product_status_enum.create(op.get_bind(), checkfirst=True)
    
    op.add_column('products', sa.Column('status', product_status_enum, nullable=True))
    
    # Migrate data
    op.execute("UPDATE products SET status = 'PUBLISHED' WHERE is_active = true")
    op.execute("UPDATE products SET status = 'DRAFT' WHERE is_active = false")
    
    op.create_index(op.f('ix_products_status'), 'products', ['status'], unique=False)
    op.drop_column('products', 'is_active')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('products', sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=True))
    
    # Migrate data back
    op.execute("UPDATE products SET is_active = true WHERE status = 'PUBLISHED'")
    op.execute("UPDATE products SET is_active = false WHERE status = 'DRAFT'")
    op.execute("UPDATE products SET is_active = false WHERE status = 'ARCHIVED'")
    
    op.drop_index(op.f('ix_products_status'), table_name='products')
    op.drop_column('products', 'status')
    
    # Drop the enum type
    product_status_enum = sa.Enum('DRAFT', 'PUBLISHED', 'ARCHIVED', name='productstatus')
    product_status_enum.drop(op.get_bind(), checkfirst=True)
