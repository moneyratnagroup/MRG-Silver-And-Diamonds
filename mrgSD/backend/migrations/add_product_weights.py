"""Apply only the additive weight migration on databases with older Alembic history.

Run from backend: python migrations/add_product_weights.py
Does not stamp Alembic or run unrelated migrations.
"""
import importlib.util
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from alembic.migration import MigrationContext
from alembic.operations import Operations
from sqlalchemy import inspect, text
from app.database.database import engine


def main():
    migration_path = Path(__file__).resolve().parents[1] / 'alembic/versions/d217ae604f83_add_product_weights_and_making_charges.py'
    spec = importlib.util.spec_from_file_location('product_weight_migration', migration_path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    with engine.begin() as connection:
        # Compare every existing column and row before committing the additive change.
        columns = [column['name'] for column in inspect(connection).get_columns('products')]
        quoted = ', '.join(connection.dialect.identifier_preparer.quote(name) for name in columns)
        query = text(f'SELECT {quoted} FROM products ORDER BY id')
        before = connection.execute(query).all()
        with Operations.context(MigrationContext.configure(connection)):
            migration.upgrade()
        after = connection.execute(query).all()
        if before != after:
            raise RuntimeError('Existing product data changed; rolling back migration')
        print(f'Weight columns ready. Verified all {len(before)} existing products are unchanged.')


if __name__ == '__main__':
    main()
