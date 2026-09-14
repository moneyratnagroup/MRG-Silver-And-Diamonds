"""merge heads

Revision ID: b45e31e7050a
Revises: 3306be9f287f, 386c3c309bb4
Create Date: 2026-09-11 17:13:16.634612

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b45e31e7050a'
down_revision: Union[str, Sequence[str], None] = ('3306be9f287f', '386c3c309bb4')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
