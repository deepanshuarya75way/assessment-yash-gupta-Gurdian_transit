"""Initial database schema migration

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-09-22 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Students Table
    op.create_table(
        'students',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('roll_no', sa.String(), nullable=False, unique=True),
        sa.Column('grade', sa.String(), nullable=False),
        sa.Column('section', sa.String(), nullable=False),
        sa.Column('address', sa.String(), nullable=False),
        sa.Column('bus_id', sa.String(), nullable=False),
        sa.Column('bus_number', sa.String(), nullable=False),
        sa.Column('route_name', sa.String(), nullable=False),
        sa.Column('parent_id', sa.String(), nullable=False),
        sa.Column('parent_name', sa.String(), nullable=False),
        sa.Column('parent_phone', sa.String(), nullable=False),
        sa.Column('status', sa.String(), server_default='WAITING'),
        sa.Column('last_checkin', sa.String(), server_default='Not Checked In'),
        sa.Column('avatar_url', sa.String(), nullable=False),
        sa.Column('face_registered', sa.Boolean(), server_default=sa.text('true')),
        sa.Column('face_vector', sa.Text(), nullable=True),
    )
    op.create_index(op.f('ix_students_id'), 'students', ['id'], unique=False)
    op.create_index(op.f('ix_students_name'), 'students', ['name'], unique=False)
    op.create_index(op.f('ix_students_roll_no'), 'students', ['roll_no'], unique=True)

    # 2. Parents Table
    op.create_table(
        'parents',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('relation', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('address', sa.String(), nullable=False),
        sa.Column('emergency_contact', sa.String(), nullable=False),
        sa.Column('occupation', sa.String(), nullable=False),
        sa.Column('linked_student_ids', sa.Text(), server_default='[]'),
    )
    op.create_index(op.f('ix_parents_id'), 'parents', ['id'], unique=False)

    # 3. Buses Table
    op.create_table(
        'buses',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('bus_number', sa.String(), nullable=False, unique=True),
        sa.Column('license_plate', sa.String(), nullable=False),
        sa.Column('capacity', sa.Integer(), server_default='40'),
        sa.Column('total_assigned_students', sa.Integer(), server_default='30'),
        sa.Column('inside_bus_count', sa.Integer(), server_default='0'),
        sa.Column('offboarded_count', sa.Integer(), server_default='0'),
        sa.Column('waiting_count', sa.Integer(), server_default='0'),
        sa.Column('driver_id', sa.String(), nullable=False),
        sa.Column('driver_name', sa.String(), nullable=False),
        sa.Column('driver_phone', sa.String(), nullable=False),
        sa.Column('conductor_name', sa.String(), nullable=False),
        sa.Column('conductor_phone', sa.String(), nullable=False),
        sa.Column('route_id', sa.String(), nullable=False),
        sa.Column('route_name', sa.String(), nullable=False),
        sa.Column('current_location', sa.String(), server_default='Main Depot'),
        sa.Column('gps_status', sa.String(), server_default='ONLINE'),
        sa.Column('camera_status', sa.String(), server_default='ONLINE'),
        sa.Column('status', sa.String(), server_default='ON_ROUTE'),
        sa.Column('current_speed', sa.Integer(), server_default='38'),
        sa.Column('battery_fuel', sa.Integer(), server_default='90'),
        sa.Column('next_stop', sa.String(), server_default='Central Campus'),
        sa.Column('eta', sa.String(), server_default='10 mins'),
        sa.Column('latitude', sa.Float(), server_default='28.6289'),
        sa.Column('longitude', sa.Float(), server_default='77.3649'),
    )
    op.create_index(op.f('ix_buses_id'), 'buses', ['id'], unique=False)
    op.create_index(op.f('ix_buses_bus_number'), 'buses', ['bus_number'], unique=True)

    # 4. Routes Table
    op.create_table(
        'routes',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('start_destination', sa.String(), nullable=False),
        sa.Column('assigned_bus_id', sa.String(), nullable=False),
        sa.Column('assigned_bus_number', sa.String(), nullable=False),
        sa.Column('total_stops', sa.Integer(), server_default='4'),
        sa.Column('active_students_count', sa.Integer(), server_default='30'),
        sa.Column('stops', sa.Text(), server_default='[]'),
    )
    op.create_index(op.f('ix_routes_id'), 'routes', ['id'], unique=False)

    # 5. Attendance Table
    op.create_table(
        'attendance',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('student_id', sa.String(), nullable=False),
        sa.Column('student_name', sa.String(), nullable=False),
        sa.Column('roll_no', sa.String(), nullable=False),
        sa.Column('grade', sa.String(), nullable=False),
        sa.Column('bus_number', sa.String(), nullable=False),
        sa.Column('event_type', sa.String(), nullable=False),
        sa.Column('timestamp', sa.String(), nullable=False),
        sa.Column('confidence', sa.Float(), server_default='99.2'),
        sa.Column('verification_method', sa.String(), server_default='AI Face Biometrics'),
        sa.Column('status', sa.String(), server_default='VERIFIED'),
        sa.Column('photo_url', sa.String(), nullable=False),
        sa.Column('shift', sa.String(), server_default='Morning Pickup'),
        sa.Column('stop_location', sa.String(), server_default='Main Station'),
    )
    op.create_index(op.f('ix_attendance_id'), 'attendance', ['id'], unique=False)

    # 6. Alerts Table
    op.create_table(
        'alerts',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('severity', sa.String(), server_default='CRITICAL'),
        sa.Column('bus_number', sa.String(), nullable=False),
        sa.Column('timestamp', sa.String(), nullable=False),
        sa.Column('type', sa.String(), server_default='UNAUTHORIZED_PERSON'),
        sa.Column('resolved', sa.Boolean(), server_default=sa.text('false')),
    )
    op.create_index(op.f('ix_alerts_id'), 'alerts', ['id'], unique=False)


def downgrade() -> None:
    op.drop_table('alerts')
    op.drop_table('attendance')
    op.drop_table('routes')
    op.drop_table('buses')
    op.drop_table('parents')
    op.drop_table('students')
