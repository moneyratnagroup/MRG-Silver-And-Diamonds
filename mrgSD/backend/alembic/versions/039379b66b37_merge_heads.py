"""Merge heads

Revision ID: 039379b66b37
Revises: 411fea01054d, b45e31e7050a
Create Date: 2026-09-16 16:36:08.785938

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '039379b66b37'
down_revision: Union[str, Sequence[str], None] = ('411fea01054d', 'b45e31e7050a')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
