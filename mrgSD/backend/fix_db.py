import psycopg2

def run_migration():
    conn = psycopg2.connect('postgresql://postgres:post%40mrg34@localhost:5432/mrgSD_jwellery')
    cur = conn.cursor()
    try:
        cur.execute("CREATE TYPE productstatus AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');")
        conn.commit()
    except psycopg2.errors.DuplicateObject:
        conn.rollback()
        pass

    try:
        cur.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS status productstatus;")
        cur.execute("UPDATE products SET status = 'PUBLISHED' WHERE is_active = true;")
        cur.execute("UPDATE products SET status = 'DRAFT' WHERE is_active = false;")
        cur.execute("ALTER TABLE products DROP COLUMN IF EXISTS is_active;")
        conn.commit()
        print('Migration success!')
    except Exception as e:
        conn.rollback()
        print('Error:', e)
        
run_migration()
