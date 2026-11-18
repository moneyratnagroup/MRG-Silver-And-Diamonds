"""Add nullable product weights and making charges without changing existing rows.

Net weight is derived from gross weight minus stone weight by the product model.
The grams column is separate from the legacy free-text stone_weight column.
"""
from alembic import op
import sqlalchemy as sa

revision = 'd217ae604f83'
down_revision = '378c071d6171'
branch_labels = None
depends_on = None


def upgrade():
    existing = {column['name'] for column in sa.inspect(op.get_bind()).get_columns('products')}
    for name in ('gross_weight', 'stone_weight_grams', 'making_charges'):
        if name not in existing:
            op.add_column('products', sa.Column(name, sa.Float(), nullable=True))


def downgrade():
    for name in ('making_charges', 'stone_weight_grams', 'gross_weight'):
        op.drop_column('products', name)
