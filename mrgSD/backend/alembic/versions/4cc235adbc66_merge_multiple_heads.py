"""Merge multiple heads

Revision ID: 4cc235adbc66
Revises: 3306be9f287f, 386c3c309bb4
Create Date: 2026-09-11 09:56:41.241366

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4cc235adbc66'
down_revision: Union[str, Sequence[str], None] = ('3306be9f287f', '386c3c309bb4')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
