"""Add password column to parents table

Revision ID: 0002_add_parent_password
Revises: 0001_initial_schema
Create Date: 2026-09-22 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0002_add_parent_password'
down_revision: Union[str, None] = '0001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'parents',
        sa.Column('password', sa.String(), server_default='parent123', nullable=True)
    )


def downgrade() -> None:
    op.drop_column('parents', 'password')
